import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { CERTIFICATIONS } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { certificateType } = await req.json()

    if (!certificateType || !CERTIFICATIONS[certificateType as keyof typeof CERTIFICATIONS]) {
      return NextResponse.json({ error: 'Invalid certificate type' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { 
        subscriptions: true,
        certificates: {
          include: {
            certificate: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already has this certificate
    const existingCertificate = user.certificates.find(
      uc => uc.certificate.type === certificateType
    )

    if (existingCertificate) {
      return NextResponse.json({ error: 'Certificate already purchased' }, { status: 400 })
    }

    const certificateDetails = CERTIFICATIONS[certificateType as keyof typeof CERTIFICATIONS]

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

    // Create checkout session for certificate
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: certificateDetails.name,
              description: certificateDetails.description,
              images: []
            },
            unit_amount: certificateDetails.price
          },
          quantity: 1
        }
      ],
      metadata: {
        userId: user.id,
        type: 'certificate',
        itemType: certificateType
      },
      success_url: `${process.env.NEXTAUTH_URL}/certificates?certificate=${certificateType}&success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/certificates?cancelled=true`
    })

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id
    })

  } catch (error) {
    console.error('Certificate checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}