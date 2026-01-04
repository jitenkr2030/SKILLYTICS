import { NextRequest, NextResponse } from 'next/server'
// Import our stub to prevent any accidental import of the real SDK
import '@/lib/zai-stub'

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
    
    // Generate a helpful response based on the context and code
    const response = generateMentorResponse(context, code, mission, question)

    return NextResponse.json({
      response,
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
  return {
    title: mission?.title || 'Unknown Mission',
    difficulty: mission?.difficulty || 'beginner',
    description: mission?.description || '',
    instructions: mission?.instructions || '',
    userLevel,
    hintsUsed
  }
}

function generateMentorResponse(context: any, code: string, mission: any, question: string | undefined): string {
  // Generate contextual response based on mission type and code analysis
  const missionType = context.instructions?.toLowerCase() || ''
  
  // Analyze code for common issues
  const hasIfStatement = code.includes('if ')
  const hasElseStatement = code.includes('else')
  const hasFunction = code.includes('function') || code.includes('const ') || code.includes('let ')
  const hasConsoleLog = code.includes('console.log')
  
  let response = ''
  
  if (question) {
    response = `Great question! Let me help you with that.\n\n`
  } else {
    response = `I see you're working on "${context.title}" - a ${context.difficulty} level mission. `
  }
  
  // Provide mission-specific guidance
  if (missionType.includes('toggle') || missionType.includes('hide') || missionType.includes('show')) {
    response += `For this visibility toggle challenge, remember:\n`
    response += `• You need to check the current state before changing it\n`
    response += `• Use conditional statements (if/else) to handle both states\n`
    response += `• The style.display property can show/hide elements\n\n`
    
    if (!hasIfStatement) {
      response += `💡 **Tip**: Your code doesn't have an if statement yet. Consider adding one to check the current visibility state.\n\n`
    }
  } else if (missionType.includes('button') || missionType.includes('click')) {
    response += `For button interaction challenges:\n`
    response += `• Make sure elements exist before trying to interact with them\n`
    response += `• Event listeners can be added with addEventListener\n\n`
  } else if (missionType.includes('loop') || missionType.includes('array') || missionType.includes('list')) {
    response += `For data iteration challenges:\n`
    response += `• Consider using loops (for, while) or array methods (map, forEach)\n`
    response += `• Make sure you're accessing the correct array elements\n\n`
  } else {
    response += `Here are some general programming tips:\n`
    response += `• Break the problem into smaller steps\n`
    response += `• Use console.log to debug and see intermediate values\n`
    response += `• Check your syntax carefully for typos\n\n`
  }
  
  // Add code-specific feedback
  if (hasConsoleLog) {
    response += `👍 I see you're using console.log for debugging - that's a great practice!\n\n`
  }
  
  if (hasFunction && !hasIfStatement && !hasElseStatement) {
    response += `💡 **Tip**: Consider breaking your code into functions if you haven't already. Functions help organize logic and make it reusable.\n\n`
  }
  
  // Add user-level appropriate guidance
  if (context.userLevel <= 3) {
    response += `Since you're still building your fundamentals, don't worry about being perfect. Focus on understanding the concepts one step at a time!`
  } else if (context.userLevel >= 7) {
    response += `At your level, you're ready to think about best practices like code organization, error handling, and edge cases.`
  }
  
  return response
}

function generateCodeSuggestions(code: string, mission: any) {
  const suggestions = []
  const instructions = mission?.instructions?.toLowerCase() || ''
  
  // Analyze common patterns and suggest improvements
  if (!code.includes('if') && (instructions.includes('toggle') || instructions.includes('check') || instructions.includes('condition'))) {
    suggestions.push({
      type: 'concept',
      title: 'Conditional Logic',
      description: 'Consider using an if statement to check the current state before making changes'
    })
  }

  if (code.includes('getElementById') && !code.includes('style.display')) {
    suggestions.push({
      type: 'property',
      title: 'CSS Display Property',
      description: 'You can check and modify element visibility using the style.display property (none vs block)'
    })
  }

  if (code.includes('console.log')) {
    suggestions.push({
      type: 'debugging',
      title: 'Debugging Tip',
      description: 'Great use of console.log! Try logging the element\'s current display state to understand what\'s happening'
    })
  }
  
  if (!code.includes('addEventListener') && (instructions.includes('click') || instructions.includes('button'))) {
    suggestions.push({
      type: 'event',
      title: 'Event Handling',
      description: 'You may need to add an event listener to handle user interactions like clicks'
    })
  }

  return suggestions
}
