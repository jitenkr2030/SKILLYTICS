import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mission = await db.mission.findUnique({
      where: { id: params.id },
      include: {
        lesson: {
          include: {
            module: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!mission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(mission)
  } catch (error) {
    console.error('Error fetching mission:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mission' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userId, code, timeSpent } = body

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'Missing userId or code' },
        { status: 400 }
      )
    }

    // Get the mission
    const mission = await db.mission.findUnique({
      where: { id: params.id },
      include: {
        lesson: true
      }
    })

    if (!mission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      )
    }

    // Create or update mission attempt
    const existingAttempt = await db.missionAttempt.findFirst({
      where: {
        userId,
        missionId: params.id,
        status: 'in_progress'
      }
    })

    let attempt: any
    if (existingAttempt) {
      attempt = await db.missionAttempt.update({
        where: { id: existingAttempt.id },
        data: {
          code,
          timeSpent: existingAttempt.timeSpent + (timeSpent || 0),
          attempts: existingAttempt.attempts + 1
        }
      })
    } else {
      attempt = await db.missionAttempt.create({
        data: {
          userId,
          missionId: params.id,
          code,
          status: 'in_progress',
          timeSpent: timeSpent || 0,
          attempts: 1
        }
      })
    }

    // Validate the code
    const validationResult = await validateUserCode(code, mission)

    // Update attempt if validation is successful
    if (validationResult.success) {
      await db.missionAttempt.update({
        where: { id: attempt.id },
        data: {
          status: 'completed',
          score: validationResult.score,
          completedAt: new Date()
        }
      })

      // Update user progress
      await updateUserProgress(userId, mission)

      // Update user stats
      await updateUserStats(userId, mission.points)
    }

    return NextResponse.json({
      attempt,
      validation: validationResult
    })
  } catch (error) {
    console.error('Error submitting mission:', error)
    return NextResponse.json(
      { error: 'Failed to submit mission' },
      { status: 500 }
    )
  }
}

async function validateUserCode(code: string, mission: any) {
  try {
    const validationRules = JSON.parse(mission.validationRules)
    const solutionCode = mission.solutionCode

    // Basic validation logic - in production this would be more sophisticated
    const tests = []
    let totalScore = 0
    let maxScore = 0

    // Check for required patterns
    if (validationRules.requiredPatterns) {
      for (const pattern of validationRules.requiredPatterns) {
        maxScore += pattern.points || 10
        const regex = new RegExp(pattern.pattern, pattern.flags || 'g')
        if (regex.test(code)) {
          totalScore += pattern.points || 10
          tests.push({
            name: pattern.description || `Pattern: ${pattern.pattern}`,
            passed: true,
            points: pattern.points || 10
          })
        } else {
          tests.push({
            name: pattern.description || `Pattern: ${pattern.pattern}`,
            passed: false,
            points: 0
          })
        }
      }
    }

    // Check for forbidden patterns
    if (validationRules.forbiddenPatterns) {
      for (const pattern of validationRules.forbiddenPatterns) {
        maxScore += pattern.points || 10
        const regex = new RegExp(pattern.pattern, pattern.flags || 'g')
        if (!regex.test(code)) {
          totalScore += pattern.points || 10
          tests.push({
            name: pattern.description || `Avoid: ${pattern.pattern}`,
            passed: true,
            points: pattern.points || 10
          })
        } else {
          tests.push({
            name: pattern.description || `Avoid: ${pattern.pattern}`,
            passed: false,
            points: 0
          })
        }
      }
    }

    // Code execution test (sandboxed)
    if (validationRules.executionTest) {
      try {
        const result = await executeCodeSafely(code, validationRules.executionTest)
        maxScore += 20
        if (result.passed) {
          totalScore += 20
          tests.push({
            name: 'Execution Test',
            passed: true,
            points: 20
          })
        } else {
          tests.push({
            name: 'Execution Test',
            passed: false,
            points: 0,
            error: result.error
          })
        }
      } catch (error) {
        tests.push({
          name: 'Execution Test',
          passed: false,
          points: 0,
          error: 'Execution failed'
        })
      }
    }

    const success = totalScore >= (validationRules.minScore || maxScore * 0.8)
    const score = Math.round((totalScore / maxScore) * 100)

    return {
      success,
      score,
      tests,
      feedback: success 
        ? "Excellent! Your solution meets all the requirements."
        : "Not quite right. Check the failed tests and try again."
    }
  } catch (error) {
    return {
      success: false,
      score: 0,
      tests: [],
      feedback: "Validation error occurred."
    }
  }
}

async function executeCodeSafely(code: string, testConfig: any) {
  // This is a simplified version - in production you'd use a proper sandbox
  try {
    // For HTML/JS missions, we could use a headless browser
    // For now, we'll just do basic syntax checking
    if (code.includes('<script>') && code.includes('</script>')) {
      return { passed: true }
    }
    return { passed: false, error: 'Invalid structure' }
  } catch (error) {
    return { passed: false, error: error.message }
  }
}

async function updateUserProgress(userId: string, mission: any) {
  const moduleId = mission.lesson.moduleId
  const lessonId = mission.lessonId

  // Update or create module progress
  const moduleProgress = await db.userProgress.findFirst({
    where: {
      userId,
      moduleId,
      lessonId: null
    }
  })

  if (moduleProgress) {
    // Calculate new progress
    const totalMissionsInModule = await db.mission.count({
      where: {
        lesson: { moduleId },
        isPublished: true
      }
    })

    const completedMissionsInModule = await db.missionAttempt.count({
      where: {
        userId,
        mission: {
          lesson: { moduleId }
        },
        status: 'completed'
      }
    })

    const newProgress = (completedMissionsInModule / totalMissionsInModule) * 100

    await db.userProgress.update({
      where: { id: moduleProgress.id },
      data: {
        progress: newProgress,
        status: newProgress >= 100 ? 'completed' : 'in_progress',
        lastAccessed: new Date()
      }
    })
  } else {
    await db.userProgress.create({
      data: {
        userId,
        moduleId,
        progress: 10, // First mission completion
        status: 'in_progress'
      }
    })
  }

  // Update lesson progress
  const lessonProgress = await db.userProgress.findFirst({
    where: {
      userId,
      moduleId,
      lessonId
    }
  })

  if (lessonProgress) {
    await db.userProgress.update({
      where: { id: lessonProgress.id },
      data: {
        progress: 100,
        status: 'completed',
        lastAccessed: new Date()
      }
    })
  } else {
    await db.userProgress.create({
      data: {
        userId,
        moduleId,
        lessonId,
        progress: 100,
        status: 'completed'
      }
    })
  }
}

async function updateUserStats(userId: string, points: number) {
  const user = await db.user.findUnique({
    where: { id: userId }
  })

  if (user) {
    const newXP = user.xp + points
    const newCompletedMissions = user.completedMissions + 1
    
    // Calculate new level (simple formula: level = floor(xp / 100) + 1)
    const newLevel = Math.floor(newXP / 100) + 1

    await db.user.update({
      where: { id: userId },
      data: {
        xp: newXP,
        completedMissions: newCompletedMissions,
        level: newLevel
      }
    })
  }
}