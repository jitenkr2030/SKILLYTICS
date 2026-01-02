import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('🎓 Creating certificates...')

  const certificates = [
    {
      name: 'HTML Fundamentals Certificate',
      description: 'Professional certification in HTML5 fundamentals, semantic markup, and accessibility standards',
      type: 'html',
      price: 4900, // $49
      requirements: 'Complete HTML module with 90%+ average score across all missions',
      validityMonths: 12
    },
    {
      name: 'CSS Mastery Certificate',
      description: 'Advanced CSS certification covering modern layouts, animations, and responsive design',
      type: 'css',
      price: 4900, // $49
      requirements: 'Complete CSS module with 90%+ average score across all missions',
      validityMonths: 12
    },
    {
      name: 'JavaScript Expert Certificate',
      description: 'Comprehensive JavaScript certification including ES6+, async programming, and DOM manipulation',
      type: 'javascript',
      price: 9900, // $99
      requirements: 'Complete JavaScript module with 90%+ average score across all missions',
      validityMonths: 12
    },
    {
      name: 'React Developer Certificate',
      description: 'Professional React certification covering components, hooks, state management, and performance',
      type: 'react',
      price: 9900, // $99
      requirements: 'Complete React module with 90%+ average score across all missions',
      validityMonths: 12
    },
    {
      name: 'Full-Stack Developer Certificate',
      description: 'Premium full-stack certification validating end-to-end development capabilities',
      type: 'fullstack',
      price: 19900, // $199
      requirements: 'Complete all modules with 85%+ average score and complete capstone project',
      validityMonths: 18
    }
  ]

  for (const cert of certificates) {
    // Check if certificate already exists
    const existing = await db.certificate.findFirst({
      where: { type: cert.type }
    })

    if (existing) {
      await db.certificate.update({
        where: { id: existing.id },
        data: cert
      })
      console.log(`✅ Updated certificate: ${cert.name}`)
    } else {
      await db.certificate.create({
        data: cert
      })
      console.log(`✅ Created certificate: ${cert.name}`)
    }
  }

  console.log('✅ Certificates created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })