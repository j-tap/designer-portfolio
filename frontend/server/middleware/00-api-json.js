export default defineEventHandler((event) => {
  const path = event.path || getRequestURL(event).pathname

  if (path.startsWith('/api/') || path === '/api') {
    event.node.req.headers['accept'] = 'application/json'
  }
})
