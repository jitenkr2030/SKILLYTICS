import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const careerServices = await db.careerService.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(careerServices)

  } catch (error) {
    console.error('Career services fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serviceType, scheduledAt } = await req.json()

    if (!serviceType) {
      return NextResponse.json({ error: 'Service type is required' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create career service record
    const careerService = await db.careerService.create({
      data: {
        userId: user.id,
        type: serviceType,
        status: 'pending',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }
    })

    return NextResponse.json(careerService)

  } catch (error) {
    console.error('Career service creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}