import express from 'express'
import cors from 'cors'
import cron from 'node-cron'
import { createServer } from 'http'
import { fileURLToPath } from 'url'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'

const PORT = 3002
const app = express()
const server = createServer(app)

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// In-memory cache for PWA
const cache = new Map()

// PWA API endpoints
app.get('/api/pwa/cache/:key', (req, res) => {
  const key = req.params.key
  const cached = cache.get(key)
  
  if (cached) {
    res.json({ data: cached.data, timestamp: cached.timestamp })
  } else {
    res.status(404).json({ error: 'Cache miss' })
  }
})

app.post('/api/pwa/cache/:key', (req, res) => {
  const key = req.params.key
  const data = req.body
  
  cache.set(key, {
    data,
    timestamp: new Date().toISOString()
  })
  
  res.json({ success: true, message: 'Cached successfully' })
})

app.delete('/api/pwa/cache/:key', (req, res) => {
  const key = req.params.key
  cache.delete(key)
  res.json({ success: true, message: 'Cache cleared' })
})

// Offline content serving
app.get('/api/pwa/offline/:path(*)', (req, res) => {
  const requestedPath = req.params[0]
  
  // Check if we have this content cached
  const cached = cache.get(`offline:${requestedPath}`)
  
  if (cached) {
    res.setHeader('Content-Type', cached.contentType)
    res.send(cached.data)
  } else {
    // Try to serve from public directory
    const filePath = path.join(__dirname, '../../public', requestedPath)
    
    if (existsSync(filePath)) {
      const content = readFileSync(filePath)
      const ext = path.extname(filePath)
      const contentType = getContentType(ext)
      
      res.setHeader('Content-Type', contentType)
      res.send(content)
    } else {
      res.status(404).json({ error: 'Content not found' })
    }
  }
})

// PWA configuration
app.get('/api/pwa/config', (req, res) => {
  const config = {
    name: 'Skillytics PWA',
    short_name: 'Skillytics',
    description: 'Learn programming through interactive missions',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      }
    ],
    shortcuts: [
        {
          "name": "Dashboard",
          "short_name": "Dashboard",
          "description": "View your learning progress",
          "url": "/",
          "icons": [
            {
              "src": "/icon-192x192.png",
              "sizes": "192x192"
            }
          ]
        }
      ]
    }
  }
  
  res.json(config)
})

// Sync endpoint for offline content
app.post('/api/pwa/sync', async (req, res) => {
  const { content, path } = req.body
  
  try {
    // Save to cache
    cache.set(`offline:${path}`, {
      data: content,
      contentType: getContentType(path.split('.').pop() || 'text/plain'),
      timestamp: new Date().toISOString()
    })
    
    // Here you could also save to a database for persistence
    // For now, we'll just cache in memory
    
    res.json({ 
      success: true, 
      message: 'Content synced for offline access',
      path: path
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

// Health check
app.get('/api/pwa/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cache_size: cache.size,
    uptime: process.uptime()
  })
})

// Start server
server.listen(PORT, () => {
  console.log(`🚀 PWA Service running on port ${PORT}`)
})