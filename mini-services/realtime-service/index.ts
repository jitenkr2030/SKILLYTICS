import { Server } from 'socket.io'
import { createServer } from 'http'

const server = createServer()
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

const PORT = 3001

// Store active users and their sessions
const activeUsers = new Map()
const userSessions = new Map()
const liveMissions = new Map()

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // User joins with their profile
  socket.on('user:join', (userData) => {
    const { userId, name, level, xp } = userData
    
    activeUsers.set(socket.id, {
      userId,
      name,
      level,
      xp,
      joinedAt: new Date()
    })

    socket.join(`user:${userId}`)
    
    // Broadcast updated user count
    io.emit('stats:users', {
      count: activeUsers.size,
      users: Array.from(activeUsers.values())
    })

    console.log(`User ${name} joined the platform`)
  })

  // User starts a mission
  socket.on('mission:start', (data) => {
    const { userId, missionId, missionTitle } = data
    
    const sessionData = {
      userId,
      missionId,
      missionTitle,
      startedAt: new Date(),
      status: 'in_progress'
    }

    userSessions.set(socket.id, sessionData)
    liveMissions.set(missionId, {
      ...sessionData,
      activeUsers: (liveMissions.get(missionId)?.activeUsers || 0) + 1
    })

    socket.join(`mission:${missionId}`)
    
    // Update mission stats
    io.emit('stats:missions', {
      activeMissions: liveMissions.size,
      totalActive: Array.from(liveMissions.values()).reduce((sum, m) => sum + m.activeUsers, 0)
    })

    console.log(`User started mission: ${missionTitle}`)
  })

  // User requests help from AI mentor
  socket.on('mentor:help', (data) => {
    const { userId, missionId, code, question } = data
    
    // Simulate AI mentor response (in real app, this would call LLM service)
    setTimeout(() => {
      const mentorResponse = generateMentorResponse(code, question)
      
      socket.emit('mentor:response', {
        missionId,
        response: mentorResponse,
        timestamp: new Date()
      })
    }, 1500) // Simulate processing time

    console.log(`Mentor help requested for mission ${missionId}`)
  })

  // Real-time code collaboration
  socket.on('code:change', (data) => {
    const { missionId, code, cursor } = data
    
    // Broadcast to other users in the same mission (for collaboration features)
    socket.to(`mission:${missionId}`).emit('code:remote-change', {
      userId: activeUsers.get(socket.id)?.userId,
      code,
      cursor,
      timestamp: new Date()
    })
  })

  // Achievement unlocked
  socket.on('achievement:unlocked', (data) => {
    const { userId, achievement } = data
    
    // Broadcast to user's session
    io.to(`user:${userId}`).emit('achievement:notification', {
      achievement,
      timestamp: new Date()
    })

    // Global achievement feed
    io.emit('feed:achievement', {
      user: activeUsers.get(socket.id),
      achievement,
      timestamp: new Date()
    })

    console.log(`Achievement unlocked: ${achievement.title}`)
  })

  // Mission completed
  socket.on('mission:completed', (data) => {
    const { userId, missionId, score, timeSpent, points } = data
    const sessionData = userSessions.get(socket.id)

    if (sessionData) {
      sessionData.status = 'completed'
      sessionData.completedAt = new Date()
      sessionData.score = score
      sessionData.timeSpent = timeSpent
      sessionData.points = points

      // Update live mission stats
      const missionData = liveMissions.get(missionId)
      if (missionData) {
        missionData.activeUsers = Math.max(0, missionData.activeUsers - 1)
        if (missionData.activeUsers === 0) {
          liveMissions.delete(missionId)
        }
      }
    }

    // Broadcast completion
    io.emit('stats:missions', {
      activeMissions: liveMissions.size,
      totalActive: Array.from(liveMissions.values()).reduce((sum, m) => sum + m.activeUsers, 0)
    })

    // Notify user's session
    io.to(`user:${userId}`).emit('mission:completion', {
      missionId,
      score,
      points,
      timeSpent,
      timestamp: new Date()
    })

    console.log(`Mission completed: ${missionId} with score ${score}`)
  })

  // Streak update
  socket.on('streak:update', (data) => {
    const { userId, streak } = data
    
    io.to(`user:${userId}`).emit('streak:updated', {
      streak,
      timestamp: new Date()
    })

    console.log(`Streak updated for user ${userId}: ${streak} days`)
  })

  // Leaderboard updates
  socket.on('leaderboard:request', () => {
    const topUsers = Array.from(activeUsers.values())
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10)

    socket.emit('leaderboard:update', {
      users: topUsers,
      timestamp: new Date()
    })
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    const userData = activeUsers.get(socket.id)
    const sessionData = userSessions.get(socket.id)

    if (userData) {
      console.log(`User disconnected: ${userData.name}`)
      
      // Clean up active users
      activeUsers.delete(socket.id)
      
      // Clean up live missions
      if (sessionData) {
        const missionData = liveMissions.get(sessionData.missionId)
        if (missionData) {
          missionData.activeUsers = Math.max(0, missionData.activeUsers - 1)
          if (missionData.activeUsers === 0) {
            liveMissions.delete(sessionData.missionId)
          }
        }
      }

      // Update stats
      io.emit('stats:users', {
        count: activeUsers.size,
        users: Array.from(activeUsers.values())
      })

      io.emit('stats:missions', {
        activeMissions: liveMissions.size,
        totalActive: Array.from(liveMissions.values()).reduce((sum, m) => sum + m.activeUsers, 0)
      })
    }

    userSessions.delete(socket.id)
  })
})

// Helper function to generate AI mentor responses
function generateMentorResponse(code: string, question: string) {
  const responses = [
    "I see you're working on DOM manipulation. Remember to always check if an element exists before trying to modify it.",
    "Great question! For this problem, think about the current state of the element. You can use `element.style.display` to check if it's visible.",
    "You're on the right track! Consider using an if/else statement to toggle between showing and hiding the element.",
    "Hint: JavaScript can read the current CSS properties of an element. Try checking `style.display` before making changes.",
    "Excellent debugging approach! Have you tried logging the element's current display state to the console?"
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Real-time service running on port ${PORT}`)
  console.log(`📡 WebSocket server ready for connections`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})