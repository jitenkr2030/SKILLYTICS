import { loadStripe } from '@stripe/stripe-js'

export const getStripe = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('Stripe publishable key is not set')
  }
  
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
}

export const formatPrice = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100)
}

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '10 missions per month',
      'Basic AI hints',
      'Community support',
      'Progress tracking',
      'Mobile app access'
    ],
    limitations: [
      'Limited to 10 missions/month',
      'Basic AI mentor only',
      'No career services',
      'No certificates'
    ]
  },
  premium: {
    name: 'Premium',
    price: 2900, // $29 in cents
    stripePriceId: process.env.PREMIUM_MONTHLY_PRICE_ID || 'price_premium',
    features: [
      'Unlimited missions',
      'Advanced AI mentor',
      'Priority support',
      'Progress analytics',
      'Mobile app offline mode',
      'Basic certificates',
      'Resume builder'
    ],
    limitations: [
      'No 1-on-1 coaching',
      'No enterprise features'
    ]
  },
  pro: {
    name: 'Pro',
    price: 7900, // $79 in cents
    stripePriceId: process.env.PRO_MONTHLY_PRICE_ID || 'price_pro',
    features: [
      'Everything in Premium',
      'Unlimited AI mentor sessions',
      '1-on-1 career coaching (2hrs/month)',
      'Advanced certificates',
      'Interview preparation',
      'Portfolio review',
      'Priority mission access'
    ],
    limitations: [
      'No team management',
      'No custom content'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 4900, // $49 per user per month
    stripePriceId: process.env.ENTERPRISE_MONTHLY_PRICE_ID || 'price_enterprise',
    features: [
      'Everything in Pro',
      'Team management dashboard',
      'Custom learning paths',
      'Advanced analytics',
      'Dedicated account manager',
      'Custom missions',
      'API access',
      'SSO integration',
      'Priority support'
    ],
    limitations: [
      'Minimum 5 users required'
    ]
  }
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS

export const CAREER_SERVICES = {
  resumeReview: {
    name: 'Resume Review',
    price: 9900, // $99
    stripePriceId: process.env.RESUME_REVIEW_PRICE_ID || 'price_resume',
    description: 'Professional resume review with detailed feedback',
    deliveryTime: '48 hours'
  },
  interviewPrep: {
    name: 'Interview Preparation',
    price: 19900, // $199
    stripePriceId: process.env.INTERVIEW_PREP_PRICE_ID || 'price_interview',
    description: 'Mock interviews and personalized coaching',
    deliveryTime: '1 week'
  },
  careerCoaching: {
    name: 'Career Coaching Package',
    price: 49900, // $499
    stripePriceId: process.env.CAREER_COACHING_PRICE_ID || 'price_coaching',
    description: '3-month career coaching program',
    deliveryTime: '3 months'
  }
} as const

export const CERTIFICATIONS = {
  html: {
    name: 'HTML Fundamentals Certificate',
    price: 4900, // $49
    stripePriceId: process.env.HTML_CERT_PRICE_ID || 'price_html_cert',
    description: 'Professional HTML certification',
    requirements: 'Complete HTML module with 90%+ score'
  },
  css: {
    name: 'CSS Mastery Certificate',
    price: 4900, // $49
    stripePriceId: process.env.CSS_CERT_PRICE_ID || 'price_css_cert',
    description: 'Professional CSS certification',
    requirements: 'Complete CSS module with 90%+ score'
  },
  javascript: {
    name: 'JavaScript Expert Certificate',
    price: 9900, // $99
    stripePriceId: process.env.JS_CERT_PRICE_ID || 'price_js_cert',
    description: 'Professional JavaScript certification',
    requirements: 'Complete JavaScript module with 90%+ score'
  },
  react: {
    name: 'React Developer Certificate',
    price: 9900, // $99
    stripePriceId: process.env.REACT_CERT_PRICE_ID || 'price_react_cert',
    description: 'Professional React certification',
    requirements: 'Complete React module with 90%+ score'
  },
  fullstack: {
    name: 'Full-Stack Developer Certificate',
    price: 19900, // $199
    stripePriceId: process.env.FULLSTACK_CERT_PRICE_ID || 'price_fullstack_cert',
    description: 'Professional Full-Stack certification',
    requirements: 'Complete all modules with 85%+ average score'
  }
} as const