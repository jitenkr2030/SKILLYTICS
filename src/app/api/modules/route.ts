import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const includeProgress = searchParams.get('includeProgress') === 'true'

    const modules = await db.module.findMany({
      include: {
        lessons: {
          where: { isPublished: true },
          include: {
            missions: {
              where: { isPublished: true }
            }
          }
        },
        prerequisites: {
          include: {
            prerequisite: true
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    // If user ID provided, include progress data
    if (userId && includeProgress) {
      const userProgress = await db.userProgress.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              level: true,
              xp: true,
              completedMissions: true
            }
          }
        }
      })

      const progressMap = new Map()
      userProgress.forEach(progress => {
        if (!progress.lessonId) {
          progressMap.set(progress.moduleId, progress)
        }
      })

      // Add progress to modules
      const modulesWithProgress = modules.map(module => ({
        ...module,
        progress: progressMap.get(module.id) || null,
        isUnlocked: module.order === 1 || checkIfUnlocked(module, progressMap)
      }))

      return NextResponse.json({
        modules: modulesWithProgress,
        userStats: userProgress[0]?.user || null
      })
    }

    return NextResponse.json({ modules })
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}

function checkIfUnlocked(module: any, progressMap: Map<string, any>) {
  // Check if all prerequisites are completed
  if (module.prerequisites.length === 0) {
    return true
  }

  for (const prereq of module.prerequisites) {
    const progress = progressMap.get(prereq.prerequisiteId)
    if (!progress || progress.status !== 'completed') {
      return false
    }
  }

  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      order,
      icon,
      color,
      estimatedHours,
      prerequisites
    } = body

    // Validate required fields
    if (!title || !description || !order) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the module
    const moduleData = await db.module.create({
      data: {
        title,
        description,
        order,
        icon,
        color,
        estimatedHours: estimatedHours || 0,
        isUnlocked: order === 1 // First module is unlocked by default
      }
    })

    // Handle prerequisites if provided
    if (prerequisites && prerequisites.length > 0) {
      for (const prereqId of prerequisites) {
        await db.modulePrerequisite.create({
          data: {
            moduleId: moduleData.id,
            prerequisiteId: prereqId
          }
        })
      }
    }

    return NextResponse.json(moduleData, { status: 201 })
  } catch (error) {
    console.error('Error creating module:', error)
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    )
  }
}