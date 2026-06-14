import { rest } from 'msw'
import { server } from '../server'
import { discoverHobbies } from '../../lib/discover'

describe('discoverHobbies', () => {
  afterEach(() => {
    server.resetHandlers()
    // restore fetch mock if used
    if ((global as any).fetch && (global as any).fetch.restore) (global as any).fetch.restore()
  })

  test('returns fallback when API returns invalid payload', async () => {
    // Mock fetch to return an invalid payload
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ invalid: true }) })))

    const input = {
      triedHobbies: [],
      rejectedHobby: null,
      catalog: [
        { id: 'gardening', label: 'Gardening' },
        { id: 'cooking', label: 'Cooking' },
      ],
    }

    const out = await discoverHobbies(input as any)
    expect(out.headline).toBeTruthy()
    expect(Array.isArray(out.suggestions)).toBe(true)
    expect(out.suggestions.length).toBeGreaterThan(0)
  })

  test('returns API result when valid', async () => {
    // Mock fetch to return a valid payload
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ headline: 'test', suggestions: [{ hobbyId: 'gardening', hook: 'grow', emoji: '🌱', appeal: 'nice' }] }) }),
    ))

    const input = { triedHobbies: [], rejectedHobby: null, catalog: [] }
    const out = await discoverHobbies(input as any)
    expect(out.headline).toBe('test')
    expect(out.suggestions[0].hobbyId).toBe('gardening')
  })
})
