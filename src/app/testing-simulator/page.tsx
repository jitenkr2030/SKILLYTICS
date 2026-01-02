'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  RefreshCw,
  ArrowLeft,
  Bug,
  Code,
  Terminal,
  FileText,
  TestTube,
  AlertTriangle,
  Target,
  Zap
} from 'lucide-react'
import Editor from '@monaco-editor/react'

interface Test {
  id: string
  name: string
  description: string
  type: 'unit' | 'integration' | 'e2e' | 'performance'
  code: string
  expectedOutput: any
  timeout: number
  points: number
}

interface TestSuite {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: 'unit' | 'integration' | 'e2e' | 'performance'
  learningObjectives: string[]
  codeToTest: string
  tests: Test[]
  setupCode?: string
  mockData?: any
}

const testSuites: TestSuite[] = [
  {
    id: 'unit-testing-basics',
    title: 'Unit Testing Basics',
    description: 'Learn the fundamentals of unit testing with Jest',
    difficulty: 'beginner',
    category: 'unit',
    learningObjectives: [
      'Understand unit testing concepts',
      'Write test assertions',
      'Test edge cases',
      'Use test doubles and mocks'
    ],
    codeToTest: `// Calculator class to test
class Calculator {
  add(a, b) {
    return a + b;
  }
  
  subtract(a, b) {
    return a - b;
  }
  
  multiply(a, b) {
    return a * b;
  }
  
  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }
  
  power(base, exponent) {
    return Math.pow(base, exponent);
  }
}`,
    tests: [
      {
        id: 'test-add',
        name: 'Test Addition',
        description: 'Test the add method with various inputs',
        type: 'unit',
        code: `// Test addition
const calc = new Calculator();

// Test cases
console.log(calc.add(2, 3) === 5); // Should be true
console.log(calc.add(-1, 1) === 0); // Should be true
console.log(calc.add(0, 0) === 0); // Should be true
console.log(calc.add(1.5, 2.5) === 4); // Should be true`,
        expectedOutput: [true, true, true, true],
        timeout: 5000,
        points: 10
      },
      {
        id: 'test-subtract',
        name: 'Test Subtraction',
        description: 'Test the subtract method with various inputs',
        type: 'unit',
        code: `// Test subtraction
const calc = new Calculator();

// Test cases
console.log(calc.subtract(5, 3) === 2); // Should be true
console.log(calc.subtract(0, 5) === -5); // Should be true
console.log(calc.subtract(-2, -3) === 1); // Should be true`,
        expectedOutput: [true, true, true],
        timeout: 5000,
        points: 10
      },
      {
        id: 'test-division',
        name: 'Test Division',
        description: 'Test the divide method including error handling',
        type: 'unit',
        code: `// Test division
const calc = new Calculator();

// Test cases
console.log(calc.divide(10, 2) === 5); // Should be true
console.log(calc.divide(-6, 3) === -2); // Should be true

// Test division by zero error
try {
  calc.divide(5, 0);
  console.log(false); // Should not reach here
} catch (error) {
  console.log(error.message === 'Division by zero'); // Should be true
}`,
        expectedOutput: [true, true, true],
        timeout: 5000,
        points: 15
      }
    ]
  },
  {
    id: 'integration-testing',
    title: 'Integration Testing',
    description: 'Test how different parts of your application work together',
    difficulty: 'intermediate',
    category: 'integration',
    learningObjectives: [
      'Understand integration testing concepts',
      'Test API endpoints',
      'Test database operations',
      'Mock external dependencies'
    ],
    codeToTest: `// User service with database integration
class UserService {
  constructor(database) {
    this.db = database;
  }
  
  async createUser(userData) {
    // Validate input
    if (!userData.email || !userData.name) {
      throw new Error('Email and name are required');
    }
    
    // Check if user already exists
    const existingUser = await this.db.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create user
    const user = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      createdAt: new Date()
    };
    
    return await this.db.saveUser(user);
  }
  
  async getUserById(id) {
    const user = await this.db.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  
  async updateUser(id, updates) {
    const user = await this.db.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    return await this.db.updateUser(updatedUser);
  }
}

// Mock database
const mockDatabase = {
  users: [],
  
  async findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  },
  
  async findUserById(id) {
    return this.users.find(user => user.id === id);
  },
  
  async saveUser(user) {
    this.users.push(user);
    return user;
  },
  
  async updateUser(user) {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return user;
  }
};`,
    tests: [
      {
        id: 'test-create-user',
        name: 'Test User Creation',
        description: 'Test creating a new user with valid data',
        type: 'integration',
        code: `// Test user creation
const userService = new UserService(mockDatabase);
const userData = {
  email: 'test@example.com',
  name: 'Test User'
};

try {
  const user = await userService.createUser(userData);
  console.log(user.email === userData.email); // Should be true
  console.log(user.name === userData.name); // Should be true
  console.log(user.id); // Should exist
  console.log(user.createdAt instanceof Date); // Should be true
} catch (error) {
  console.log('Error:', error.message);
}`,
        expectedOutput: [true, true, true, true],
        timeout: 5000,
        points: 15
      },
      {
        id: 'test-duplicate-email',
        name: 'Test Duplicate Email Prevention',
        description: 'Test that creating a user with duplicate email fails',
        type: 'integration',
        code: `// Test duplicate email prevention
const userService = new UserService(mockDatabase);
const userData = {
  email: 'duplicate@example.com',
  name: 'Test User'
};

// Create first user
await userService.createUser(userData);

// Try to create user with same email
try {
  await userService.createUser(userData);
  console.log(false); // Should not reach here
} catch (error) {
  console.log(error.message === 'User with this email already exists'); // Should be true
}`,
        expectedOutput: [true],
        timeout: 5000,
        points: 15
      }
    ]
  },
  {
    id: 'e2e-testing',
    title: 'End-to-End Testing',
    description: 'Test complete user workflows from start to finish',
    difficulty: 'advanced',
    category: 'e2e',
    learningObjectives: [
      'Understand E2E testing concepts',
      'Test complete user workflows',
      'Use browser automation',
      'Test real user scenarios'
    ],
    codeToTest: `// E2E Test: User Registration and Login Flow
class E2ETestRunner {
  constructor() {
    this.page = null;
    this.browser = null;
  }
  
  async setup() {
    // Initialize browser
    this.browser = await this.launchBrowser();
    this.page = await this.browser.newPage();
  }
  
  async navigateToUrl(url) {
    await this.page.goto(url);
  }
  
  async clickElement(selector) {
    await this.page.click(selector);
  }
  
  async typeText(selector, text) {
    await this.page.type(selector, text);
  }
  
  async waitForElement(selector) {
    await this.page.waitForSelector(selector);
  }
  
  async getElementText(selector) {
    return await this.page.$eval(selector, el => el.textContent);
  }
  
  async isVisible(selector) {
    return await this.page.$eval(selector, el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }
  
  async launchBrowser() {
    // Mock browser implementation
    return {
      newPage: () => ({
        goto: async (url) => console.log('Navigating to:', url),
        click: async (selector) => console.log('Clicking:', selector),
        type: async (selector, text) => console.log('Typing in', selector, ':', text),
        waitForSelector: async (selector) => console.log('Waiting for:', selector),
        $eval: async (selector, fn) => {
          // Mock element evaluation
          if (selector === '#success-message') return 'Registration successful!';
          if (selector === '#error-message') return null;
          return 'Mock element text';
        }
      })
    };
  }
}

// Mock application responses
const mockApp = {
  '/register': {
    success: true,
    message: 'Registration successful!'
  },
  '/login': {
    success: true,
    user: { id: '1', name: 'Test User' }
  }
};`,
    tests: [
      {
        id: 'test-registration-flow',
        name: 'Test User Registration Flow',
        description: 'Test complete user registration from form to success',
        type: 'e2e',
        code: `// Test registration flow
const runner = new E2ETestRunner();
await runner.setup();

// Navigate to registration page
await runner.navigateToUrl('/register');

// Fill out registration form
await runner.typeText('#email', 'test@example.com');
await runner.typeText('#password', 'password123');
await runner.typeText('#confirmPassword', 'password123');
await runner.typeText('#name', 'Test User');

// Submit form
await runner.clickElement('#register-button');

// Wait for success message
await runner.waitForElement('#success-message');
const successMessage = await runner.getElementText('#success-message');

console.log(successMessage === 'Registration successful!'); // Should be true
console.log(await runner.isVisible('#success-message')); // Should be true`,
        expectedOutput: [true, true],
        timeout: 10000,
        points: 20
      },
      {
        id: 'test-login-flow',
        name: 'Test User Login Flow',
        description: 'Test complete user login from form to dashboard',
        type: 'e2e',
        code: `// Test login flow
const runner = new E2ETestRunner();
await runner.setup();

// Navigate to login page
await runner.navigateToUrl('/login');

// Fill out login form
await runner.typeText('#email', 'test@example.com');
await runner.typeText('#password', 'password123');

// Submit form
await runner.clickElement('#login-button');

// Wait for redirect to dashboard
await runner.waitForElement('#dashboard');
console.log(await runner.isVisible('#dashboard')); // Should be true

// Check user name is displayed
const userName = await runner.getElementText('#user-name');
console.log(userName === 'Test User'); // Should be true`,
        expectedOutput: [true, true],
        timeout: 10000,
        points: 20
      }
    ]
  },
  {
    id: 'performance-testing',
    title: 'Performance Testing',
    description: 'Test application performance and identify bottlenecks',
    difficulty: 'advanced',
    category: 'performance',
    learningObjectives: [
      'Understand performance testing concepts',
      'Measure response times',
      'Identify performance bottlenecks',
      'Test load handling'
    ],
    codeToTest: `// Performance testing utilities
class PerformanceTester {
  constructor() {
    this.metrics = [];
  }
  
  async measureFunction(fn, name) {
    const start = performance.now();
    const startMemory = this.getMemoryUsage();
    
    const result = await fn();
    
    const end = performance.now();
    const endMemory = this.getMemoryUsage();
    
    const metrics = {
      name,
      executionTime: end - start,
      memoryUsed: endMemory - startMemory,
      timestamp: new Date()
    };
    
    this.metrics.push(metrics);
    return { result, metrics };
  }
  
  getMemoryUsage() {
    // Mock memory usage in MB
    return Math.random() * 100;
  }
  
  async runLoadTest(url, concurrentUsers = 10) {
    const promises = [];
    
    for (let i = 0; i < concurrentUsers; i++) {
      promises.push(this.simulateUserRequest(url));
    }
    
    const results = await Promise.all(promises);
    return results;
  }
  
  async simulateUserRequest(url) {
    const start = performance.now();
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    
    const end = performance.now();
    return {
      responseTime: end - start,
      status: 200,
      timestamp: new Date()
    };
  }
  
  getAverageResponseTime() {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, m) => sum + m.executionTime, 0);
    return total / this.metrics.length;
  }
  
  getSlowestFunction() {
    if (this.metrics.length === 0) return null;
    return this.metrics.reduce((slowest, current) => 
      current.executionTime > slowest.executionTime ? current : slowest
    );
  }
}

// Functions to test
async function slowFunction() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return 'Slow result';
}

async function fastFunction() {
  await new Promise(resolve => setTimeout(resolve, 50));
  return 'Fast result';
}

async function memoryIntensiveFunction() {
  const largeArray = new Array(1000000).fill(0).map((_, i) => i);
  return largeArray.reduce((sum, num) => sum + num, 0);
}`,
    tests: [
      {
        id: 'test-response-time',
        name: 'Test Response Times',
        description: 'Measure and validate function response times',
        type: 'performance',
        code: `// Test response times
const tester = new PerformanceTester();

// Test slow function
const { result: slowResult, metrics: slowMetrics } = await tester.measureFunction(
  slowFunction, 
  'slowFunction'
);

console.log(slowMetrics.executionTime > 400); // Should be true (around 500ms)
console.log(slowMetrics.executionTime < 600); // Should be true

// Test fast function
const { result: fastResult, metrics: fastMetrics } = await tester.measureFunction(
  fastFunction, 
  'fastFunction'
);

console.log(fastMetrics.executionTime < 100); // Should be true (around 50ms)
console.log(fastMetrics.executionTime > 30); // Should be true

// Test memory intensive function
const { result: memoryResult, metrics: memoryMetrics } = await tester.measureFunction(
  memoryIntensiveFunction, 
  'memoryIntensiveFunction'
);

console.log(memoryMetrics.memoryUsed > 0); // Should be true
console.log(memoryMetrics.executionTime < 2000); // Should be under 2 seconds`,
        expectedOutput: [true, true, true, true, true, true],
        timeout: 5000,
        points: 15
      },
      {
        id: 'test-load-handling',
        name: 'Test Load Handling',
        description: 'Test application performance under load',
        type: 'performance',
        code: `// Test load handling
const tester = new PerformanceTester();

// Run load test with 5 concurrent users
const loadTestResults = await tester.runLoadTest('/api/data', 5);

// Analyze results
const responseTimes = loadTestResults.map(r => r.responseTime);
const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
const maxResponseTime = Math.max(...responseTimes);

console.log(loadTestResults.length === 5); // Should be true
console.log(loadTestResults.every(r => r.status === 200)); // Should be true
console.log(averageResponseTime < 1500); // Average should be under 1.5s
console.log(maxResponseTime < 2000); // Max should be under 2s

// Test with more users
const highLoadResults = await tester.runLoadTest('/api/data', 10);
const highLoadAverage = highLoadResults.reduce((sum, r) => sum + r.responseTime, 0) / highLoadResults.length;

console.log(highLoadResults.length === 10); // Should be true
console.log(highLoadAverage < averageResponseTime * 2); // Should handle load reasonably`,
        expectedOutput: [true, true, true, true, true, true],
        timeout: 8000,
        points: 20
      }
    ]
  }
]

export default function TestingSimulator() {
  const [selectedSuite, setSelectedSuite] = useState<TestSuite>(testSuites[0])
  const [currentTestIndex, setCurrentTestIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [currentTestCode, setCurrentTestCode] = useState('')
  const [testOutput, setTestOutput] = useState<string[]>([])
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (testSuites.length > 0 && !selectedSuite) {
      setSelectedSuite(testSuites[0])
    }
  }, [])

  useEffect(() => {
    if (selectedSuite && currentTestIndex < selectedSuite.tests.length) {
      setCurrentTestCode(selectedSuite.tests[currentTestIndex].code)
    }
  }, [selectedSuite, currentTestIndex])

  const runTest = async () => {
    if (!selectedSuite || currentTestIndex >= selectedSuite.tests.length) return
    
    setIsRunning(true)
    setTestOutput([])
    
    const currentTest = selectedSuite.tests[currentTestIndex]
    const output: string[] = []
    
    try {
      // Create a safe execution environment
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      const testFunction = new AsyncFunction('console', currentTest.code)
      
      // Capture console.log output
      const originalLog = console.log
      const capturedOutput: any[] = []
      console.log = (...args) => {
        capturedOutput.push(args)
        originalLog(...args)
      }
      
      // Execute the test with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Test timeout')), currentTest.timeout)
      })
      
      const testPromise = testFunction()
      
      await Promise.race([testPromise, timeoutPromise])
      
      // Restore console.log
      console.log = originalLog
      
      // Compare results
      const passed = JSON.stringify(capturedOutput) === JSON.stringify(currentTest.expectedOutput)
      
      const result = {
        testId: currentTest.id,
        testName: currentTest.name,
        passed,
        output: capturedOutput,
        expected: currentTest.expectedOutput,
        points: passed ? currentTest.points : 0,
        duration: Date.now()
      }
      
      setTestResults([...testResults, result])
      setCompletedTests(new Set([...completedTests, currentTest.id]))
      
      // Add output to display
      output.push(`\u001b[32m✓ Test: ${currentTest.name}\u001b[0m`)
      output.push(`\u001b[33m  Status: ${passed ? 'PASSED' : 'FAILED'}\u001b[0m`)
      output.push(`\u001b[36m  Points: ${result.points}/${currentTest.points}\u001b[0m`)
      output.push('')
      
      setTestOutput(output)
      
    } catch (error) {
      const result = {
        testId: currentTest.id,
        testName: currentTest.name,
        passed: false,
        output: [],
        expected: currentTest.expectedOutput,
        points: 0,
        duration: Date.now(),
        error: error.message
      }
      
      setTestResults([...testResults, result])
      
      const output = [
        `\u001b[31m✗ Test: ${currentTest.name}\u001b[0m`,
        `\u001b[31m  Status: FAILED\u001b[0m`,
        `\u001b[31m  Error: ${error.message}\u001b[0m`,
        ''
      ]
      
      setTestOutput(output)
    }
    
    setIsRunning(false)
    
    // Auto-advance to next test
    if (currentTestIndex < selectedSuite.tests.length - 1) {
      setTimeout(() => {
        setCurrentTestIndex(currentTestIndex + 1)
      }, 1000)
    }
  }

  const runAllTests = async () => {
    setCurrentTestIndex(0)
    setTestResults([])
    setCompletedTests(new Set())
    
    for (let i = 0; i < selectedSuite.tests.length; i++) {
      setCurrentTestIndex(i)
      await runTest()
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const resetTests = () => {
    setCurrentTestIndex(0)
    setTestResults([])
    setCompletedTests(new Set())
    setTestOutput([])
  }

  const getTestProgress = () => {
    if (!selectedSuite) return 0
    return (completedTests.size / selectedSuite.tests.length) * 100
  }

  const getTotalPoints = () => {
    return testResults.reduce((sum, result) => sum + result.points, 0)
  }

  const getMaxPoints = () => {
    return selectedSuite.tests.reduce((sum, test) => sum + test.points, 0)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTestCategoryColor = (category: string) => {
    switch (category) {
      case 'unit': return 'bg-blue-100 text-blue-800'
      case 'integration': return 'bg-purple-100 text-purple-800'
      case 'e2e': return 'bg-orange-100 text-orange-800'
      case 'performance': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <TestTube className="h-6 w-6 text-cyan-600" />
                <h1 className="text-2xl font-bold">Testing Simulator</h1>
              </div>
              <Badge variant="secondary">Learn Testing by Doing</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={runAllTests} disabled={isRunning}>
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Running All
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline" onClick={resetTests}>
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
          {/* Left Panel - Test Suite Selection */}
          <div className="lg:col-span-1 space-y-4">
            {/* Test Suite Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Test Suites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {testSuites.map((suite) => (
                    <button
                      key={suite.id}
                      onClick={() => {
                        setSelectedSuite(suite)
                        resetTests()
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedSuite.id === suite.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{suite.title}</h4>
                        <div className="flex items-center gap-1">
                          <Badge className={getDifficultyColor(suite.difficulty)}>
                            {suite.difficulty}
                          </Badge>
                          <Badge className={getTestCategoryColor(suite.category)}>
                            {suite.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {suite.description}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {selectedSuite.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Test Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Test Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(getTestProgress())}%</span>
                  </div>
                  <Progress value={getTestProgress()} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {getTotalPoints()}
                    </div>
                    <div className="text-xs text-muted-foreground">Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {getMaxPoints()}
                    </div>
                    <div className="text-xs text-muted-foreground">Max Points</div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {completedTests.size} of {selectedSuite.tests.length} tests completed
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Test Runner */}
          <div className="lg:col-span-2 space-y-4">
            {/* Code to Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Code to Test
                </CardTitle>
                <CardDescription>
                  This is the code that will be tested
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 border rounded-lg overflow-hidden bg-slate-900">
                  <pre className="p-4 text-sm text-slate-100 overflow-x-auto">
                    {selectedSuite.codeToTest}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Current Test */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Test Runner
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      Test {currentTestIndex + 1} of {selectedSuite.tests.length}
                    </Badge>
                    <Button size="sm" onClick={runTest} disabled={isRunning}>
                      {isRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Test
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {selectedSuite.tests[currentTestIndex]?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Test Code */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Test Code:</h4>
                    <div className="h-48 border rounded-lg overflow-hidden bg-slate-900">
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        value={currentTestCode}
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 12,
                          lineNumbers: 'on',
                          readOnly: true,
                          roundedSelection: false,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Test Output */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Test Output:</h4>
                    <div className="h-32 bg-black text-green-400 p-3 rounded-lg font-mono text-xs overflow-y-auto">
                      {testOutput.length > 0 ? (
                        testOutput.map((line, index) => (
                          <div key={index}>{line}</div>
                        ))
                      ) : (
                        <div className="text-gray-500">Test output will appear here...</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {testResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg ${
                          result.passed
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {result.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="font-medium text-sm">{result.testName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={result.passed ? "default" : "destructive"}>
                              {result.passed ? 'PASSED' : 'FAILED'}
                            </Badge>
                            <Badge variant="outline">
                              {result.points}/{selectedSuite.tests.find(t => t.id === result.testId)?.points} pts
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
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