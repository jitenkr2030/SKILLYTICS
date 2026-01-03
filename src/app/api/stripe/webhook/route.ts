import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return new NextResponse('No signature', { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        
        // Find or create user subscription
        await db.subscription.upsert({
          where: {
            stripeSubscriptionId: subscription.id
          },
          update: {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end
          },
          create: {
            userId: subscription.metadata.userId,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            plan: subscription.metadata.plan,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end
          }
        })

        // Update user premium status
        const user = await db.user.findUnique({
          where: { id: subscription.metadata.userId }
        })

        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: {
              isPremium: subscription.status === 'active' && subscription.metadata.plan !== 'free'
            }
          })
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        
        await db.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id
          },
          data: {
            status: 'canceled'
          }
        })

        // Update user premium status
        const userSubscription = await db.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id }
        })

        if (userSubscription) {
          await db.user.update({
            where: { id: userSubscription.userId },
            data: {
              isPremium: false
            }
          })
        }

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any
        
        // Handle successful payment for one-time purchases
        if (invoice.metadata.type === 'career_service' || invoice.metadata.type === 'certificate') {
          await db.purchase.create({
            data: {
              userId: invoice.metadata.userId,
              stripePaymentId: invoice.payment_intent as string,
              type: invoice.metadata.type,
              itemType: invoice.metadata.itemType,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: 'completed',
              metadata: JSON.stringify(invoice.metadata)
            }
          })

          // Create career service or certificate record
          if (invoice.metadata.type === 'career_service') {
            await db.careerService.create({
              data: {
                userId: invoice.metadata.userId,
                type: invoice.metadata.itemType,
                purchaseId: invoice.payment_intent as string,
                status: 'pending'
              }
            })
          } else if (invoice.metadata.type === 'certificate') {
            const certificate = await db.certificate.findUnique({
              where: { type: invoice.metadata.itemType }
            })

            if (certificate) {
              await db.userCertificate.create({
                data: {
                  userId: invoice.metadata.userId,
                  certificateId: certificate.id,
                  purchaseId: invoice.payment_intent as string,
                  expiresAt: new Date(Date.now() + (certificate.validityMonths * 30 * 24 * 60 * 60 * 1000)),
                  verificationCode: generateVerificationCode()
                }
              })
            }
          }
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any
        
        if (invoice.metadata.type === 'career_service' || invoice.metadata.type === 'certificate') {
          await db.purchase.create({
            data: {
              userId: invoice.metadata.userId,
              stripePaymentId: invoice.payment_intent as string,
              type: invoice.metadata.type,
              itemType: invoice.metadata.itemType,
              amount: invoice.amount_due,
              currency: invoice.currency,
              status: 'failed',
              metadata: JSON.stringify(invoice.metadata)
            }
          })
        }

        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new NextResponse('Webhook processed', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new NextResponse('Webhook error', { status: 400 })
  }
}

function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 15).toUpperCase()
}