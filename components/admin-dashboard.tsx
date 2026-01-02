'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award, 
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalMissions: number;
  totalProjects: number;
  totalAchievements: number;
  activeUsers: number;
  premiumUsers: number;
  completionRate: number;
  avgTimeSpent: number;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  level: number;
  xp: number;
  streak: number;
  isPremium: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

interface Mission {
  id: string;
  title: string;
  difficulty: string;
  points: number;
  attempts: number;
  completionRate: number;
  avgTimeSpent: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalMissions: 0,
    totalProjects: 0,
    totalAchievements: 0,
    activeUsers: 0,
    premiumUsers: 0,
    completionRate: 0,
    avgTimeSpent: 0
  });

  const [users, setUsers] = useState<User[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for demo
      setStats({
        totalUsers: 5,
        totalMissions: 30,
        totalProjects: 2,
        totalAchievements: 4,
        activeUsers: 4,
        premiumUsers: 2,
        completionRate: 75,
        avgTimeSpent: 25
      });

      // Mock users data
      setUsers([
        {
          id: '1',
          email: 'admin@skillytics.com',
          name: 'Admin User',
          role: 'ADMIN',
          level: 15,
          xp: 10000,
          streak: 30,
          isPremium: true,
          createdAt: new Date()
        },
        {
          id: '2',
          email: 'instructor@skillytics.com',
          name: 'Sarah Instructor',
          role: 'INSTRUCTOR',
          level: 12,
          xp: 8500,
          streak: 25,
          isPremium: true,
          createdAt: new Date()
        },
        {
          id: '3',
          email: 'student@skillytics.com',
          name: 'Alex Student',
          role: 'USER',
          level: 5,
          xp: 2500,
          streak: 7,
          isPremium: false,
          createdAt: new Date()
        },
        {
          id: '4',
          email: 'premium@skillytics.com',
          name: 'Jordan Premium',
          role: 'USER',
          level: 9,
          xp: 6500,
          streak: 15,
          isPremium: true,
          createdAt: new Date()
        },
        {
          id: '5',
          email: 'beginner@skillytics.com',
          name: 'Taylor Beginner',
          role: 'USER',
          level: 1,
          xp: 150,
          streak: 2,
          isPremium: false,
          createdAt: new Date()
        }
      ]);

      // Mock missions data
      setMissions([
        {
          id: '1',
          title: 'Fix Broken HTML Structure',
          difficulty: 'beginner',
          points: 50,
          attempts: 45,
          completionRate: 85,
          avgTimeSpent: 15
        },
        {
          id: '2',
          title: 'Debug JavaScript Function',
          difficulty: 'intermediate',
          points: 75,
          attempts: 32,
          completionRate: 72,
          avgTimeSpent: 25
        },
        {
          id: '3',
          title: 'Build REST API',
          difficulty: 'advanced',
          points: 100,
          attempts: 18,
          completionRate: 65,
          avgTimeSpent: 45
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'INSTRUCTOR': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Skillytics platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} active this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Missions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMissions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.premiumUsers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.premiumUsers / stats.totalUsers) * 100)}% of total users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.avgTimeSpent)}m</div>
              <p className="text-xs text-muted-foreground">
                Per mission
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Level</th>
                        <th className="text-left p-2">XP</th>
                        <th className="text-left p-2">Streak</th>
                        <th className="text-left p-2">Premium</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{user.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-2">{user.level}</td>
                          <td className="p-2">{user.xp}</td>
                          <td className="p-2">{user.streak}</td>
                          <td className="p-2">
                            {user.isPremium ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mission Management</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Mission
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {missions.map((mission) => (
                    <Card key={mission.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{mission.title}</CardTitle>
                          <Badge className={getDifficultyColor(mission.difficulty)}>
                            {mission.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Points:</span>
                            <span className="font-medium">{mission.points}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Attempts:</span>
                            <span className="font-medium">{mission.attempts}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Completion:</span>
                            <span className="font-medium">{mission.completionRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Avg Time:</span>
                            <span className="font-medium">{mission.avgTimeSpent}m</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Stats
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">HTML Fundamentals</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CSS Mastery</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">JavaScript Core</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Daily Active Users</span>
                      </div>
                      <span className="font-medium">234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Weekly Growth</span>
                      </div>
                      <span className="font-medium">+12%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Achievements Unlocked</span>
                      </div>
                      <span className="font-medium">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Support Tickets</span>
                      </div>
                      <span className="font-medium">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Allow User Registration</p>
                          <p className="text-sm text-gray-600">Enable new user signups</p>
                        </div>
                        <Button variant="outline">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Maintenance Mode</p>
                          <p className="text-sm text-gray-600">Temporarily disable the platform</p>
                        </div>
                        <Button variant="outline">Disabled</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Learning Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Default XP per Mission</p>
                          <p className="text-sm text-gray-600">Base XP awarded for mission completion</p>
                        </div>
                        <Input type="number" defaultValue="50" className="w-20" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Streak Reset Days</p>
                          <p className="text-sm text-gray-600">Days of inactivity before streak resets</p>
                        </div>
                        <Input type="number" defaultValue="7" className="w-20" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}