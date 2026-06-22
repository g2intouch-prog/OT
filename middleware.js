export async function middleware(request) {
  const ip = request.headers.get('x-real-ip') || '127.0.0.1';
  const urlObj = new URL(request.url);
  const path = urlObj.pathname;

  // Apply rate limiting to sensitive authentication endpoints
  if (path.startsWith('/api/login') || path.startsWith('/api/settings/credentials')) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token) {
      try {
        const key = `rate-limit:${ip}:${path}`;
        
        // Call Upstash REST API to increment count
        const incrRes = await fetch(`${url}/incr/${key}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (incrRes.ok) {
          const data = await incrRes.json();
          const currentCount = data.result;
          
          if (currentCount === 1) {
            // Set 60 seconds expiration on first request
            await fetch(`${url}/expire/${key}/60`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }

          if (currentCount > 5) {
            return new Response(
              JSON.stringify({ error: 'Too Many Requests. Please try again later.' }),
              { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
          }
        }
      } catch (err) {
        console.error('Edge rate-limiting error:', err);
      }
    }
  }

  // Instruct Vercel routing to proceed to standard route handlers
  return new Response(null, {
    headers: { 'x-middleware-next': '1' }
  });
}
