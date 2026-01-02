'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Smartphone, 
  Play, 
  Trophy, 
  Target, 
  Clock,
  Star,
  Code,
  BookOpen,
  Zap,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'

export default function MobileInterface() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  const quickStats = {
    level: 1,
    xp: 45,
    streak: 7,
    completedMissions: 12
  }

  const currentMission = {
    title: "Fix the Broken Button",
    difficulty: "Beginner",
    points: 10,
    timeLimit: 15,
    progress: 65
  }

  const recentMissions = [
    { title: "HTML Structure Basics", completed: true, points: 10 },
    { title: "CSS Flexbox Layout", completed: true, points: 15 },
    { title: "JavaScript Variables", completed: false, points: 10 },
    { title: "DOM Manipulation", completed: false, points: 20 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b dark:bg-slate-900/90">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-bold">Skillytics</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              Lvl {quickStats.level}
            </Badge>
            <div className="flex items-center space-x-1 text-xs">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>{quickStats.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t bg-white dark:bg-slate-900 p-4">
            <nav className="grid grid-cols-2 gap-2">
              {[
                { id: 'home', label: 'Home', icon: <Smartphone className="h-4 w-4" /> },
                { id: 'missions', label: 'Missions', icon: <Target className="h-4 w-4" /> },
                { id: 'progress', label: 'Progress', icon: <Trophy className="h-4 w-4" /> },
                { id: 'profile', label: 'Profile', icon: <Star className="h-4 w-4" /> }
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMenuOpen(false)
                  }}
                  className="justify-start"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {/* Quick Stats Bar */}
        <div className="bg-white dark:bg-slate-900 border-b">
          <div className="grid grid-cols-4 gap-1 p-3">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{quickStats.level}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-500">{quickStats.xp}</div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">{quickStats.streak}</div>
              <div className="text-xs text-muted-foreground">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">{quickStats.completedMissions}</div>
              <div className="text-xs text-muted-foreground">Done</div>
            </div>
          </div>
        </div>

        {activeTab === 'home' && (
          <div className="p-4 space-y-4">
            {/* Current Mission Card */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Current Mission</CardTitle>
                  <Badge variant="default">{currentMission.difficulty}</Badge>
                </div>
                <CardDescription className="text-sm">
                  Ready to continue learning?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold">{currentMission.title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>Progress</span>
                    <span>{currentMission.progress}%</span>
                  </div>
                  <Progress value={currentMission.progress} className="h-2 mt-1" />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {currentMission.points} pts
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-500" />
                      {currentMission.timeLimit}m
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => window.location.href = '/mission/1'}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Continue
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-medium text-sm">Modules</h3>
                <p className="text-xs text-muted-foreground">16 modules</p>
              </Card>
              
              <Card className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow">
                <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-medium text-sm">Missions</h3>
                <p className="text-xs text-muted-foreground">320 total</p>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Missions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMissions.map((mission, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${mission.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <h4 className="font-medium text-sm">{mission.title}</h4>
                          <p className="text-xs text-muted-foreground">{mission.points} points</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">All Missions</h2>
            <div className="grid gap-3">
              {recentMissions.map((mission, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${mission.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <div>
                        <h3 className="font-medium">{mission.title}</h3>
                        <p className="text-sm text-muted-foreground">{mission.points} points</p>
                      </div>
                    </div>
                    <Button size="sm" variant={mission.completed ? "outline" : "default"}>
                      {mission.completed ? "Review" : "Start"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Your Progress</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Overall Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{quickStats.level}</div>
                    <div className="text-sm text-muted-foreground">Current Level</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-500">{quickStats.streak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Level Progress</span>
                    <span>{quickStats.xp}/100 XP</span>
                  </div>
                  <Progress value={quickStats.xp} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {['🎯', '🔥', '🐛', '⚡', '🏆', '💡'].map((emoji, index) => (
                    <div key={index} className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-2xl mb-1">{emoji}</div>
                      <div className="text-xs text-muted-foreground">
                        {index < 3 ? 'Unlocked' : 'Locked'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Profile</h2>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center">
                    <span className="text-2xl text-white font-bold">L{quickStats.level}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Code Learner</h3>
                    <p className="text-muted-foreground">Level {quickStats.level} Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Missions</span>
                  <span className="font-medium">{quickStats.completedMissions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total XP</span>
                  <span className="font-medium">{quickStats.xp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Streak</span>
                  <span className="font-medium">{quickStats.streak} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Join Date</span>
                  <span className="font-medium">Today</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t dark:bg-slate-900/90">
        <div className="grid grid-cols-4">
          {[
            { id: 'home', label: 'Home', icon: <Smartphone className="h-5 w-5" /> },
            { id: 'missions', label: 'Missions', icon: <Target className="h-5 w-5" /> },
            { id: 'progress', label: 'Progress', icon: <Trophy className="h-5 w-5" /> },
            { id: 'profile', label: 'Profile', icon: <Star className="h-5 w-5" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors ${
                activeTab === item.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.icon}
              <span className="mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}