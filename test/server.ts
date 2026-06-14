import { setupServer } from 'msw/node'

// Create a server with no handlers by default. Individual tests add handlers with `server.use(...)`.
export const server = setupServer()
