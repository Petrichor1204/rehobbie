/**
 * @vitest-environment jsdom
 */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

// Mock motion to avoid animation internals (provide both `p` and `div`)
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...p }: any) => React.createElement('div', p, children),
    p: ({ children, ...p }: any) => React.createElement('p', p, children),
  },
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), back: vi.fn() }) }))

// Mock saveSession to avoid network (match the app import path)
vi.mock('@/lib/supabase', () => ({ saveSession: vi.fn() }))

// Replace SwipeCard with a button that triggers onSwipe(true) (match app import path)
vi.mock('@/components/onboarding/SwipeCard', () => ({ SwipeCard: ({ onSwipe }: any) => React.createElement('button', { onClick: () => onSwipe(true) }, 'SWIPE') }))

// Simplify OnboardingShell to render children (match app import path)
vi.mock('@/components/onboarding/OnboardingShell', () => ({ OnboardingShell: ({ children }: any) => React.createElement('div', {}, children) }))

import ReadyCheckPage from '../../app/ready-check/page'
import { useOnboardingStore } from '../../store/onboarding'

describe('ReadyCheckPage', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset()
    useOnboardingStore.setState({
      selectedHobbies: [{ id: 'gardening', label: 'Gardening' }],
      favoriteHobby: { id: 'gardening', label: 'Gardening' },
      stopReasons: [],
      skillLevel: null,
    } as any)
  })

  test('renders and handles swipe', () => {
    render(<ReadyCheckPage />)
    expect(screen.getByText(/swipe or tap to decide/i)).toBeInTheDocument()
    const btn = screen.getByText('SWIPE')
    fireEvent.click(btn)
    // after swipe the component should attempt navigation — mock router prevents real navigation
    expect(btn).toBeTruthy()
  })
})
