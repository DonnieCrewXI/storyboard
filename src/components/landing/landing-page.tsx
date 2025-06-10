'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth/auth-provider'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { 
  Film, 
  Users, 
  Palette, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Play,
} from 'lucide-react'

export function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [showEmailInput, setShowEmailInput] = useState(false)

  const handleSignIn = async () => {
    if (!showEmailInput) {
      setShowEmailInput(true)
      return
    }

    if (!email) {
      alert('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
      alert('Check your email for the magic link!')
    } catch (error) {
      console.error('Error signing in:', error)
      alert('Error sending magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Storyboard AI</span>
          </div>
          <div className="flex items-center space-x-2">
            {showEmailInput && (
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-64"
                onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
              />
            )}
            <Button onClick={handleSignIn} disabled={isLoading}>
              {isLoading ? 'Sending...' : showEmailInput ? 'Send Magic Link' : 'Sign In'}
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Stories Into
            <span className="text-blue-600"> Visual Masterpieces</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create consistent characters, build immersive worlds, and generate production-ready storyboards with AI. 
            The complete visual storytelling platform for creators.
          </p>
          {showEmailInput && (
            <div className="flex justify-center mb-6">
              <Input
                type="email"
                placeholder="Enter your email to get started"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-md text-center"
                onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
              />
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleSignIn} disabled={isLoading} className="text-lg px-8 py-3">
              <Play className="mr-2 h-5 w-5" />
              {isLoading ? 'Sending...' : showEmailInput ? 'Send Magic Link' : 'Start Creating Free'}
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Visual Storytelling
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From character creation to final storyboard, our AI-powered platform handles every step of your visual narrative journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Consistent Characters</CardTitle>
              <CardDescription>
                Create and fine-tune AI models for your characters. Generate unlimited variations while maintaining perfect consistency across all scenes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Palette className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Immersive Environments</CardTitle>
              <CardDescription>
                Build rich, detailed worlds and environments. From fantasy realms to modern cityscapes, create the perfect backdrop for your story.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>AI-Powered Storyboards</CardTitle>
              <CardDescription>
                Transform your scripts into professional storyboards. Our AI understands narrative context to create compelling visual sequences.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple 4-Step Workflow
            </h2>
            <p className="text-xl text-gray-600">
              From concept to completion in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Characters",
                description: "Upload reference images and let AI fine-tune character models for perfect consistency."
              },
              {
                step: "2", 
                title: "Build Your World",
                description: "Design environments and props that bring your story's setting to life."
              },
              {
                step: "3",
                title: "Write Your Script",
                description: "Our AI helps structure your narrative with intelligent scene and chapter organization."
              },
              {
                step: "4",
                title: "Generate Storyboard",
                description: "Transform your script into professional visual storyboards with contextual AI generation."
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600">
            Start free, upgrade when you&apos;re ready to scale
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for trying out the platform</CardDescription>
              <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-gray-600">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "5 Character credits",
                  "3 Environment credits", 
                  "5 Prop credits",
                  "2 Stories maximum",
                  "3 Chapters per story"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6" onClick={handleSignIn} disabled={isLoading}>
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          <Card className="relative border-blue-500 border-2">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For serious creators and professionals</CardDescription>
              <div className="text-3xl font-bold">$29<span className="text-lg font-normal text-gray-600">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  "50 Character credits",
                  "25 Environment credits",
                  "50 Prop credits", 
                  "20 Stories maximum",
                  "10 Chapters per story",
                  "Priority support",
                  "Advanced export options"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6" onClick={handleSignIn} disabled={isLoading}>
                Start Pro Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Bring Your Stories to Life?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using Storyboard AI to transform their narratives into stunning visual experiences.
          </p>
          <Button size="lg" variant="secondary" onClick={handleSignIn} disabled={isLoading} className="text-lg px-8 py-3">
            Start Creating Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Film className="h-6 w-6" />
            <span className="text-xl font-bold">Storyboard AI</span>
          </div>
          <p className="text-gray-400">
            © 2024 Storyboard AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
