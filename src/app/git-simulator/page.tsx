'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  GitBranch, 
  GitCommit, 
  GitMerge, 
  GitPullRequest,
  Plus,
  Code,
  ArrowLeft,
  ArrowRight,
  GitFork,
  History,
  CheckCircle,
  AlertTriangle,
  Users,
  FileText,
  Terminal,
  BookOpen,
  Target
} from 'lucide-react'

interface Commit {
  id: string
  message: string
  author: string
  timestamp: Date
  branch: string
  changes: number
}

interface Branch {
  name: string
  commits: string[]
  color: string
  isMain: boolean
}

interface GitLesson {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  objectives: string[]
  scenario: string
  initialRepo: {
    branches: Branch[]
    commits: Commit[]
    workingDirectory: string[]
    stagingArea: string[]
  }
  tasks: {
    id: string
    description: string
    expectedAction: string
    hint: string
  }[]
}

const gitLessons: GitLesson[] = [
  {
    id: 'git-basics',
    title: 'Git Basics - Making Your First Commit',
    description: 'Learn the fundamental Git workflow: add, commit, and push',
    difficulty: 'beginner',
    objectives: [
      'Understand the Git working directory',
      'Learn to stage files with git add',
      'Create commits with git commit',
      'View commit history'
    ],
    scenario: 'You have a new project with some untracked files. Your task is to make your first commit and push it to the repository.',
    initialRepo: {
      branches: [
        { name: 'main', commits: [], color: '#10b981', isMain: true }
      ],
      commits: [],
      workingDirectory: ['index.html', 'style.css', 'script.js'],
      stagingArea: [],
    },
    tasks: [
      {
        id: 'stage-files',
        description: 'Add all files to the staging area',
        expectedAction: 'git add .',
        hint: 'Use "git add ." to stage all files in the current directory'
      },
      {
        id: 'make-commit',
        description: 'Create your first commit',
        expectedAction: 'git commit -m "Initial commit"',
        hint: 'Use git commit with a descriptive message'
      }
    ]
  },
  {
    id: 'branch-merge',
    title: 'Branching and Merging',
    description: 'Learn how to create branches and merge changes',
    difficulty: 'intermediate',
    objectives: [
      'Create a new branch',
      'Make changes on a feature branch',
      'Merge branches back to main',
      'Resolve merge conflicts'
    ],
    scenario: 'You need to add a new feature to your project. Create a feature branch, implement the feature, and merge it back to main.',
    initialRepo: {
      branches: [
        { name: 'main', commits: ['commit1'], color: '#10b981', isMain: true }
      ],
      commits: [
        {
          id: 'commit1',
          message: 'Initial project setup',
          author: 'You',
          timestamp: new Date(Date.now() - 3600000),
          branch: 'main',
          changes: 3
        }
      ],
      workingDirectory: ['index.html', 'style.css', 'script.js'],
      stagingArea: [],
    },
    tasks: [
      {
        id: 'create-branch',
        description: 'Create a new feature branch',
        expectedAction: 'git checkout -b feature/new-button',
        hint: 'Use git checkout -b to create and switch to a new branch'
      },
      {
        id: 'make-feature-changes',
        description: 'Add the new feature file and commit it',
        expectedAction: 'git add feature.js && git commit -m "Add new button feature"',
        hint: 'First add the new file, then commit with a descriptive message'
      },
      {
        id: 'switch-back',
        description: 'Switch back to main branch',
        expectedAction: 'git checkout main',
        hint: 'Use git checkout to switch between branches'
      },
      {
        id: 'merge-branch',
        description: 'Merge the feature branch into main',
        expectedAction: 'git merge feature/new-button',
        hint: 'Use git merge to bring changes from another branch'
      }
    ]
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Learn to work with remote repositories and pull requests',
    difficulty: 'advanced',
    objectives: [
      'Clone a remote repository',
      'Push changes to remote',
      'Pull changes from others',
      'Create and review pull requests'
    ],
    scenario: 'You are working on a team project. Pull the latest changes, make your contribution, and create a pull request.',
    initialRepo: {
      branches: [
        { name: 'main', commits: ['commit1', 'commit2'], color: '#10b981', isMain: true },
        { name: 'origin/main', commits: ['commit1', 'commit2', 'commit3'], color: '#3b82f6', isMain: false }
      ],
      commits: [
        {
          id: 'commit1',
          message: 'Initial project setup',
          author: 'Alice',
          timestamp: new Date(Date.now() - 7200000),
          branch: 'main',
          changes: 3
        },
        {
          id: 'commit2',
          message: 'Add basic styling',
          author: 'Bob',
          timestamp: new Date(Date.now() - 3600000),
          branch: 'main',
          changes: 2
        },
        {
          id: 'commit3',
          message: 'Fix responsive issues',
          author: 'Alice',
          timestamp: new Date(Date.now() - 1800000),
          branch: 'origin/main',
          changes: 4
        }
      ],
      workingDirectory: ['index.html', 'style.css', 'script.js'],
      stagingArea: [],
    },
    tasks: [
      {
        id: 'pull-changes',
        description: 'Pull the latest changes from remote',
        expectedAction: 'git pull origin main',
        hint: 'Use git pull to fetch and merge changes from the remote repository'
      },
      {
        id: 'create-feature-branch',
        description: 'Create a branch for your feature',
        expectedAction: 'git checkout -b improve-performance',
        hint: 'Always create a branch for new features'
      },
      {
        id: 'implement-feature',
        description: 'Make your changes and commit them',
        expectedAction: 'git add . && git commit -m "Improve app performance"',
        hint: 'Stage all changes and commit with a clear message'
      },
      {
        id: 'push-branch',
        description: 'Push your feature branch to remote',
        expectedAction: 'git push origin improve-performance',
        hint: 'Push your branch so others can review it'
      }
    ]
  }
]

export default function GitSimulator() {
  const [selectedLesson, setSelectedLesson] = useState<GitLesson | null>(null)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [commandInput, setCommandInput] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [workingDirectory, setWorkingDirectory] = useState<string[]>([])
  const [stagingArea, setStagingArea] = useState<string[]>([])
  const [currentBranch, setCurrentBranch] = useState('main')
  const [branches, setBranches] = useState<Branch[]>([])
  const [commits, setCommits] = useState<Commit[]>([])
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (gitLessons.length > 0 && !selectedLesson) {
      setSelectedLesson(gitLessons[0])
      resetRepository(gitLessons[0])
    }
  }, [])

  const resetRepository = (lesson: GitLesson) => {
    setWorkingDirectory([...lesson.initialRepo.workingDirectory])
    setStagingArea([...lesson.initialRepo.stagingArea])
    setBranches([...lesson.initialRepo.branches])
    setCommits([...lesson.initialRepo.commits])
    setCurrentBranch('main')
    setCurrentTaskIndex(0)
    setCompletedTasks(new Set())
    setCommandHistory([])
    setTerminalOutput(['$ Git Repository Initialized', '$ Ready to learn Git!'])
  }

  const executeCommand = (command: string) => {
    const cmd = command.trim().toLowerCase()
    const parts = command.trim().split(' ')
    const output: string[] = []

    // Git command simulation
    if (cmd.startsWith('git add')) {
      if (cmd.includes('.')) {
        // Add all files
        setStagingArea([...workingDirectory])
        output.push(`Staged all files:`)
        workingDirectory.forEach(file => {
          output.push(`  ${file}`)
        })
      } else {
        // Add specific file
        const filename = parts[2]
        if (workingDirectory.includes(filename)) {
          setStagingArea([...stagingArea, filename])
          setWorkingDirectory(workingDirectory.filter(f => f !== filename))
          output.push(`Staged: ${filename}`)
        } else {
          output.push(`Error: File '${filename}' not found`)
        }
      }
    } else if (cmd.startsWith('git commit')) {
      if (stagingArea.length === 0) {
        output.push('Error: No changes staged for commit')
      } else {
        const messageMatch = command.match(/-m ["']([^"']+)["']/)
        const message = messageMatch ? messageMatch[1] : 'Untitled commit'
        
        const newCommit: Commit = {
          id: `commit${Date.now()}`,
          message,
          author: 'You',
          timestamp: new Date(),
          branch: currentBranch,
          changes: stagingArea.length
        }
        
        setCommits([...commits, newCommit])
        setStagingArea([])
        output.push(`[${currentBranch} ${newCommit.id.slice(0, 7)}] ${message}`)
        output.push(` ${stagingArea.length} file(s) changed, ${stagingArea.length} insertion(+)`)
      }
    } else if (cmd.startsWith('git status')) {
      output.push('On branch ' + currentBranch)
      output.push('')
      
      if (workingDirectory.length > 0) {
        output.push('Changes not staged for commit:')
        output.push('  (use "git add <file>..." to update what will be committed)')
        output.push('')
        workingDirectory.forEach(file => {
          output.push(`\tmodified:   ${file}`)
        })
      }
      
      if (stagingArea.length > 0) {
        output.push('Changes to be committed:')
        output.push('  (use "git rm --cached <file>..." to unstage)')
        output.push('')
        stagingArea.forEach(file => {
          output.push(`\tnew file:   ${file}`)
        })
      }
      
      if (workingDirectory.length === 0 && stagingArea.length === 0) {
        output.push('nothing to commit, working tree clean')
      }
    } else if (cmd.startsWith('git log')) {
      output.push('Commit history:')
      commits.slice().reverse().forEach(commit => {
        output.push(`commit ${commit.id}`)
        output.push(`Author: ${commit.author}`)
        output.push(`Date: ${commit.timestamp.toLocaleString()}`)
        output.push('')
        output.push(`    ${commit.message}`)
        output.push('')
      })
    } else if (cmd.startsWith('git checkout')) {
      if (cmd.includes('-b')) {
        // Create new branch
        const branchName = parts[3]
        const newBranch: Branch = {
          name: branchName,
          commits: commits.map(c => c.id),
          color: '#f59e0b',
          isMain: false
        }
        setBranches([...branches, newBranch])
        setCurrentBranch(branchName)
        output.push(`Switched to a new branch '${branchName}'`)
      } else {
        // Switch to existing branch
        const branchName = parts[2]
        const branch = branches.find(b => b.name === branchName)
        if (branch) {
          setCurrentBranch(branchName)
          output.push(`Switched to branch '${branchName}'`)
        } else {
          output.push(`Error: Branch '${branchName}' not found`)
        }
      }
    } else if (cmd.startsWith('git merge')) {
      const branchName = parts[2]
      const sourceBranch = branches.find(b => b.name === branchName)
      if (sourceBranch) {
        output.push(`Merge branch '${branchName}' into ${currentBranch}`)
        output.push('Auto-merging completed')
        // Simulate merge by adding commits
        const mergeCommit: Commit = {
          id: `merge${Date.now()}`,
          message: `Merge branch '${branchName}' into ${currentBranch}`,
          author: 'You',
          timestamp: new Date(),
          branch: currentBranch,
          changes: 2
        }
        setCommits([...commits, mergeCommit])
      } else {
        output.push(`Error: Branch '${branchName}' not found`)
      }
    } else if (cmd.startsWith('git pull')) {
      output.push('Fetching from origin...')
      output.push('Fast-forward merge completed')
      output.push('Your branch is up to date with remote')
    } else if (cmd.startsWith('git push')) {
      const branchName = parts[2] || currentBranch
      output.push(`Enumerating objects: 5, done.`)
      output.push(`Counting objects: 100% (5/5), done.`)
      output.push(`Writing objects: 100% (3/3), 1.2 KiB | 1.2 MiB/s, done.`)
      output.push(`Total 3 (delta 0), reused 0 (delta 0), pack-reused 0`)
      output.push(`To https://github.com/user/repo.git`)
      output.push(`   ${currentBranch} -> ${branchName}`)
    } else if (cmd === 'clear') {
      setTerminalOutput([])
      return
    } else if (cmd === 'help') {
      output.push('Available Git commands:')
      output.push('  git add <file>     - Stage files for commit')
      output.push('  git commit -m "msg" - Create a commit')
      output.push('  git status        - Show working directory status')
      output.push('  git log           - Show commit history')
      output.push('  git checkout <branch> - Switch branches')
      output.push('  git checkout -b <branch> - Create new branch')
      output.push('  git merge <branch> - Merge branches')
      output.push('  git pull          - Pull from remote')
      output.push('  git push          - Push to remote')
      output.push('  clear             - Clear terminal')
    } else {
      output.push(`Error: Unknown command '${command}'`)
      output.push("Type 'help' for available commands")
    }

    setTerminalOutput([...terminalOutput, `$ ${command}`, ...output])
    setCommandHistory([...commandHistory, command])
    
    // Check if task is completed
    if (selectedLesson && currentTaskIndex < selectedLesson.tasks.length) {
      const currentTask = selectedLesson.tasks[currentTaskIndex]
      const expectedAction = currentTask.expectedAction.toLowerCase()
      
      if (cmd.toLowerCase().includes(expectedAction.split(' ')[0])) {
        setCompletedTasks(new Set([...completedTasks, currentTask.id]))
        if (currentTaskIndex < selectedLesson.tasks.length - 1) {
          setCurrentTaskIndex(currentTaskIndex + 1)
        }
      }
    }
  }

  const handleSubmitCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (commandInput.trim()) {
      executeCommand(commandInput)
      setCommandInput('')
    }
  }

  const getLessonProgress = () => {
    if (!selectedLesson) return 0
    return (completedTasks.size / selectedLesson.tasks.length) * 100
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
                <GitBranch className="h-6 w-6 text-orange-600" />
                <h1 className="text-2xl font-bold">Git Simulator</h1>
              </div>
              <Badge variant="secondary">Learn Git visually</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Lesson Info & Tasks */}
          <div className="lg:col-span-1 space-y-4">
            {/* Lesson Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Git Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gitLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setSelectedLesson(lesson)
                        resetRepository(lesson)
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedLesson?.id === lesson.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{lesson.title}</h4>
                        <Badge className={getDifficultyColor(lesson.difficulty)}>
                          {lesson.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {lesson.description}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Task */}
            {selectedLesson && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Current Task
                  </CardTitle>
                  <CardDescription>
                    Task {currentTaskIndex + 1} of {selectedLesson.tasks.length}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{Math.round(getLessonProgress())}%</span>
                      </div>
                      <Progress value={getLessonProgress()} className="h-2" />
                    </div>
                    
                    {currentTaskIndex < selectedLesson.tasks.length && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">
                          {selectedLesson.tasks[currentTaskIndex].description}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          💡 {selectedLesson.tasks[currentTaskIndex].hint}
                        </p>
                      </div>
                    )}
                    
                    {getLessonProgress() === 100 && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          🎉 Congratulations! You've completed this lesson!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Repository Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitFork className="h-5 w-5" />
                  Repository Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Current Branch:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: branches.find(b => b.name === currentBranch)?.color || '#10b981' }}
                      ></div>
                      <span>{currentBranch}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Working Directory:</span>
                    <div className="mt-1">
                      {workingDirectory.length > 0 ? (
                        workingDirectory.map(file => (
                          <div key={file} className="text-red-600">• {file}</div>
                        ))
                      ) : (
                        <div className="text-green-600">• Clean</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Staging Area:</span>
                    <div className="mt-1">
                      {stagingArea.length > 0 ? (
                        stagingArea.map(file => (
                          <div key={file} className="text-yellow-600">• {file}</div>
                        ))
                      ) : (
                        <div className="text-gray-500">• Empty</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Total Commits:</span>
                    <div className="mt-1">
                      <span>{commits.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Terminal */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Git Terminal
                </CardTitle>
                <CardDescription>
                  Practice Git commands in a safe environment
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                {/* Terminal Output */}
                <div className="flex-1 bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-y-auto min-h-[400px] mb-4">
                  {terminalOutput.map((line, index) => (
                    <div key={index} className={line.startsWith('$') ? 'text-white' : ''}>
                      {line}
                    </div>
                  ))}
                </div>
                
                {/* Command Input */}
                <form onSubmit={handleSubmitCommand} className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400">$</span>
                    <input
                      type="text"
                      value={commandInput}
                      onChange={(e) => setCommandInput(e.target.value)}
                      placeholder="Enter Git command..."
                      className="w-full pl-8 pr-3 py-2 bg-black text-green-400 border border-green-900 rounded font-mono text-sm focus:outline-none focus:border-green-400"
                    />
                  </div>
                  <Button type="submit" variant="outline">
                    Execute
                  </Button>
                </form>
                
                {/* Command History */}
                {commandHistory.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Command History:</h4>
                    <div className="flex flex-wrap gap-2">
                      {commandHistory.slice(-5).map((cmd, index) => (
                        <button
                          key={index}
                          onClick={() => setCommandInput(cmd)}
                          className="px-2 py-1 bg-muted text-xs rounded hover:bg-muted/80"
                        >
                          {cmd}
                        </button>
                      ))}
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