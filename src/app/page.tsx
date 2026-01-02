'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Code, Trophy, Target, Zap, Users, Star, Lock, Unlock, LogOut, FolderOpen, GitBranch, Layers, Shield, TestTube, Briefcase, BarChart3, Award } from 'lucide-react'
import MobileInterface from '@/components/mobile-interface'

export default function Home() {
  const { data: session, status } = useSession()
  const [isMobile, setIsMobile] = useState(false)
  const [userProgress, setUserProgress] = useState({
    level: 1,
    xp: 0,
    streak: 7,
    completedMissions: 12,
    totalMissions: 320
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (session?.user) {
      setUserProgress(prev => ({
        ...prev,
        level: session.user.level || prev.level,
        xp: session.user.xp || prev.xp,
        streak: session.user.streak || prev.streak
      }))
    }
  }, [session])

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Code className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold ml-2">Skillytics</h1>
            </div>
            <CardTitle>Welcome to Skillytics</CardTitle>
            <CardDescription>
              Learn programming through interactive missions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">320+ Interactive Missions</h4>
                  <p className="text-sm text-muted-foreground">Learn by doing, not watching</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div>
                  <h4 className="font-medium">AI-Powered Mentor</h4>
                  <p className="text-sm text-muted-foreground">Get personalized help when stuck</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Trophy className="h-5 w-5 text-purple-500" />
                <div>
                  <h4 className="font-medium">Gamified Learning</h4>
                  <p className="text-sm text-muted-foreground">Earn XP, unlock achievements</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button asChild className="w-full">
                <a href="/auth/signin">Sign In to Start Learning</a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/auth/signup">Create Account</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show mobile interface on mobile devices
  if (isMobile) {
    return <MobileInterface />
  }

  const modules = [
    {
      id: 1,
      title: "HTML Fundamentals",
      description: "Master the building blocks of the web",
      icon: "🌐",
      color: "bg-orange-500",
      progress: 85,
      isUnlocked: true,
      lessons: 20,
      estimatedHours: 15
    },
    {
      id: 2,
      title: "CSS Styling",
      description: "Create beautiful, responsive designs",
      icon: "🎨",
      color: "bg-blue-500",
      progress: 60,
      isUnlocked: true,
      lessons: 25,
      estimatedHours: 20
    },
    {
      id: 3,
      title: "JavaScript Essentials",
      description: "Add interactivity and logic to your pages",
      icon: "⚡",
      color: "bg-yellow-500",
      progress: 30,
      isUnlocked: true,
      lessons: 30,
      estimatedHours: 25
    },
    {
      id: 4,
      title: "React Components",
      description: "Build modern, component-based UIs",
      icon: "⚛️",
      color: "bg-cyan-500",
      progress: 0,
      isUnlocked: false,
      lessons: 25,
      estimatedHours: 30
    },
    {
      id: 5,
      title: "Backend Development",
      description: "Create powerful server-side applications",
      icon: "🔧",
      color: "bg-green-500",
      progress: 0,
      isUnlocked: false,
      lessons: 20,
      estimatedHours: 35
    }
  ]

  const currentMission = {
    title: "Fix the Broken Button",
    description: "This button should toggle the visibility of the hidden message when clicked.",
    difficulty: "Beginner",
    points: 10,
    timeLimit: 15,
    module: "JavaScript Essentials"
  }

  const recentAchievements = [
    { title: "First Steps", description: "Complete your first mission", icon: "🎯", earned: true },
    { title: "Week Warrior", description: "7-day streak achieved", icon: "🔥", earned: true },
    { title: "Bug Hunter", description: "Fix 10 bugs", icon: "🐛", earned: false },
    { title: "Code Master", description: "Complete 50 missions", icon: "👨‍💻", earned: false }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Code className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Skillytics</h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Learn by Doing
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{userProgress.xp} XP</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{userProgress.streak} day streak</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Level {userProgress.level}</span>
                </div>
              </div>
              
            <div className="flex items-center space-x-2">
              {/* Admin Dashboard Link */}
              {session?.user?.role === 'ADMIN' && (
                <Button variant="outline" size="sm" asChild>
                  <a href="/admin">
                    <Users className="h-4 w-4 mr-2" />
                    Admin
                  </a>
                </Button>
              )}
              
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Current Mission & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Mission Card */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Current Mission
                    </CardTitle>
                    <CardDescription>
                      Ready to level up your skills?
                    </CardDescription>
                  </div>
                  <Badge variant="default">{currentMission.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{currentMission.title}</h3>
                    <p className="text-muted-foreground mt-1">{currentMission.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {currentMission.points} points
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        {currentMission.module}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-orange-500" />
                        {currentMission.timeLimit} min
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => window.location.href = '/mission/1'}
                  >
                    Start Mission
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Modules Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Modules
                </CardTitle>
                <CardDescription>
                  Progress through 16 comprehensive modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.map((module) => (
                    <div
                      key={module.id}
                      className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                        module.isUnlocked
                          ? 'border-primary/20 bg-white dark:bg-slate-800 cursor-pointer'
                          : 'border-muted bg-muted/50 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg ${module.color} flex items-center justify-center text-white font-bold`}>
                            {module.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{module.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {module.lessons} lessons • {module.estimatedHours}h
                            </p>
                          </div>
                        </div>
                        {module.isUnlocked ? (
                          <Unlock className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {module.description}
                      </p>
                      
                      {module.isUnlocked && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Achievements */}
          <div className="space-y-6">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Completion</span>
                    <span>{Math.round((userProgress.completedMissions / userProgress.totalMissions) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(userProgress.completedMissions / userProgress.totalMissions) * 100} 
                    className="h-3" 
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {userProgress.completedMissions} of {userProgress.totalMissions} missions completed
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{userProgress.level}</div>
                    <div className="text-xs text-muted-foreground">Level</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-500">{userProgress.streak}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAchievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-2 rounded-lg ${
                        achievement.earned
                          ? 'bg-primary/10 border border-primary/20'
                          : 'opacity-50'
                      }`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-World Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Real-World Scenarios
                </CardTitle>
                <CardDescription>
                  Practice solving real developer problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">Critical Login Bug</h4>
                        <p className="text-xs text-muted-foreground">Fix authentication issues</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Critical</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">XSS Security Fix</h4>
                        <p className="text-xs text-muted-foreground">Patch vulnerability</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Security</Badge>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full" variant="outline">
                    <a href="/scenario">View All Scenarios</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mini-Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Mini-Projects
                </CardTitle>
                <CardDescription>
                  Build complete applications from scratch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">Todo App</h4>
                        <p className="text-xs text-muted-foreground">JavaScript Essentials</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">5 missions</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">Weather Dashboard</h4>
                        <p className="text-xs text-muted-foreground">React Components</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Advanced</Badge>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full" variant="outline">
                    <a href="/project">View All Projects</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Global Ranking</span>
                    <span className="font-medium">#1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-medium text-green-500">+12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Learners</span>
                    <span className="font-medium">45.2K</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Showcase */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
                <GitBranch className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <h3 className="font-medium text-sm">Git Simulator</h3>
                <p className="text-xs text-muted-foreground">Visual Git learning</p>
              </Card>
              
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
                <Layers className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium text-sm">Architecture</h3>
                <p className="text-xs text-muted-foreground">System design</p>
              </Card>
              
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
                <Shield className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <h3 className="font-medium text-sm">Security</h3>
                <p className="text-xs text-muted-foreground">Code analysis</p>
              </Card>
              
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
                <TestTube className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
                <h3 className="font-medium text-sm">Testing</h3>
                <p className="text-xs text-muted-foreground">QA practice</p>
              </Card>
            </div>

            {/* Mini-Projects */}
            <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
              <h3 className="font-medium text-sm">Mini-Projects</h3>
              <p className="text-xs text-muted-foreground">Build complete apps</p>
            </Card>

            {/* Mini-Projects */}
            <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
              <h3 className="font-medium text-sm">Mini-Projects</h3>
              <p className="text-xs text-muted-foreground">Build complete apps</p>
            </Card>

            {/* Premium Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Premium Features
                </CardTitle>
                <CardDescription>
                  Unlock your full potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button asChild className="w-full" variant="default">
                    <a href="/pricing">
                      <Star className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </a>
                  </Button>
                  
                  <Button asChild className="w-full" variant="outline">
                    <a href="/career-services">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Career Services
                    </a>
                  </Button>
                  
                  <Button asChild className="w-full" variant="outline">
                    <a href="/certificates">
                      <Award className="h-4 w-4 mr-2" />
                      Certificates
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Career & Analytics */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
                <Briefcase className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
                <h3 className="font-medium text-sm">Career Mode</h3>
                <p className="text-xs text-muted-foreground">Professional profile</p>
              </Card>
              
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                <h3 className="font-medium text-sm">Analytics</h3>
                <p className="text-xs text-muted-foreground">Skill insights</p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <Code className="h-4 w-4" />
              <span>© 2024 Skillytics - Learn by Doing</span>
            </div>
            <div className="flex items-center space-x-6">
              <span>320 Missions</span>
              <span>16 Modules</span>
              <span>No Videos • Pure Practice</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}