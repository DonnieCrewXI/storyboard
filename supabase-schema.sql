-- ========= EXTENSIONS & SETUP =========
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========= TABLES =========

-- 1. Profiles
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
  character_credits INT NOT NULL DEFAULT 5 CHECK (character_credits >= 0),
  environment_credits INT NOT NULL DEFAULT 3 CHECK (environment_credits >= 0),
  prop_credits INT NOT NULL DEFAULT 5 CHECK (prop_credits >= 0),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_plan_status TEXT
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile." ON public.profiles FOR ALL USING (auth.uid() = user_id);

-- 2. Characters
CREATE TABLE public.characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  backstory TEXT,
  image_primary_url TEXT,
  image_face_url TEXT,
  image_medium_url TEXT,
  image_expression_url TEXT,
  image_fullbody_url TEXT,
  finetune_id TEXT,
  trigger_word TEXT,
  model_status TEXT NOT NULL DEFAULT 'pending' CHECK (model_status IN ('pending', 'training', 'ready', 'failed')),
  job_started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_characters_user_id ON public.characters(user_id);
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own characters." ON public.characters FOR ALL USING (auth.uid() = user_id);

-- 3. Environments
CREATE TABLE public.environments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_environments_user_id ON public.environments(user_id);
ALTER TABLE public.environments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own environments." ON public.environments FOR ALL USING (auth.uid() = user_id);

-- 4. Props
CREATE TABLE public.props (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_props_user_id ON public.props(user_id);
ALTER TABLE public.props ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own props." ON public.props FOR ALL USING (auth.uid() = user_id);

-- 5. Stories and related tables
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  genre TEXT,
  visual_style_keywords TEXT,
  total_length_minutes INT,
  chapter_count INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_stories_user_id ON public.stories(user_id);
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own stories." ON public.stories FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.story_characters (
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, character_id)
);
ALTER TABLE public.story_characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage story casts." ON public.story_characters FOR ALL USING (auth.uid() = (SELECT user_id FROM stories WHERE id = story_id));

CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  chapter_index INT NOT NULL,
  finalized_script TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_chapters_story_id ON public.chapters(story_id);
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage chapters." ON public.chapters FOR ALL USING (auth.uid() = (SELECT user_id FROM stories WHERE id = story_id));

CREATE TABLE public.scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  scene_index INT NOT NULL,
  synopsis TEXT NOT NULL,
  environment_id UUID REFERENCES public.environments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_scenes_chapter_id ON public.scenes(chapter_id);
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage scenes." ON public.scenes FOR ALL USING (auth.uid() = (SELECT user_id FROM stories WHERE id = (SELECT story_id FROM chapters WHERE id = chapter_id)));

-- Join tables for scene-level assets and relationships
CREATE TABLE public.scene_characters (
  scene_id UUID NOT NULL REFERENCES public.scenes(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  PRIMARY KEY (scene_id, character_id)
);
ALTER TABLE public.scene_characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage scene characters." ON public.scene_characters FOR ALL USING (auth.uid() = (SELECT user_id FROM stories WHERE id = (SELECT story_id FROM chapters WHERE id = (SELECT chapter_id FROM scenes WHERE id = scene_id))));

CREATE TABLE public.scene_props (
  scene_id UUID NOT NULL REFERENCES public.scenes(id) ON DELETE CASCADE,
  prop_id UUID NOT NULL REFERENCES public.props(id) ON DELETE CASCADE,
  PRIMARY KEY (scene_id, prop_id)
);
ALTER TABLE public.scene_props ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage scene props." ON public.scene_props FOR ALL USING (auth.uid() = (SELECT user_id FROM stories WHERE id = (SELECT story_id FROM chapters WHERE id = (SELECT chapter_id FROM scenes WHERE id = scene_id))));

CREATE TABLE public.scene_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scene_id UUID NOT NULL REFERENCES public.scenes(id) ON DELETE CASCADE,
  source_character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  target_character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  relationship_modifier TEXT, -- e.g., "feels a surge of anger towards"
  CHECK (source_character_id <> target_character_id),
  UNIQUE (scene_id, source_character_id, target_character_id)
);
ALTER TABLE public.scene_relationships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage scene relationships." ON public.scene_relationships FOR ALL USING (auth.uid() = (SELECT user_id FROM stories WHERE id = (SELECT story_id FROM chapters WHERE id = (SELECT chapter_id FROM scenes WHERE id = scene_id))));

-- ========= FUNCTIONS & TRIGGERS =========
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========= STORAGE BUCKETS & POLICIES =========
INSERT INTO storage.buckets (id, name, public) VALUES ('asset_images', 'asset_images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('storyboard_panels', 'storyboard_panels', true) ON CONFLICT (id) DO NOTHING;
