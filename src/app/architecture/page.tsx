'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Box, 
  Server, 
  Database, 
  Cloud, 
  Users,
  ArrowLeft,
  Play,
  RotateCcw,
  Eye,
  Download,
  Share2,
  Layers,
  Zap,
  Shield,
  Globe,
  Target
} from 'lucide-react'

interface ArchitectureComponent {
  id: string
  name: string
  type: 'frontend' | 'backend' | 'database' | 'api' | 'cache' | 'queue' | 'storage' | 'cdn'
  description: string
  technologies: string[]
  position: { x: number; y: number }
  connections: string[]
  metrics?: {
    requests?: number
    responseTime?: number
    uptime?: number
    errorRate?: number
  }
}

interface ArchitectureSystem {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  components: ArchitectureComponent[]
  dataFlow: Array<{ from: string; to: string; type: 'request' | 'response' | 'data' }>
  learningObjectives: string[]
}

const architectureSystems: ArchitectureSystem[] = [
  {
    id: 'web-app-basic',
    name: 'Basic Web Application',
    description: 'A simple three-tier web application with frontend, backend, and database',
    difficulty: 'beginner',
    components: [
      {
        id: 'frontend',
        name: 'Frontend (React)',
        type: 'frontend',
        description: 'User interface built with React',
        technologies: ['React', 'HTML', 'CSS', 'JavaScript'],
        position: { x: 100, y: 100 },
        connections: ['backend'],
        metrics: {
          requests: 1000,
          responseTime: 150,
          uptime: 99.9,
          errorRate: 0.1
        }
      },
      {
        id: 'backend',
        name: 'Backend API',
        type: 'backend',
        description: 'RESTful API server',
        technologies: ['Node.js', 'Express', 'TypeScript'],
        position: { x: 400, y: 100 },
        connections: ['frontend', 'database'],
        metrics: {
          requests: 1000,
          responseTime: 200,
          uptime: 99.5,
          errorRate: 0.5
        }
      },
      {
        id: 'database',
        name: 'Database',
        type: 'database',
        description: 'PostgreSQL database for data persistence',
        technologies: ['PostgreSQL', 'SQL'],
        position: { x: 700, y: 100 },
        connections: ['backend'],
        metrics: {
          requests: 500,
          responseTime: 50,
          uptime: 99.9,
          errorRate: 0.1
        }
      }
    ],
    dataFlow: [
      { from: 'frontend', to: 'backend', type: 'request' },
      { from: 'backend', to: 'frontend', type: 'response' },
      { from: 'backend', to: 'database', type: 'data' },
      { from: 'database', to: 'backend', type: 'data' }
    ],
    learningObjectives: [
      'Understand three-tier architecture',
      'Learn about client-server communication',
      'Identify data flow patterns',
      'Recognize component responsibilities'
    ]
  },
  {
    id: 'microservices',
    name: 'Microservices Architecture',
    description: 'A distributed system with multiple independent services',
    difficulty: 'advanced',
    components: [
      {
        id: 'gateway',
        name: 'API Gateway',
        type: 'api',
        description: 'Entry point for all client requests',
        technologies: ['Kong', 'NGINX'],
        position: { x: 100, y: 200 },
        connections: ['user-service', 'order-service', 'product-service'],
        metrics: {
          requests: 5000,
          responseTime: 100,
          uptime: 99.9,
          errorRate: 0.1
        }
      },
      {
        id: 'user-service',
        name: 'User Service',
        type: 'backend',
        description: 'Manages user authentication and profiles',
        technologies: ['Node.js', 'JWT', 'MongoDB'],
        position: { x: 400, y: 50 },
        connections: ['gateway', 'user-db'],
        metrics: {
          requests: 2000,
          responseTime: 150,
          uptime: 99.5,
          errorRate: 0.3
        }
      },
      {
        id: 'order-service',
        name: 'Order Service',
        type: 'backend',
        description: 'Handles order processing and management',
        technologies: ['Java', 'Spring Boot', 'MySQL'],
        position: { x: 400, y: 200 },
        connections: ['gateway', 'order-db', 'message-queue'],
        metrics: {
          requests: 1500,
          responseTime: 250,
          uptime: 99.0,
          errorRate: 0.5
        }
      },
      {
        id: 'product-service',
        name: 'Product Service',
        type: 'backend',
        description: 'Product catalog and inventory management',
        technologies: ['Python', 'Django', 'PostgreSQL'],
        position: { x: 400, y: 350 },
        connections: ['gateway', 'product-db', 'cache'],
        metrics: {
          requests: 1500,
          responseTime: 180,
          uptime: 99.8,
          errorRate: 0.2
        }
      },
      {
        id: 'user-db',
        name: 'User DB',
        type: 'database',
        description: 'User data storage',
        technologies: ['MongoDB'],
        position: { x: 700, y: 50 },
        connections: ['user-service'],
        metrics: {
          requests: 800,
          responseTime: 30,
          uptime: 99.9,
          errorRate: 0.1
        }
      },
      {
        id: 'order-db',
        name: 'Order DB',
        type: 'database',
        description: 'Order and transaction data',
        technologies: ['MySQL'],
        position: { x: 700, y: 200 },
        connections: ['order-service'],
        metrics: {
          requests: 600,
          responseTime: 40,
          uptime: 99.7,
          errorRate: 0.2
        }
      },
      {
        id: 'product-db',
        name: 'Product DB',
        type: 'database',
        description: 'Product catalog data',
        technologies: ['PostgreSQL'],
        position: { x: 700, y: 350 },
        connections: ['product-service'],
        metrics: {
          requests: 700,
          responseTime: 35,
          uptime: 99.9,
          errorRate: 0.1
        }
      },
      {
        id: 'cache',
        name: 'Redis Cache',
        type: 'cache',
        description: 'Caching layer for performance',
        technologies: ['Redis'],
        position: { x: 550, y: 300 },
        connections: ['product-service'],
        metrics: {
          requests: 1000,
          responseTime: 5,
          uptime: 99.9,
          errorRate: 0.05
        }
      },
      {
        id: 'message-queue',
        name: 'Message Queue',
        type: 'queue',
        description: 'Asynchronous message processing',
        technologies: ['RabbitMQ'],
        position: { x: 250, y: 300 },
        connections: ['order-service'],
        metrics: {
          requests: 500,
          responseTime: 20,
          uptime: 99.8,
          errorRate: 0.1
        }
      }
    ],
    dataFlow: [
      { from: 'gateway', to: 'user-service', type: 'request' },
      { from: 'gateway', to: 'order-service', type: 'request' },
      { from: 'gateway', to: 'product-service', type: 'request' },
      { from: 'user-service', to: 'gateway', type: 'response' },
      { from: 'order-service', to: 'gateway', type: 'response' },
      { from: 'product-service', to: 'gateway', type: 'response' },
      { from: 'user-service', to: 'user-db', type: 'data' },
      { from: 'order-service', to: 'order-db', type: 'data' },
      { from: 'product-service', to: 'product-db', type: 'data' },
      { from: 'product-service', to: 'cache', type: 'data' },
      { from: 'order-service', to: 'message-queue', type: 'data' }
    ],
    learningObjectives: [
      'Understand microservices architecture patterns',
      'Learn about service communication',
      'Identify data consistency strategies',
      'Recognize scalability trade-offs'
    ]
  },
  {
    id: 'serverless',
    name: 'Serverless Architecture',
    description: 'Event-driven serverless application with cloud functions',
    difficulty: 'intermediate',
    components: [
      {
        id: 'frontend',
        name: 'Static Frontend',
        type: 'frontend',
        description: 'React SPA hosted on CDN',
        technologies: ['React', 'Vercel', 'CDN'],
        position: { x: 100, y: 150 },
        connections: ['api-gateway'],
        metrics: {
          requests: 2000,
          responseTime: 100,
          uptime: 99.9,
          errorRate: 0.1
        }
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        type: 'api',
        description: 'Serverless API gateway',
        technologies: ['AWS API Gateway'],
        position: { x: 400, y: 150 },
        connections: ['frontend', 'auth-function', 'data-function', 'upload-function'],
        metrics: {
          requests: 2000,
          responseTime: 120,
          uptime: 99.9,
          errorRate: 0.1
        }
      },
      {
        id: 'auth-function',
        name: 'Auth Function',
        type: 'backend',
        description: 'Serverless authentication',
        technologies: ['AWS Lambda', 'Node.js'],
        position: { x: 700, y: 50 },
        connections: ['api-gateway', 'auth-table'],
        metrics: {
          requests: 500,
          responseTime: 200,
          uptime: 99.5,
          errorRate: 0.2
        }
      },
      {
        id: 'data-function',
        name: 'Data Function',
        type: 'backend',
        description: 'Data processing function',
        technologies: ['AWS Lambda', 'Python'],
        position: { x: 700, y: 150 },
        connections: ['api-gateway', 'data-table'],
        metrics: {
          requests: 800,
          responseTime: 300,
          uptime: 99.0,
          errorRate: 0.3
        }
      },
      {
        id: 'upload-function',
        name: 'Upload Function',
        type: 'backend',
        description: 'File upload processing',
        technologies: ['AWS Lambda', 'Node.js'],
        position: { x: 700, y: 250 },
        connections: ['api-gateway', 'storage'],
        metrics: {
          requests: 200,
          responseTime: 500,
          uptime: 99.0,
          errorRate: 0.5
        }
      },
      {
        id: 'auth-table',
        name: 'Auth Table',
        type: 'database',
        description: 'User authentication data',
        technologies: ['DynamoDB'],
        position: { x: 900, y: 50 },
        connections: ['auth-function'],
        metrics: {
          requests: 300,
          responseTime: 10,
          uptime: 99.9,
          errorRate: 0.1
        }
      },
      {
        id: 'data-table',
        name: 'Data Table',
        type: 'database',
        description: 'Application data',
        technologies: ['DynamoDB'],
        position: { x: 900, y: 150 },
        connections: ['data-function'],
        metrics: {
          requests: 500,
          responseTime: 15,
          uptime: 99.9,
          errorRate: 0.1
        }
      },
      {
        id: 'storage',
        name: 'Object Storage',
        type: 'storage',
        description: 'File storage service',
        technologies: ['AWS S3'],
        position: { x: 900, y: 250 },
        connections: ['upload-function'],
        metrics: {
          requests: 100,
          responseTime: 100,
          uptime: 99.9,
          errorRate: 0.1
        }
      }
    ],
    dataFlow: [
      { from: 'frontend', to: 'api-gateway', type: 'request' },
      { from: 'api-gateway', to: 'frontend', type: 'response' },
      { from: 'api-gateway', to: 'auth-function', type: 'request' },
      { from: 'api-gateway', to: 'data-function', type: 'request' },
      { from: 'api-gateway', to: 'upload-function', type: 'request' },
      { from: 'auth-function', to: 'api-gateway', type: 'response' },
      { from: 'data-function', to: 'api-gateway', type: 'response' },
      { from: 'upload-function', to: 'api-gateway', type: 'response' },
      { from: 'auth-function', to: 'auth-table', type: 'data' },
      { from: 'data-function', to: 'data-table', type: 'data' },
      { from: 'upload-function', to: 'storage', type: 'data' }
    ],
    learningObjectives: [
      'Understand serverless architecture principles',
      'Learn about event-driven design',
      'Identify cloud service integrations',
      'Recognize cost and scalability benefits'
    ]
  }
]

export default function ArchitectureVisualization() {
  const [selectedSystem, setSelectedSystem] = useState<ArchitectureSystem>(architectureSystems[0])
  const [selectedComponent, setSelectedComponent] = useState<ArchitectureComponent | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDataFlow, setShowDataFlow] = useState(true)

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'frontend': return <Box className="h-6 w-6" />
      case 'backend': return <Server className="h-6 w-6" />
      case 'database': return <Database className="h-6 w-6" />
      case 'api': return <Globe className="h-6 w-6" />
      case 'cache': return <Zap className="h-6 w-6" />
      case 'queue': return <Layers className="h-6 w-6" />
      case 'storage': return <Cloud className="h-6 w-6" />
      default: return <Server className="h-6 w-6" />
    }
  }

  const getComponentColor = (type: string) => {
    switch (type) {
      case 'frontend': return '#3b82f6'
      case 'backend': return '#10b981'
      case 'database': return '#f59e0b'
      case 'api': return '#8b5cf6'
      case 'cache': return '#ef4444'
      case 'queue': return '#06b6d4'
      case 'storage': return '#84cc16'
      default: return '#6b7280'
    }
  }

  const getDataFlowColor = (type: string) => {
    switch (type) {
      case 'request': return '#3b82f6'
      case 'response': return '#10b981'
      case 'data': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const startAnimation = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 3000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
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
                <Layers className="h-6 w-6 text-purple-600" />
                <h1 className="text-2xl font-bold">Architecture Visualization</h1>
              </div>
              <Badge variant="secondary">System Design Learning</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={startAnimation}>
                <Play className="h-4 w-4 mr-2" />
                Animate
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowDataFlow(!showDataFlow)}>
                <Eye className="h-4 w-4 mr-2" />
                {showDataFlow ? 'Hide' : 'Show'} Flow
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - System Selection */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-5 w-5" />
                  Architecture Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {architectureSystems.map((system) => (
                    <button
                      key={system.id}
                      onClick={() => setSelectedSystem(system)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedSystem.id === system.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{system.name}</h4>
                        <Badge className={getDifficultyColor(system.difficulty)}>
                          {system.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {system.description}
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
                  {selectedSystem.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Component Details */}
            {selectedComponent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getComponentIcon(selectedComponent.type)}
                    {selectedComponent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{selectedComponent.description}</p>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedComponent.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedComponent.metrics && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Metrics:</h4>
                      <div className="space-y-1 text-xs">
                        {selectedComponent.metrics.requests && (
                          <div className="flex justify-between">
                            <span>Requests/sec:</span>
                            <span>{selectedComponent.metrics.requests}</span>
                          </div>
                        )}
                        {selectedComponent.metrics.responseTime && (
                          <div className="flex justify-between">
                            <span>Response Time:</span>
                            <span>{selectedComponent.metrics.responseTime}ms</span>
                          </div>
                        )}
                        {selectedComponent.metrics.uptime && (
                          <div className="flex justify-between">
                            <span>Uptime:</span>
                            <span>{selectedComponent.metrics.uptime}%</span>
                          </div>
                        )}
                        {selectedComponent.metrics.errorRate && (
                          <div className="flex justify-between">
                            <span>Error Rate:</span>
                            <span>{selectedComponent.metrics.errorRate}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Architecture Visualization */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  {selectedSystem.name}
                </CardTitle>
                <CardDescription>
                  Interactive system architecture visualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-slate-50 dark:bg-slate-900 rounded-lg p-8 min-h-[500px] overflow-hidden">
                  {/* SVG Canvas */}
                  <svg className="w-full h-full" viewBox="0 0 1000 400">
                    {/* Data Flow Lines */}
                    {showDataFlow && selectedSystem.dataFlow.map((flow, index) => {
                      const fromComponent = selectedSystem.components.find(c => c.id === flow.from)
                      const toComponent = selectedSystem.components.find(c => c.id === flow.to)
                      
                      if (!fromComponent || !toComponent) return null
                      
                      return (
                        <g key={index}>
                          <line
                            x1={fromComponent.position.x + 60}
                            y1={fromComponent.position.y + 30}
                            x2={toComponent.position.x + 60}
                            y2={toComponent.position.y + 30}
                            stroke={getDataFlowColor(flow.type)}
                            strokeWidth="2"
                            strokeDasharray={isAnimating ? "5,5" : "0"}
                            className={isAnimating ? "animate-pulse" : ""}
                            opacity="0.6"
                          />
                          {isAnimating && (
                            <circle r="4" fill={getDataFlowColor(flow.type)}>
                              <animateMotion
                                dur="2s"
                                repeatCount="indefinite"
                                path={`M${fromComponent.position.x + 60},${fromComponent.position.y + 30} L${toComponent.position.x + 60},${toComponent.position.y + 30}`}
                              />
                            </circle>
                          )}
                        </g>
                      )
                    })}
                    
                    {/* Components */}
                    {selectedSystem.components.map((component) => (
                      <g key={component.id}>
                        <rect
                          x={component.position.x}
                          y={component.position.y}
                          width="120"
                          height="60"
                          rx="8"
                          fill={getComponentColor(component.type)}
                          stroke="white"
                          strokeWidth="2"
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedComponent(component)}
                        />
                        <text
                          x={component.position.x + 60}
                          y={component.position.y + 25}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                          className="pointer-events-none"
                        >
                          {component.name}
                        </text>
                        <text
                          x={component.position.x + 60}
                          y={component.position.y + 40}
                          textAnchor="middle"
                          fill="white"
                          fontSize="10"
                          className="pointer-events-none"
                        >
                          {component.technologies[0]}
                        </text>
                      </g>
                    ))}
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-800 p-3 rounded-lg border">
                    <h4 className="font-medium text-sm mb-2">Component Types:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                        <span>Frontend</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
                        <span>Backend</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                        <span>Database</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: '#8b5cf6' }}></div>
                        <span>API</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Data Flow Legend */}
                  {showDataFlow && (
                    <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-lg border">
                      <h4 className="font-medium text-sm mb-2">Data Flow:</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                          <span>Request</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 rounded" style={{ backgroundColor: '#10b981' }}></div>
                          <span>Response</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
                          <span>Data</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Controls */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Click on components to see details
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}