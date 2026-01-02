'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Play,
  Code,
  Eye,
  Download,
  RefreshCw,
  Bug,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react'
import Editor from '@monaco-editor/react'

interface SecurityIssue {
  id: string
  type: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  line: number
  code: string
  recommendation: string
  cwe?: string
  owasp?: string
}

interface PerformanceIssue {
  id: string
  type: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  line: number
  code: string
  impact: string
  recommendation: string
  estimatedImprovement: string
}

interface AnalysisResult {
  security: SecurityIssue[]
  performance: PerformanceIssue[]
  overallScore: {
    security: number
    performance: number
    overall: number
  }
  metrics: {
    linesOfCode: number
    complexity: number
    maintainability: number
    testCoverage: number
  }
}

const sampleCode = `// Vulnerable code example
function loginUser(username, password) {
  // SQL Injection vulnerability
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  // Direct database query without sanitization
  const user = database.query(query);
  
  if (user) {
    // XSS vulnerability
    document.getElementById('welcome').innerHTML = 'Welcome ' + username + '!';
    
    // Store password in localStorage (security risk)
    localStorage.setItem('userPassword', password);
    
    return user;
  }
  
  return null;
}

// Performance issues
function processData(data) {
  // Inefficient loop - O(n²) complexity
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data.length; j++) {
      console.log(data[i] + data[j]);
    }
  }
  
  // Synchronous file operations
  const fileContent = fs.readFileSync('large-file.json');
  const parsed = JSON.parse(fileContent);
  
  // Memory leak - event listeners not removed
  data.forEach(item => {
    document.addEventListener('click', function() {
      console.log(item);
    });
  });
  
  return parsed;
}

// More vulnerable code
function executeUserInput(input) {
  // Code injection risk
  eval('console.log(' + input + ')');
  
  // Path traversal vulnerability
  const filePath = '/uploads/' + input;
  const file = fs.readFileSync(filePath);
  
  return file;
}

// Inefficient DOM manipulation
function updateUI(items) {
  const container = document.getElementById('container');
  
  // DOM manipulation in loop - very slow
  items.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item.name;
    div.className = 'item';
    container.appendChild(div);
    
    // Forced reflow
    div.style.height = div.offsetHeight + 'px';
  });
}

// Missing error handling
async function fetchUserData(userId) {
  // No error handling
  const response = await fetch('/api/users/' + userId);
  const user = await response.json();
  
  // Potential null reference
  return user.profile.settings.theme;
}`

const securityIssues: SecurityIssue[] = [
  {
    id: 'sql-injection',
    type: 'critical',
    title: 'SQL Injection',
    description: 'Direct string concatenation in SQL query allows SQL injection attacks',
    line: 4,
    code: `const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";`,
    recommendation: 'Use parameterized queries or prepared statements to prevent SQL injection',
    cwe: 'CWE-89',
    owasp: 'A03:2021 – Injection'
  },
  {
    id: 'xss',
    type: 'high',
    title: 'Cross-Site Scripting (XSS)',
    description: 'Direct HTML injection allows script execution',
    line: 13,
    code: `document.getElementById('welcome').innerHTML = 'Welcome ' + username + '!';`,
    recommendation: 'Use textContent instead of innerHTML, or sanitize user input',
    cwe: 'CWE-79',
    owasp: 'A03:2021 – Injection'
  },
  {
    id: 'password-storage',
    type: 'high',
    title: 'Insecure Password Storage',
    description: 'Storing passwords in localStorage is not secure',
    line: 16,
    code: `localStorage.setItem('userPassword', password);`,
    recommendation: 'Never store passwords in client-side storage. Use secure authentication tokens.',
    cwe: 'CWE-522',
    owasp: 'A02:2021 – Cryptographic Failures'
  },
  {
    id: 'code-injection',
    type: 'critical',
    title: 'Code Injection',
    description: 'Using eval() with user input allows arbitrary code execution',
    line: 44,
    code: `eval('console.log(' + input + ')');`,
    recommendation: 'Avoid eval() with user input. Use safer alternatives like JSON.parse.',
    cwe: 'CWE-94',
    owasp: 'A03:2021 – Injection'
  },
  {
    id: 'path-traversal',
    type: 'high',
    title: 'Path Traversal',
    description: 'Direct file path concatenation allows directory traversal attacks',
    line: 49,
    code: `const filePath = '/uploads/' + input;`,
    recommendation: 'Validate and sanitize file paths. Use a whitelist of allowed directories.',
    cwe: 'CWE-22',
    owasp: 'A01:2021 – Broken Access Control'
  }
]

const performanceIssues: PerformanceIssue[] = [
  {
    id: 'nested-loops',
    type: 'high',
    title: 'Inefficient Nested Loops',
    description: 'O(n²) complexity will be very slow with large datasets',
    line: 23,
    code: `for (let i = 0; i < data.length; i++) {
  for (let j = 0; j < data.length; j++) {
    console.log(data[i] + data[j]);
  }
}`,
    impact: 'High CPU usage, slow execution with large datasets',
    recommendation: 'Optimize algorithm to O(n) or use more efficient data structures',
    estimatedImprovement: '90% faster execution'
  },
  {
    id: 'sync-file-ops',
    type: 'critical',
    title: 'Synchronous File Operations',
    description: 'Blocking I/O operations will freeze the application',
    line: 30,
    code: `const fileContent = fs.readFileSync('large-file.json');`,
    impact: 'Application freezes during file operations',
    recommendation: 'Use asynchronous file operations (fs.readFile) with callbacks or promises',
    estimatedImprovement: '100% responsive UI'
  },
  {
    id: 'memory-leak',
    type: 'medium',
    title: 'Memory Leak - Event Listeners',
    description: 'Event listeners are never removed, causing memory leaks',
    line: 35,
    code: `document.addEventListener('click', function() {
  console.log(item);
});`,
    impact: 'Memory usage increases over time',
    recommendation: 'Remove event listeners when they are no longer needed or use event delegation',
    estimatedImprovement: '50% less memory usage'
  },
  {
    id: 'dom-manipulation',
    type: 'high',
    title: 'Inefficient DOM Manipulation',
    description: 'DOM manipulation in loops causes multiple reflows',
    line: 60,
    code: `items.forEach(item => {
  const div = document.createElement('div');
  container.appendChild(div);
  div.style.height = div.offsetHeight + 'px';
});`,
    impact: 'Slow UI updates and janky animations',
    recommendation: 'Batch DOM updates or use document fragments',
    estimatedImprovement: '80% faster UI updates'
  },
  {
    id: 'missing-error-handling',
    type: 'medium',
    title: 'Missing Error Handling',
    description: 'No error handling for network requests can cause crashes',
    line: 73,
    code: `const response = await fetch('/api/users/' + userId);
const user = await response.json();`,
    impact: 'Application crashes on network errors',
    recommendation: 'Add proper try-catch blocks and handle different response statuses',
    estimatedImprovement: '100% error-free operation'
  }
]

export default function CodeAnalyzer() {
  const [code, setCode] = useState(sampleCode)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState('security')
  const [selectedIssue, setSelectedIssue] = useState<SecurityIssue | PerformanceIssue | null>(null)

  const analyzeCode = () => {
    setIsAnalyzing(true)
    
    // Simulate analysis process
    setTimeout(() => {
      const result: AnalysisResult = {
        security: securityIssues,
        performance: performanceIssues,
        overallScore: {
          security: Math.max(0, 100 - (securityIssues.filter(i => i.type === 'critical').length * 20) - (securityIssues.filter(i => i.type === 'high').length * 10)),
          performance: Math.max(0, 100 - (performanceIssues.filter(i => i.type === 'critical').length * 20) - (performanceIssues.filter(i => i.type === 'high').length * 10)),
          overall: 0
        },
        metrics: {
          linesOfCode: code.split('\n').length,
          complexity: 75,
          maintainability: 60,
          testCoverage: 25
        }
      }
      
      result.overallScore.overall = Math.round((result.overallScore.security + result.overallScore.performance) / 2)
      
      setAnalysisResult(result)
      setIsAnalyzing(false)
    }, 2000)
  }

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getSecurityIssues = () => {
    return analysisResult?.security || []
  }

  const getPerformanceIssues = () => {
    return analysisResult?.performance || []
  }

  const getCurrentIssues = () => {
    return activeTab === 'security' ? getSecurityIssues() : getPerformanceIssues()
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
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold">Code Analyzer</h1>
              </div>
              <Badge variant="secondary">Security & Performance Analysis</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={analyzeCode} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Analyze Code
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Code Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Code Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Code Editor
                </CardTitle>
                <CardDescription>
                  Paste or edit your code to analyze for security and performance issues
                </CardDescription>
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

            {/* Analysis Results */}
            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security ({getSecurityIssues().length})
                      </TabsTrigger>
                      <TabsTrigger value="performance" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Performance ({getPerformanceIssues().length})
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="security" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${getScoreColor(analysisResult.overallScore.security)}`}>
                            {analysisResult.overallScore.security}%
                          </div>
                          <div className="text-sm text-muted-foreground">Security Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600">
                            {getSecurityIssues().filter(i => i.type === 'critical').length}
                          </div>
                          <div className="text-sm text-muted-foreground">Critical Issues</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600">
                            {getSecurityIssues().filter(i => i.type === 'high').length}
                          </div>
                          <div className="text-sm text-muted-foreground">High Issues</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {getSecurityIssues().map((issue) => (
                          <div
                            key={issue.id}
                            className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                              selectedIssue?.id === issue.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedIssue(issue)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{issue.title}</h4>
                                  <Badge className={getIssueColor(issue.type)}>
                                    {issue.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {issue.description}
                                </p>
                                <div className="text-xs text-muted-foreground">
                                  Line {issue.line} • {issue.cwe} • {issue.owasp}
                                </div>
                              </div>
                              {issue.type === 'critical' ? (
                                <XCircle className="h-5 w-5 text-red-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="performance" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${getScoreColor(analysisResult.overallScore.performance)}`}>
                            {analysisResult.overallScore.performance}%
                          </div>
                          <div className="text-sm text-muted-foreground">Performance Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600">
                            {getPerformanceIssues().filter(i => i.type === 'critical').length}
                          </div>
                          <div className="text-sm text-muted-foreground">Critical Issues</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600">
                            {getPerformanceIssues().filter(i => i.type === 'high').length}
                          </div>
                          <div className="text-sm text-muted-foreground">High Issues</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {getPerformanceIssues().map((issue) => (
                          <div
                            key={issue.id}
                            className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                              selectedIssue?.id === issue.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedIssue(issue)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{issue.title}</h4>
                                  <Badge className={getIssueColor(issue.type)}>
                                    {issue.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {issue.description}
                                </p>
                                <div className="text-xs text-muted-foreground">
                                  Line {issue.line} • {issue.estimatedImprovement} improvement
                                </div>
                              </div>
                              {issue.type === 'critical' ? (
                                <Clock className="h-5 w-5 text-red-500" />
                              ) : (
                                <TrendingUp className="h-5 w-5 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Issue Details & Metrics */}
          <div className="lg:col-span-1 space-y-4">
            {/* Overall Score */}
            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Overall Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(analysisResult.overallScore.overall)}`}>
                      {analysisResult.overallScore.overall}%
                    </div>
                    <div className="text-sm text-muted-foreground">Code Quality</div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Security</span>
                      <span className={getScoreColor(analysisResult.overallScore.security)}>
                        {analysisResult.overallScore.security}%
                      </span>
                    </div>
                    <Progress value={analysisResult.overallScore.security} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span className={getScoreColor(analysisResult.overallScore.performance)}>
                        {analysisResult.overallScore.performance}%
                      </span>
                    </div>
                    <Progress value={analysisResult.overallScore.performance} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Issue Details */}
            {selectedIssue && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5" />
                    Issue Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{selectedIssue.title}</h4>
                    <Badge className={getIssueColor(selectedIssue.type)}>
                      {selectedIssue.type}
                    </Badge>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-1">Description:</h5>
                    <p className="text-sm text-muted-foreground">
                      {selectedIssue.description}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-1">Problematic Code:</h5>
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs font-mono">
                      {selectedIssue.code}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-1">Recommendation:</h5>
                    <p className="text-sm text-muted-foreground">
                      {selectedIssue.recommendation}
                    </p>
                  </div>
                  
                  {'cwe' in selectedIssue && (
                    <div>
                      <h5 className="font-medium text-sm mb-1">CWE:</h5>
                      <p className="text-sm text-muted-foreground">
                        {selectedIssue.cwe}
                      </p>
                    </div>
                  )}
                  
                  {'owasp' in selectedIssue && (
                    <div>
                      <h5 className="font-medium text-sm mb-1">OWASP:</h5>
                      <p className="text-sm text-muted-foreground">
                        {selectedIssue.owasp}
                      </p>
                    </div>
                  )}
                  
                  {'estimatedImprovement' in selectedIssue && (
                    <div>
                      <h5 className="font-medium text-sm mb-1">Expected Improvement:</h5>
                      <p className="text-sm text-muted-foreground">
                        {selectedIssue.estimatedImprovement}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Code Metrics */}
            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Code Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Lines of Code</span>
                      <span>{analysisResult.metrics.linesOfCode}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Complexity</span>
                      <span className={getScoreColor(100 - analysisResult.metrics.complexity)}>
                        {analysisResult.metrics.complexity}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Maintainability</span>
                      <span className={getScoreColor(analysisResult.metrics.maintainability)}>
                        {analysisResult.metrics.maintainability}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Test Coverage</span>
                      <span className={getScoreColor(analysisResult.metrics.testCoverage)}>
                        {analysisResult.metrics.testCoverage}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Code className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}