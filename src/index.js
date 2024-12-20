addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    const url = new URL(request.url)
    
    // 处理静态资源
    if (url.pathname.startsWith('/static')) {
      return fetch(request)
    }
  
    // 处理 API 请求
    if (url.pathname.startsWith('/api')) {
      // 处理您的 API 逻辑
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
  
    // 默认返回 index.html
    return fetch(`${url.origin}/index.html`)
  }