'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bug, 
  Plus, 
  Zap, 
  Shield, 
  Rocket, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  GitBranch,
  Code,
  Terminal,
  FileText,
  MessageSquare,
  ArrowLeft
} from 'lucide-react'
import Editor from '@monaco-editor/react'

interface Scenario {
  id: string
  title: string
  type: 'bug' | 'feature' | 'performance' | 'security' | 'deployment'
  description: string
  context: string
  requirements: string[]
  starterCode: string
  hints: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  realWorldContext: {
    company: string
    team: string
    impact: string
    priority: 'low' | 'medium' | 'high' | 'critical'
  }
}

const scenarios: Scenario[] = [
  {
    id: 'bug-fix-1',
    title: 'Critical Login Bug',
    type: 'bug',
    description: 'Users report they cannot log in after recent deployment',
    context: 'Your team just deployed a new feature and now the login system is broken. The CEO is getting angry calls from enterprise customers.',
    requirements: [
      'Identify the root cause of the login failure',
      'Fix the authentication flow',
      'Ensure existing sessions remain valid',
      'Add error handling for future issues'
    ],
    starterCode: `// Authentication service - BROKEN
class AuthService {
  constructor() {
    this.users = new Map()
    this.sessions = new Map()
  }

  async login(email, password) {
    // Bug: Missing async/await handling
    const user = this.findUser(email)
    if (!user) {
      throw new Error('User not found')
    }
    
    // Bug: Password comparison is broken
    if (user.password === password) {
      const token = this.generateToken(user)
      this.sessions.set(token, user)
      return { token, user }
    }
    
    throw new Error('Invalid credentials')
  }

  findUser(email) {
    // Bug: This should be async but returns Promise
    return database.users.findOne({ email })
  }

  generateToken(user) {
    return Buffer.from(\`\${user.id}:\${Date.now()}\`).toString('base64')
  }
}

// Mock database
const database = {
  users: {
    findOne: ({ email }) => {
      return Promise.resolve({
        id: '1',
        email: 'user@example.com',
        password: 'hashedpassword123'
      })
    }
  }
}

// Test the service
const auth = new AuthService()
auth.login('user@example.com', 'hashedpassword123')
  .then(result => console.log('Login successful:', result))
  .catch(error => console.error('Login failed:', error))`,
    hints: [
      'Check the async/await usage in the login method',
      'The findUser method returns a Promise, not a direct value',
      'Make sure to handle Promises correctly throughout the flow',
      'Consider adding proper error handling and logging'
    ],
    difficulty: 'intermediate',
    estimatedTime: 30,
    realWorldContext: {
      company: 'TechCorp Inc.',
      team: 'Backend Team',
      impact: 'Critical - All users unable to access platform',
      priority: 'critical'
    }
  },
  {
    id: 'feature-add-1',
    title: 'Add Real-time Notifications',
    type: 'feature',
    description: 'Product team wants real-time notifications for user interactions',
    context: 'The product team has been getting requests for real-time notifications. Users want to see when someone likes their post or comments.',
    requirements: [
      'Implement WebSocket connection for real-time updates',
      'Create notification system with different types',
      'Add notification persistence in database',
      'Handle connection failures gracefully'
    ],
    starterCode: `// Notification system - INCOMPLETE
class NotificationService {
  constructor() {
    this.connections = new Map()
    this.notifications = []
  }

  // TODO: Implement WebSocket connection
  connect(userId, socket) {
    // Add user connection
    this.connections.set(userId, socket)
    
    // TODO: Send pending notifications
    this.sendPendingNotifications(userId)
  }

  // TODO: Implement notification sending
  sendNotification(userId, notification) {
    const notificationData = {
      id: Date.now(),
      userId,
      type: notification.type,
      message: notification.message,
      timestamp: new Date(),
      read: false
    }

    // TODO: Save to database
    this.saveNotification(notificationData)

    // TODO: Send via WebSocket if user is online
    const socket = this.connections.get(userId)
    if (socket) {
      socket.send(JSON.stringify(notificationData))
    }
  }

  // TODO: Implement notification persistence
  async saveNotification(notification) {
    // This should save to database
    console.log('Saving notification:', notification)
  }

  // TODO: Implement pending notifications
  async sendPendingNotifications(userId) {
    // Get unread notifications for user
    const pending = await this.getUnreadNotifications(userId)
    
    // Send each pending notification
    pending.forEach(notification => {
      const socket = this.connections.get(userId)
      if (socket) {
        socket.send(JSON.stringify(notification))
      }
    })
  }

  async getUnreadNotifications(userId) {
    // TODO: Query database for unread notifications
    return []
  }
}

// Usage example
const notificationService = new NotificationService()

// Mock WebSocket for testing
const mockSocket = {
  send: (data) => console.log('WebSocket sent:', data)
}

// Connect user
notificationService.connect('user123', mockSocket)

// Send a test notification
notificationService.sendNotification('user123', {
  type: 'like',
  message: 'Someone liked your post!'
})`,
    hints: [
      'Start by implementing the WebSocket connection handling',
      'Create a proper database schema for notifications',
      'Add different notification types (like, comment, follow, etc.)',
      'Implement reconnection logic for WebSocket failures'
    ],
    difficulty: 'advanced',
    estimatedTime: 45,
    realWorldContext: {
      company: 'SocialApp Ltd.',
      team: 'Frontend Team',
      impact: 'High - User engagement feature request',
      priority: 'high'
    }
  },
  {
    id: 'security-fix-1',
    title: 'Fix XSS Vulnerability',
    type: 'security',
    description: 'Security audit discovered XSS vulnerability in comment system',
    context: 'A security firm found that users can inject JavaScript through comments. This could lead to session hijacking and data theft.',
    requirements: [
      'Identify and fix XSS vulnerability',
      'Implement proper input sanitization',
      'Add Content Security Policy headers',
      'Create security tests for prevention'
    ],
    starterCode: `// Comment system - VULNERABLE
class CommentService {
  constructor() {
    this.comments = []
  }

  // VULNERABILITY: No input sanitization
  addComment(postId, userId, content) {
    const comment = {
      id: Date.now(),
      postId,
      userId,
      content: content, // DANGER: Raw content stored
      timestamp: new Date(),
      likes: 0
    }
    
    this.comments.push(comment)
    return comment
  }

  // VULNERABILITY: No output encoding
  renderComments(postId) {
    const postComments = this.comments.filter(c => c.postId === postId)
    
    return postComments.map(comment => \`
      <div class="comment" data-id="\${comment.id}">
        <div class="comment-content">
          \${comment.content} <!-- DANGER: Raw HTML output -->
        </div>
        <div class="comment-meta">
          <span class="timestamp">\${comment.timestamp}</span>
          <button onclick="likeComment(\${comment.id})">
            Like (\${comment.likes})
          </button>
        </div>
      </div>
    \`).join('')
  }

  likeComment(commentId) {
    const comment = this.comments.find(c => c.id === commentId)
    if (comment) {
      comment.likes++
    }
  }
}

// Usage example with malicious input
const commentService = new CommentService()

// Normal comment
commentService.addComment('post1', 'user1', 'Great post!')

// Malicious comment - XSS attack
commentService.addComment('post1', 'attacker', 
  '<img src="x" onerror="alert(\'XSS Attack - Stealing cookies: \' + document.cookie)">'
)

// This will execute the malicious script when rendered
console.log('Rendered comments:')
console.log(commentService.renderComments('post1'))`,
    hints: [
      'Never trust user input - always sanitize it',
      'Use proper HTML escaping when rendering user content',
      'Implement a Content Security Policy (CSP)',
      'Consider using a library like DOMPurify for HTML sanitization'
    ],
    difficulty: 'intermediate',
    estimatedTime: 35,
    realWorldContext: {
      company: 'BlogPlatform Co.',
      team: 'Security Team',
      impact: 'Critical - Data breach risk',
      priority: 'critical'
    }
  }
]

export default function ScenarioSimulator() {
  const params = useParams()
  const router = useRouter()
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [code, setCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const [currentHint, setCurrentHint] = useState(0)

  useEffect(() => {
    const scenario = scenarios.find(s => s.id === params.id)
    if (scenario) {
      setSelectedScenario(scenario)
      setCode(scenario.starterCode)
    }
  }, [params.id])

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="h-5 w-5 text-red-500" />
      case 'feature': return <Plus className="h-5 w-5 text-green-500" />
      case 'performance': return <Zap className="h-5 w-5 text-yellow-500" />
      case 'security': return <Shield className="h-5 w-5 text-purple-500" />
      case 'deployment': return <Rocket className="h-5 w-5 text-blue-500" />
      default: return <Code className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const runTests = () => {
    setIsRunning(true)
    
    // Simulate running tests
    setTimeout(() => {
      const results = {
        passed: Math.floor(Math.random() * 3) + 2,
        total: 5,
        tests: [
          { name: 'Syntax Check', passed: true },
          { name: 'Logic Flow', passed: Math.random() > 0.3 },
          { name: 'Error Handling', passed: Math.random() > 0.5 },
          { name: 'Edge Cases', passed: Math.random() > 0.6 },
          { name: 'Performance', passed: Math.random() > 0.4 }
        ]
      }
      setTestResults(results)
      setIsRunning(false)
    }, 2000)
  }

  const getHint = () => {
    if (selectedScenario && currentHint < selectedScenario.hints.length) {
      setCurrentHint(prev => prev + 1)
    }
  }

  if (!selectedScenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                {getScenarioIcon(selectedScenario.type)}
                <h1 className="text-xl font-bold">{selectedScenario.title}</h1>
              </div>
              <Badge variant="default">{selectedScenario.difficulty}</Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>{selectedScenario.estimatedTime} min</span>
              </div>
              <Badge className={getPriorityColor(selectedScenario.realWorldContext.priority)}>
                {selectedScenario.realWorldContext.priority} priority
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Scenario Context */}
          <div className="lg:col-span-1 space-y-4">
            {/* Real-World Context */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Real-World Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm">Company</h4>
                  <p className="text-sm text-muted-foreground">{selectedScenario.realWorldContext.company}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Team</h4>
                  <p className="text-sm text-muted-foreground">{selectedScenario.realWorldContext.team}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Impact</h4>
                  <p className="text-sm text-muted-foreground">{selectedScenario.realWorldContext.impact}</p>
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    This simulates a real scenario that developers face in production environments.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Scenario Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Scenario Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{selectedScenario.description}</p>
                <div>
                  <h4 className="font-medium text-sm mb-2">Context</h4>
                  <p className="text-sm text-muted-foreground">{selectedScenario.context}</p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {selectedScenario.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Hints */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Hints ({currentHint}/{selectedScenario.hints.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedScenario.hints.slice(0, currentHint).map((hint, index) => (
                  <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm">{hint}</p>
                  </div>
                ))}
                
                {currentHint < selectedScenario.hints.length && (
                  <Button variant="outline" size="sm" onClick={getHint} className="w-full">
                    Get Hint
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Code Editor & Tests */}
          <div className="lg:col-span-2 space-y-4">
            {/* Code Editor */}
            <Card className="flex-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Editor
                  </CardTitle>
                  <Button size="sm" onClick={runTests} disabled={isRunning}>
                    {isRunning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Running Tests...
                      </>
                    ) : (
                      <>
                        <Terminal className="h-4 w-4 mr-2" />
                        Run Tests
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 border rounded-lg overflow-hidden">
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {testResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {testResults.passed} of {testResults.total} tests passed
                      </span>
                      <Badge variant={testResults.passed === testResults.total ? "default" : "destructive"}>
                        {Math.round((testResults.passed / testResults.total) * 100)}%
                      </Badge>
                    </div>
                    
                    <Progress value={(testResults.passed / testResults.total) * 100} className="h-2" />
                    
                    <div className="space-y-2">
                      {testResults.tests.map((test: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                          <span>{test.name}</span>
                          {test.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {testResults.passed === testResults.total && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Excellent! You've successfully resolved this real-world scenario.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}