import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { CAREER_SERVICES } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { serviceType } = await req.json()

    if (!serviceType || !CAREER_SERVICES[serviceType as keyof typeof CAREER_SERVICES]) {
      return NextResponse.json({ error: 'Invalid service type' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { subscriptions: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const serviceDetails = CAREER_SERVICES[serviceType as keyof typeof CAREER_SERVICES]

    // Create or get Stripe customer
    let stripeCustomerId = user.subscriptions[0]?.stripeCustomerId
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id
        }
      })
      stripeCustomerId = customer.id
    }

    // Create checkout session for career service
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceDetails.name,
              description: serviceDetails.description,
              images: []
            },
            unit_amount: serviceDetails.price
          },
          quantity: 1
        }
      ],
      metadata: {
        userId: user.id,
        type: 'career_service',
        itemType: serviceType
      },
      success_url: `${process.env.NEXTAUTH_URL}/career-services?service=${serviceType}&success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/career-services?cancelled=true`
    })

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id
    })

  } catch (error) {
    console.error('Career service checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}