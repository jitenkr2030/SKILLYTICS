'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FolderOpen, 
  CheckCircle, 
  Circle, 
  Lock, 
  Unlock,
  Rocket,
  Code,
  Eye,
  ArrowLeft,
  Play,
  Star,
  Clock,
  Target
} from 'lucide-react'

interface Mission {
  id: string
  title: string
  description: string
  completed: boolean
  points: number
  estimatedTime: number
  order: number
}

interface MiniProject {
  id: string
  title: string
  description: string
  moduleId: string
  moduleName: string
  missions: Mission[]
  finalCode: string
  previewUrl?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedHours: number
  totalPoints: number
  prerequisites: string[]
  learningObjectives: string[]
}

const miniProjects: MiniProject[] = [
  {
    id: 'todo-app',
    title: 'Interactive Todo App',
    description: 'Build a fully functional todo application with CRUD operations, local storage, and modern UI',
    moduleId: '3',
    moduleName: 'JavaScript Essentials',
    missions: [
      {
        id: 'todo-1',
        title: 'Create HTML Structure',
        description: 'Set up the basic HTML structure for the todo app',
        completed: false,
        points: 10,
        estimatedTime: 15,
        order: 1
      },
      {
        id: 'todo-2',
        title: 'Style with CSS',
        description: 'Add modern styling and responsive design',
        completed: false,
        points: 15,
        estimatedTime: 20,
        order: 2
      },
      {
        id: 'todo-3',
        title: 'Implement Add Todo',
        description: 'Add functionality to create new todos',
        completed: false,
        points: 20,
        estimatedTime: 25,
        order: 3
      },
      {
        id: 'todo-4',
        title: 'Add Delete & Toggle',
        description: 'Implement delete and complete functionality',
        completed: false,
        points: 25,
        estimatedTime: 30,
        order: 4
      },
      {
        id: 'todo-5',
        title: 'Local Storage',
        description: 'Persist todos using browser local storage',
        completed: false,
        points: 30,
        estimatedTime: 35,
        order: 5
      }
    ],
    finalCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 1.1em;
        }
        
        .todo-form {
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        
        .input-group {
            display: flex;
            gap: 10px;
        }
        
        .todo-input {
            flex: 1;
            padding: 15px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        .todo-input:focus {
            outline: none;
            border-color: #4facfe;
        }
        
        .add-btn {
            padding: 15px 25px;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: transform 0.2s;
        }
        
        .add-btn:hover {
            transform: translateY(-2px);
        }
        
        .todo-list {
            padding: 20px;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .todo-item {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
            transition: all 0.3s;
        }
        
        .todo-item:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        
        .todo-item.completed {
            opacity: 0.7;
            background: #f8f9fa;
        }
        
        .todo-item.completed .todo-text {
            text-decoration: line-through;
            color: #6c757d;
        }
        
        .todo-checkbox {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        
        .todo-text {
            flex: 1;
            font-size: 16px;
            color: #333;
        }
        
        .delete-btn {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.3s;
        }
        
        .delete-btn:hover {
            background: #c82333;
        }
        
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #6c757d;
        }
        
        .empty-state svg {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
            opacity: 0.5;
        }
        
        .stats {
            padding: 20px 30px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #4facfe;
        }
        
        .stat-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 My Todo List</h1>
            <p>Stay organized and productive</p>
        </div>
        
        <div class="todo-form">
            <div class="input-group">
                <input 
                    type="text" 
                    class="todo-input" 
                    id="todoInput" 
                    placeholder="What needs to be done?"
                    maxlength="100"
                >
                <button class="add-btn" onclick="addTodo()">Add Todo</button>
            </div>
        </div>
        
        <div class="todo-list" id="todoList">
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                </svg>
                <h3>No todos yet!</h3>
                <p>Add your first todo to get started</p>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-item">
                <div class="stat-number" id="totalTodos">0</div>
                <div class="stat-label">Total</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="completedTodos">0</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="remainingTodos">0</div>
                <div class="stat-label">Remaining</div>
            </div>
        </div>
    </div>

    <script>
        // Todo App JavaScript
        let todos = [];
        let todoIdCounter = 1;

        // Load todos from localStorage on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadTodos();
            renderTodos();
            updateStats();
        });

        // Add new todo
        function addTodo() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();
            
            if (text === '') {
                alert('Please enter a todo item!');
                return;
            }
            
            const todo = {
                id: todoIdCounter++,
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            todos.unshift(todo);
            input.value = '';
            
            saveTodos();
            renderTodos();
            updateStats();
        }

        // Toggle todo completion
        function toggleTodo(id) {
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                saveTodos();
                renderTodos();
                updateStats();
            }
        }

        // Delete todo
        function deleteTodo(id) {
            if (confirm('Are you sure you want to delete this todo?')) {
                todos = todos.filter(t => t.id !== id);
                saveTodos();
                renderTodos();
                updateStats();
            }
        }

        // Render todos
        function renderTodos() {
            const todoList = document.getElementById('todoList');
            
            if (todos.length === 0) {
                todoList.innerHTML = \`
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 11l3 3L22 4"></path>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        <h3>No todos yet!</h3>
                        <p>Add your first todo to get started</p>
                    </div>
                \`;
                return;
            }
            
            todoList.innerHTML = todos.map(todo => \`
                <div class="todo-item \${todo.completed ? 'completed' : ''}">
                    <input 
                        type="checkbox" 
                        class="todo-checkbox" 
                        \${todo.completed ? 'checked' : ''}
                        onchange="toggleTodo(\${todo.id})"
                    >
                    <span class="todo-text">\${escapeHtml(todo.text)}</span>
                    <button class="delete-btn" onclick="deleteTodo(\${todo.id})">Delete</button>
                </div>
            \`).join('');
        }

        // Update statistics
        function updateStats() {
            const total = todos.length;
            const completed = todos.filter(t => t.completed).length;
            const remaining = total - completed;
            
            document.getElementById('totalTodos').textContent = total;
            document.getElementById('completedTodos').textContent = completed;
            document.getElementById('remainingTodos').textContent = remaining;
        }

        // Save todos to localStorage
        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }

        // Load todos from localStorage
        function loadTodos() {
            const saved = localStorage.getItem('todos');
            if (saved) {
                todos = JSON.parse(saved);
                // Update ID counter to avoid conflicts
                if (todos.length > 0) {
                    todoIdCounter = Math.max(...todos.map(t => t.id)) + 1;
                }
            }
        }

        // Escape HTML to prevent XSS
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Handle Enter key in input
        document.getElementById('todoInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
    </script>
</body>
</html>`,
    difficulty: 'intermediate',
    estimatedHours: 2,
    totalPoints: 100,
    prerequisites: ['HTML Basics', 'CSS Fundamentals', 'JavaScript DOM'],
    learningObjectives: [
      'Master DOM manipulation',
      'Implement event handling',
      'Use localStorage for data persistence',
      'Create responsive modern UI',
      'Build complete CRUD application'
    ]
  },
  {
    id: 'weather-app',
    title: 'Weather Dashboard',
    description: 'Create a beautiful weather dashboard that fetches real-time weather data from APIs',
    moduleId: '4',
    moduleName: 'React Components',
    missions: [
      {
        id: 'weather-1',
        title: 'Setup API Integration',
        description: 'Integrate with a weather API service',
        completed: false,
        points: 20,
        estimatedTime: 25,
        order: 1
      },
      {
        id: 'weather-2',
        title: 'Build Weather Card',
        description: 'Create reusable weather card component',
        completed: false,
        points: 25,
        estimatedTime: 30,
        order: 2
      },
      {
        id: 'weather-3',
        title: 'Add Location Search',
        description: 'Implement city search functionality',
        completed: false,
        points: 30,
        estimatedTime: 35,
        order: 3
      },
      {
        id: 'weather-4',
        title: 'Create Forecast View',
        description: 'Display 5-day weather forecast',
        completed: false,
        points: 35,
        estimatedTime: 40,
        order: 4
      }
    ],
    finalCode: '',
    difficulty: 'advanced',
    estimatedHours: 2.5,
    totalPoints: 110,
    prerequisites: ['React Components', 'API Integration', 'Async JavaScript'],
    learningObjectives: [
      'Work with external APIs',
      'Handle async operations',
      'Create reusable components',
      'Implement error handling',
      'Build responsive dashboards'
    ]
  }
]

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedProject, setSelectedProject] = useState<MiniProject | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set())

  useEffect(() => {
    const project = miniProjects.find(p => p.id === params.id)
    if (project) {
      setSelectedProject(project)
    }
  }, [params.id])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProjectProgress = () => {
    if (!selectedProject) return 0
    const completed = selectedProject.missions.filter(m => completedMissions.has(m.id)).length
    return (completed / selectedProject.missions.length) * 100
  }

  const toggleMissionComplete = (missionId: string) => {
    setCompletedMissions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(missionId)) {
        newSet.delete(missionId)
      } else {
        newSet.add(missionId)
      }
      return newSet
    })
  }

  const canStartMission = (mission: Mission) => {
    const missionIndex = selectedProject?.missions.findIndex(m => m.id === mission.id) || 0
    if (missionIndex === 0) return true
    
    const previousMission = selectedProject?.missions[missionIndex - 1]
    return previousMission ? completedMissions.has(previousMission.id) : false
  }

  if (!selectedProject) {
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
                <FolderOpen className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">{selectedProject.title}</h1>
              </div>
              <Badge className={getDifficultyColor(selectedProject.difficulty)}>
                {selectedProject.difficulty}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>{selectedProject.estimatedHours}h</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{selectedProject.totalPoints} pts</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Project Info & Progress */}
          <div className="lg:col-span-1 space-y-4">
            {/* Project Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{selectedProject.description}</p>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Module</h4>
                  <Badge variant="outline">{selectedProject.moduleName}</Badge>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(getProjectProgress())}%</span>
                  </div>
                  <Progress value={getProjectProgress()} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {selectedProject.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {selectedProject.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Missions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Project Missions
                </CardTitle>
                <CardDescription>
                  Complete missions in order to build the full project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedProject.missions.map((mission, index) => {
                    const isCompleted = completedMissions.has(mission.id)
                    const canStart = canStartMission(mission)
                    
                    return (
                      <div
                        key={mission.id}
                        className={`p-4 border rounded-lg transition-all ${
                          isCompleted 
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                            : canStart
                            ? 'bg-white border-gray-200 hover:shadow-md cursor-pointer'
                            : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : canStart ? (
                                <Circle className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{mission.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  Mission {index + 1}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {mission.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3" />
                                  <span>{mission.points} pts</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{mission.estimatedTime} min</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {isCompleted && (
                              <Badge className="bg-green-100 text-green-800">
                                Completed
                              </Badge>
                            )}
                            
                            {canStart && !isCompleted && (
                              <Button size="sm" onClick={() => toggleMissionComplete(mission.id)}>
                                <Play className="h-4 w-4 mr-2" />
                                Start
                              </Button>
                            )}
                            
                            {!canStart && (
                              <Badge variant="outline">
                                Locked
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {/* Final Project Preview */}
                {getProjectProgress() === 100 && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">
                          🎉 Project Complete!
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          You've built the complete {selectedProject.title}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}