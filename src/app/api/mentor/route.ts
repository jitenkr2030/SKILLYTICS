import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, mission, question, userLevel, hintsUsed } = body

    if (!code || !mission) {
      return NextResponse.json(
        { error: 'Missing required fields: code, mission' },
        { status: 400 }
      )
    }

    // Create context for the AI mentor
    const context = createMentorContext(mission, userLevel, hintsUsed)
    
    // Try to generate mentor response using LLM
    let response: { content: string } | null = null
    
    try {
      // Dynamic import to defer SDK loading until runtime
      const zAI = (await import('z-ai-web-dev-sdk')).default
      
      // Initialize with API key if available
      const apiKey = process.env.Z_AI_API_KEY || process.env.AI_API_KEY
      if (apiKey) {
        zAI.init({ apiKey })
      }
      
      // Generate response
      response = await zAI.chat({
        messages: [
          {
            role: 'system',
            content: `${context}

You are an expert programming mentor helping a student learn by doing. Your role is to:
1. Analyze their code carefully
2. Give hints, not direct answers
3. Explain concepts in simple terms
4. Encourage problem-solving thinking
5. Be supportive and motivating

Always respond with helpful guidance that moves them closer to the solution without giving it away completely.`
          },
          {
            role: 'user',
            content: `Here's my current code:

\`\`\`
${code}
\`\`\`

${question ? `My question is: ${question}` : 'Can you give me a hint about what I should try next?'}

Please help me understand what's wrong and what approach I should take.`
          }
        ],
        temperature: 0.7,
        maxTokens: 500
      })
    } catch (sdkError) {
      console.warn('AI SDK not available or not configured:', sdkError)
      // Provide fallback response when SDK is not available
      response = {
        content: generateFallbackResponse(code, mission)
      }
    }

    return NextResponse.json({
      response: response.content,
      suggestions: generateCodeSuggestions(code, mission),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in mentor API:', error)
    return NextResponse.json(
      { error: 'Failed to get mentor response' },
      { status: 500 }
    )
  }
}

function createMentorContext(mission: any, userLevel: number, hintsUsed: number) {
  return `
Mission Context:
- Title: ${mission.title}
- Difficulty: ${mission.difficulty}
- Description: ${mission.description}
- Instructions: ${mission.instructions}

Student Context:
- Level: ${userLevel}
- Hints used: ${hintsUsed}

Learning Objectives:
${mission.instructions || 'Complete the programming challenge successfully'}

Teaching Approach:
- If user is beginner (level 1-3): Be very explicit, explain concepts step by step
- If user is intermediate (level 4-7): Assume some knowledge, focus on problem-solving strategies  
- If user is advanced (level 8+): Give high-level guidance, focus on best practices and optimization
- If many hints used: Be more encouraging, break down problem into smaller steps
`
}

function generateFallbackResponse(code: string, mission: any): string {
  // Generate a helpful fallback response when AI is not available
  return `I'm here to help you with this programming challenge! 

While the AI mentor is temporarily unavailable, here are some general tips:

1. **Read the instructions carefully** - Make sure you understand what the mission is asking you to do.

2. **Break down the problem** - Split the task into smaller, manageable steps.

3. **Check your syntax** - Look for any typos or missing characters in your code.

4. **Use console.log** - Debug your code by logging intermediate values.

5. **Don't give up!** - Programming is about solving problems step by step.

If you continue to have trouble, please check back later when the AI mentor service is fully available.`
}

function generateCodeSuggestions(code: string, mission: any) {
  const suggestions = []
  
  // Analyze common patterns and suggest improvements
  if (!code.includes('if') && mission.instructions?.includes('toggle')) {
    suggestions.push({
      type: 'concept',
      title: 'Conditional Logic',
      description: 'Consider using an if statement to check the current state'
    })
  }

  if (code.includes('getElementById') && !code.includes('style.display')) {
    suggestions.push({
      type: 'property',
      title: 'CSS Display Property',
      description: 'You can check and modify element visibility using the style.display property'
    })
  }

  if (code.includes('console.log')) {
    suggestions.push({
      type: 'debugging',
      title: 'Debugging Tip',
      description: 'Great use of console.log! Try logging the element\'s current display state'
    })
  }

  return suggestions
}
