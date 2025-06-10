# Storyboard AI - Visual Storytelling Platform

Transform your stories into visual masterpieces with AI-powered character creation, environment design, and storyboard generation.

## 🚀 Features

- **Magic Link Authentication** via Supabase
- **Character Creation** with AI fine-tuning support
- **Environment & Props Management**
- **Story Builder** with chapter and scene organization
- **AI-Powered Storyboard Generation**
- **Credit System** with Free and Pro tiers
- **Responsive Design** with modern UI/UX

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: Shadcn/UI, Radix UI
- **State Management**: TanStack Query
- **Deployment**: Vercel

## 🏗️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DonnieCrewXI/storyboard.git
cd storyboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Set up the database:
Run the SQL schema in `supabase-schema.sql` in your Supabase SQL editor.

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── ui/             # Base UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   └── landing/        # Landing page components
├── lib/                # Utility functions and configs
└── hooks/              # Custom React hooks
```

## 🗄️ Database Schema

The application uses Supabase with the following main tables:
- `profiles` - User accounts and credits
- `characters` - AI character models
- `environments` - Scene environments
- `props` - Story props
- `stories` - Story projects
- `chapters` - Story chapters
- `scenes` - Individual scenes

## 🚀 Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contact the team for contribution guidelines.
