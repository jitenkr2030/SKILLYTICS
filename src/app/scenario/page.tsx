'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Bug, 
  Plus, 
  Zap, 
  Shield, 
  Rocket, 
  Clock,
  Users,
  Filter,
  Search,
  ArrowLeft
} from 'lucide-react'

interface Scenario {
  id: string
  title: string
  type: 'bug' | 'feature' | 'performance' | 'security' | 'deployment'
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  company: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

const scenarios: Scenario[] = [
  {
    id: 'bug-fix-1',
    title: 'Critical Login Bug',
    type: 'bug',
    description: 'Users report they cannot log in after recent deployment',
    difficulty: 'intermediate',
    estimatedTime: 30,
    company: 'TechCorp Inc.',
    priority: 'critical'
  },
  {
    id: 'feature-add-1',
    title: 'Add Real-time Notifications',
    type: 'feature',
    description: 'Product team wants real-time notifications for user interactions',
    difficulty: 'advanced',
    estimatedTime: 45,
    company: 'SocialApp Ltd.',
    priority: 'high'
  },
  {
    id: 'security-fix-1',
    title: 'Fix XSS Vulnerability',
    type: 'security',
    description: 'Security audit discovered XSS vulnerability in comment system',
    difficulty: 'intermediate',
    estimatedTime: 35,
    company: 'BlogPlatform Co.',
    priority: 'critical'
  },
  {
    id: 'performance-1',
    title: 'Optimize Database Queries',
    type: 'performance',
    description: 'Application is slow due to inefficient database queries',
    difficulty: 'advanced',
    estimatedTime: 40,
    company: 'DataTech Inc.',
    priority: 'high'
  },
  {
    id: 'deployment-1',
    title: 'Fix CI/CD Pipeline',
    type: 'deployment',
    description: 'Deployment pipeline is failing on integration tests',
    difficulty: 'intermediate',
    estimatedTime: 25,
    company: 'DevOps Corp.',
    priority: 'medium'
  }
]

export default function ScenarioList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug className="h-5 w-5 text-red-500" />
      case 'feature': return <Plus className="h-5 w-5 text-green-500" />
      case 'performance': return <Zap className="h-5 w-5 text-yellow-500" />
      case 'security': return <Shield className="h-5 w-5 text-purple-500" />
      case 'deployment': return <Rocket className="h-5 w-5 text-blue-500" />
      default: return <Bug className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || scenario.type === selectedType
    const matchesDifficulty = selectedDifficulty === 'all' || scenario.difficulty === selectedDifficulty
    
    return matchesSearch && matchesType && matchesDifficulty
  })

  const scenarioTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'bug', label: 'Bug Fixes' },
    { value: 'feature', label: 'Features' },
    { value: 'performance', label: 'Performance' },
    { value: 'security', label: 'Security' },
    { value: 'deployment', label: 'Deployment' }
  ]

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ]

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
                <Users className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Real-World Scenarios</h1>
              </div>
              <Badge variant="secondary">Practice real developer problems</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scenarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                {scenarioTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario) => (
            <Card key={scenario.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getScenarioIcon(scenario.type)}
                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(scenario.difficulty)}>
                    {scenario.difficulty}
                  </Badge>
                </div>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>{scenario.estimatedTime} min</span>
                    </div>
                    <Badge className={getPriorityColor(scenario.priority)} variant="outline">
                      {scenario.priority}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Company: {scenario.company}</p>
                  </div>
                  
                  <Link href={`/scenario/${scenario.id}`}>
                    <Button className="w-full">
                      Start Scenario
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredScenarios.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No scenarios found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </main>
    </div>
  )
}