import { rest } from 'msw'
import { server } from '../server'
import { callAiChat, resolveAiProvider } from '../../lib/ai-provider'

describe('ai-provider', () => {
  const ORIGINAL = { ...process.env }

  beforeEach(() => {
    // ensure we create a GitHub provider
    process.env.GITHUB_MODELS_TOKEN = 'test-token'
  })

  afterEach(() => {
    Object.assign(process.env, ORIGINAL)
    server.resetHandlers()
  })

  test('resolveAiProvider returns github provider when token set', () => {
    const p = resolveAiProvider()
    expect(p).not.toBeNull()
    expect(p?.url).toContain('models.github.ai')
    expect(p?.headers.Authorization).toContain('Bearer')
  })

  test('callAiChat posts composed messages and parses JSON-like content', async () => {
    server.use(
      rest.post('https://models.github.ai/inference/chat/completions', async (req, res, ctx) => {
        const body = await req.json()
        // The request should include messages
        expect(Array.isArray(body.messages)).toBe(true)
        // Reply with a JSON string inside the message content
        return res(
          ctx.json({
            choices: [{ message: { content: JSON.stringify({ text: 'hello' }) } }],
          }),
        )
      }),
    )

    const out = await callAiChat([{ role: 'user', content: 'what up' }])
    expect(out).toContain('hello')
  })

  test('callAiChat handles malformed responses gracefully', async () => {
    server.use(
      rest.post('https://models.github.ai/inference/chat/completions', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ choices: [{ message: { content: 'not json' } }] })),
      ),
    )

    const out = await callAiChat([{ role: 'user', content: 'tell me' }])
    // provider returns raw string if upstream returned non-JSON — keep behavior stable (null or string allowed)
    expect(typeof out === 'string' || out === null).toBe(true)
  })
})
