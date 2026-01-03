'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { 
  FolderOpen, 
  Star, 
  Clock, 
  Target,
  Filter,
  Search,
  ArrowLeft,
  Lock,
  Unlock,
  Rocket
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  moduleName: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedHours: number
  totalMissions: number
  completedMissions: number
  totalPoints: number
  prerequisites: string[]
  isUnlocked: boolean
}

const projects: Project[] = [
  {
    id: 'todo-app',
    title: 'Interactive Todo App',
    description: 'Build a fully functional todo application with CRUD operations and local storage',
    moduleName: 'JavaScript Essentials',
    difficulty: 'intermediate',
    estimatedHours: 2,
    totalMissions: 5,
    completedMissions: 0,
    totalPoints: 100,
    prerequisites: ['HTML Basics', 'CSS Fundamentals'],
    isUnlocked: true
  },
  {
    id: 'weather-app',
    title: 'Weather Dashboard',
    description: 'Create a beautiful weather dashboard with real-time API data',
    moduleName: 'React Components',
    difficulty: 'advanced',
    estimatedHours: 2.5,
    totalMissions: 4,
    completedMissions: 0,
    totalPoints: 110,
    prerequisites: ['React Components', 'API Integration'],
    isUnlocked: false
  },
  {
    id: 'blog-platform',
    title: 'Blog Platform',
    description: 'Build a complete blog platform with markdown support and comments',
    moduleName: 'Backend Development',
    difficulty: 'advanced',
    estimatedHours: 4,
    totalMissions: 6,
    completedMissions: 0,
    totalPoints: 150,
    prerequisites: ['Node.js', 'Database Design'],
    isUnlocked: false
  },
  {
    id: 'portfolio-site',
    title: 'Portfolio Website',
    description: 'Create a stunning personal portfolio with animations and responsive design',
    moduleName: 'CSS Styling',
    difficulty: 'beginner',
    estimatedHours: 1.5,
    totalMissions: 4,
    completedMissions: 0,
    totalPoints: 80,
    prerequisites: ['HTML Basics'],
    isUnlocked: true
  },
  {
    id: 'task-manager',
    title: 'Task Manager API',
    description: 'Build a RESTful API for task management with authentication',
    moduleName: 'API Development',
    difficulty: 'intermediate',
    estimatedHours: 3,
    totalMissions: 5,
    completedMissions: 0,
    totalPoints: 120,
    prerequisites: ['Backend Development', 'Authentication'],
    isUnlocked: false
  },
  {
    id: 'ecommerce-store',
    title: 'E-commerce Store',
    description: 'Build a full-stack e-commerce platform with payment integration',
    moduleName: 'Full-Stack Project',
    difficulty: 'advanced',
    estimatedHours: 8,
    totalMissions: 10,
    completedMissions: 0,
    totalPoints: 200,
    prerequisites: ['Frontend', 'Backend', 'Database'],
    isUnlocked: false
  }
]

export default function ProjectList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedModule, setSelectedModule] = useState<string>('all')

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProjectProgress = (project: Project) => {
    return (project.completedMissions / project.totalMissions) * 100
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty
    const matchesModule = selectedModule === 'all' || project.moduleName === selectedModule
    
    return matchesSearch && matchesDifficulty && matchesModule
  })

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ]

  const modules = [
    { value: 'all', label: 'All Modules' },
    { value: 'JavaScript Essentials', label: 'JavaScript Essentials' },
    { value: 'React Components', label: 'React Components' },
    { value: 'Backend Development', label: 'Backend Development' },
    { value: 'CSS Styling', label: 'CSS Styling' },
    { value: 'API Development', label: 'API Development' },
    { value: 'Full-Stack Project', label: 'Full-Stack Project' }
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
                <FolderOpen className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Mini-Projects</h1>
              </div>
              <Badge variant="secondary">Build complete applications</Badge>
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
              Filter Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
              
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                {modules.map(module => (
                  <option key={module.value} value={module.value}>{module.label}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className={`hover:shadow-lg transition-shadow ${
              !project.isUnlocked ? 'opacity-75' : ''
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {project.isUnlocked ? (
                      <Unlock className="h-5 w-5 text-green-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" />
                    )}
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(project.difficulty)}>
                    {project.difficulty}
                  </Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(getProjectProgress(project))}%</span>
                    </div>
                    <Progress value={getProjectProgress(project)} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {project.completedMissions} of {project.totalMissions} missions
                    </p>
                  </div>
                  
                  {/* Project Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>{project.estimatedHours}h</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{project.totalPoints} pts</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>Module: {project.moduleName}</p>
                    <p>Missions: {project.totalMissions}</p>
                  </div>
                  
                  {/* Prerequisites */}
                  {project.prerequisites.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-1">Prerequisites:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <Link href={`/project/${project.id}`}>
                    <Button 
                      className="w-full" 
                      disabled={!project.isUnlocked}
                      variant={project.isUnlocked ? "default" : "secondary"}
                    >
                      {project.isUnlocked ? (
                        <>
                          <Rocket className="h-4 w-4 mr-2" />
                          Start Project
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Locked
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </main>
    </div>
  )
}