import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('moduleId')
    const lessonId = searchParams.get('lessonId')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      isPublished: true
    }

    if (moduleId) {
      where.lessonId = moduleId
    } else if (lessonId) {
      where.lessonId = lessonId
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    const missions = await db.mission.findMany({
      where,
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
      },
      orderBy: [
        { lesson: { order: 'asc' } },
        { order: 'asc' }
      ],
      take: limit,
      skip: offset
    })

    const total = await db.mission.count({ where })

    return NextResponse.json({
      missions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching missions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch missions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      instructions,
      starterCode,
      solutionCode,
      validationRules,
      hints,
      lessonId,
      order,
      difficulty,
      points,
      timeLimit,
      tags
    } = body

    // Validate required fields
    if (!title || !description || !instructions || !lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the mission
    const mission = await db.mission.create({
      data: {
        title,
        description,
        instructions,
        starterCode,
        solutionCode,
        validationRules: JSON.stringify(validationRules || {}),
        hints: JSON.stringify(hints || []),
        lessonId,
        order,
        difficulty: difficulty || 'beginner',
        points: points || 10,
        timeLimit,
        isPublished: false
      },
      include: {
        lesson: {
          include: {
            module: true
          }
        }
      }
    })

    // Handle tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        let tag = await db.tag.findUnique({
          where: { name: tagName }
        })

        if (!tag) {
          tag = await db.tag.create({
            data: { name: tagName }
          })
        }

        await db.missionTag.create({
          data: {
            missionId: mission.id,
            tagId: tag.id
          }
        })
      }
    }

    return NextResponse.json(mission, { status: 201 })
  } catch (error) {
    console.error('Error creating mission:', error)
    return NextResponse.json(
      { error: 'Failed to create mission' },
      { status: 500 }
    )
  }
}