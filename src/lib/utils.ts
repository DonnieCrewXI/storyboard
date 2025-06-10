import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

export function generateTriggerWord(name: string): string {
  // Generate a unique trigger word for character fine-tuning
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  return `${cleanName}_${randomSuffix}`
}

export function calculateChapterCount(totalMinutes: number): number {
  // Calculate optimal chapter count based on total length
  // Aim for 3-5 minutes per chapter
  if (totalMinutes <= 5) return 1
  if (totalMinutes <= 10) return 2
  if (totalMinutes <= 15) return 3
  return Math.ceil(totalMinutes / 5)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const PLAN_LIMITS = {
  free: {
    character_credits: 5,
    environment_credits: 3,
    prop_credits: 5,
    max_stories: 2,
    max_chapters_per_story: 3
  },
  pro: {
    character_credits: 50,
    environment_credits: 25,
    prop_credits: 50,
    max_stories: 20,
    max_chapters_per_story: 10
  }
} as const

export type PlanType = keyof typeof PLAN_LIMITS
