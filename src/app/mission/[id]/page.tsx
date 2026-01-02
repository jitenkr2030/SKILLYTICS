'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Play, 
  RotateCcw, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  Clock,
  Star,
  ArrowLeft,
  Terminal,
  Eye,
  Code,
  MessageCircle,
  Zap,
  Target,
  Trophy
} from 'lucide-react'
import Editor from '@monaco-editor/react'

export default function MissionPage() {
  const params = useParams()
  const router = useRouter()
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Broken Button</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        .btn {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 5px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .message {
            margin-top: 20px;
            padding: 15px;
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 5px;
            display: none; /* This is the problem! */
        }
    </style>
</head>
<body>
    <h1>Interactive Message Toggle</h1>
    <p>Click the button below to show/hide the secret message:</p>
    
    <button class="btn" onclick="showMessage()">Show Message</button>
    
    <div id="secretMessage" class="message">
        <h3>🎉 Congratulations!</h3>
        <p>You've successfully toggled the message visibility!</p>
    </div>

    <script>
        function showMessage() {
            // This function needs to be fixed!
            // Currently it only shows the message but doesn't toggle it
            document.getElementById('secretMessage').style.display = 'block';
        }
    </script>
</body>
</html>`)
  
  const [isRunning, setIsRunning] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const mission = {
    id: params.id,
    title: "Fix the Broken Button",
    description: "This button should toggle the visibility of the hidden message when clicked.",
    instructions: [
      "The button should toggle between showing and hiding the message",
      "The message should start hidden",
      "Clicking the button multiple times should alternate between show/hide",
      "The button text should update to reflect the current action"
    ],
    difficulty: "Beginner",
    points: 10,
    timeLimit: 15,
    module: "JavaScript Essentials",
    hints: [
      {
        level: 1,
        title: "Think about the current state",
        content: "You need to check if the message is currently visible or hidden before deciding what to do."
      },
      {
        level: 2,
        title: "Use a conditional statement",
        content: "An if/else statement can help you check the current display property and toggle it accordingly."
      },
      {
        level: 3,
        title: "Check the display style",
        content: "You can check `element.style.display === 'block'` to see if it's visible."
      },
      {
        level: 4,
        title: "Complete solution approach",
        content: "Get the element, check if display is 'block', then set it to 'none' or 'block' accordingly. Also update the button text!"
      }
    ]
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const runCode = () => {
    setIsRunning(true)
    setAttempts(prev => prev + 1)
    
    // Simulate validation
    setTimeout(() => {
      const isValid = validateCode(code)
      setValidationResult(isValid)
      setIsRunning(false)
      
      if (isValid.success) {
        // Mission completed!
        console.log('Mission completed!')
      }
    }, 2000)
  }

  const validateCode = (userCode: string) => {
    // Simple validation logic - in real app this would be more sophisticated
    const hasToggleLogic = userCode.includes('if') && userCode.includes('else')
    const checksDisplay = userCode.includes('style.display')
    const togglesBetweenBlockAndNone = 
      userCode.includes('display = \'block\'') && userCode.includes('display = \'none\'')
    
    const success = hasToggleLogic && checksDisplay && togglesBetweenBlockAndNone
    
    return {
      success,
      feedback: success 
        ? "Excellent! You've successfully implemented the toggle functionality."
        : "Not quite right. Make sure you're checking the current state and toggling between 'block' and 'none'.",
      tests: [
        { name: "Has toggle logic", passed: hasToggleLogic },
        { name: "Checks display property", passed: checksDisplay },
        { name: "Toggles correctly", passed: togglesBetweenBlockAndNone }
      ]
    }
  }

  const resetCode = () => {
    setCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Broken Button</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
        }
        .btn {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 5px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .message {
            margin-top: 20px;
            padding: 15px;
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 5px;
            display: none;
        }
    </style>
</head>
<body>
    <h1>Interactive Message Toggle</h1>
    <p>Click the button below to show/hide the secret message:</p>
    
    <button class="btn" onclick="showMessage()">Show Message</button>
    
    <div id="secretMessage" class="message">
        <h3>🎉 Congratulations!</h3>
        <p>You've successfully toggled the message visibility!</p>
    </div>

    <script>
        function showMessage() {
            document.getElementById('secretMessage').style.display = 'block';
        }
    </script>
</body>
</html>`)
    setValidationResult(null)
  }

  const getHint = () => {
    if (currentHint < mission.hints.length) {
      setCurrentHint(prev => prev + 1)
    }
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
                <Code className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">{mission.title}</h1>
              </div>
              <Badge variant="default">{mission.difficulty}</Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{mission.points} pts</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>{attempts} attempts</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mission Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Instructions & Hints */}
          <div className="lg:col-span-1 space-y-4">
            {/* Mission Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Mission Objectives
                </CardTitle>
                <CardDescription>
                  {mission.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {mission.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Hints Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Hints ({currentHint}/{mission.hints.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mission.hints.slice(0, currentHint).map((hint, index) => (
                  <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">{hint.title}</h4>
                    <p className="text-xs text-muted-foreground">{hint.content}</p>
                  </div>
                ))}
                
                {currentHint < mission.hints.length && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={getHint}
                    className="w-full"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Get Hint (-{5 * (currentHint + 1)} points)
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* AI Mentor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Mentor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm">
                      I see you're working on toggling element visibility. Remember to check the current state before making changes!
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Ask for Help
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Code Editor & Preview */}
          <div className="lg:col-span-2 space-y-4">
            {/* Code Editor */}
            <Card className="flex-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Editor
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={resetCode}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button 
                      size="sm"
                      onClick={runCode}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 border rounded-lg overflow-hidden">
                  <Editor
                    height="100%"
                    defaultLanguage="html"
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

            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 border rounded-lg bg-white overflow-hidden">
                  <iframe
                    srcDoc={code}
                    className="w-full h-full"
                    title="Live Preview"
                    sandbox="allow-scripts"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Validation Results */}
            {validationResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {validationResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    Validation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className={validationResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <AlertDescription>
                      {validationResult.feedback}
                    </AlertDescription>
                  </Alert>
                  
                  {validationResult.tests && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium text-sm">Test Results:</h4>
                      {validationResult.tests.map((test: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{test.name}</span>
                          {test.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {validationResult.success && (
                    <div className="mt-4 text-center">
                      <Button size="lg" className="w-full">
                        <Trophy className="h-4 w-4 mr-2" />
                        Complete Mission (+{mission.points} XP)
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}