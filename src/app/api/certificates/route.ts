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

    const userCertificates = await db.userCertificate.findMany({
      where: { userId: user.id },
      include: {
        certificate: true
      },
      orderBy: { issuedAt: 'desc' }
    })

    return NextResponse.json(userCertificates)

  } catch (error) {
    console.error('Certificates fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}