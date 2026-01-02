'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Award, 
  BookOpen,
  Activity,
  Download,
  Calendar,
  Filter,
  Eye,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalMissions: number;
    completionRate: number;
    avgTimeSpent: number;
    totalXP: number;
    premiumConversion: number;
    retentionRate: number;
  };
  userEngagement: {
    dailyActive: number[];
    weeklyActive: number[];
    monthlyActive: number[];
    sessionDuration: number[];
    bounceRate: number;
    pageViews: number;
  };
  learningProgress: {
    moduleProgress: Array<{
      moduleName: string;
      totalUsers: number;
      completedUsers: number;
      avgCompletionTime: number;
      difficulty: string;
    }>;
    missionStats: Array<{
      title: string;
      attempts: number;
      successRate: number;
      avgTime: number;
      hintsUsed: number;
    }>;
    skillGrowth: Array<{
      skill: string;
      currentLevel: number;
      previousLevel: number;
      growth: number;
    }>;
  };
  performance: {
    serverUptime: number;
    avgResponseTime: number;
    errorRate: number;
    activeConnections: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

export default function AnalyticsReporting() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedModule, setSelectedModule] = useState('all');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, selectedModule]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock comprehensive analytics data
      const mockData: AnalyticsData = {
        overview: {
          totalUsers: 5,
          activeUsers: 4,
          totalMissions: 30,
          completionRate: 75,
          avgTimeSpent: 25,
          totalXP: 27300,
          premiumConversion: 40,
          retentionRate: 85
        },
        userEngagement: {
          dailyActive: [12, 15, 8, 20, 18, 22, 25],
          weeklyActive: [45, 52, 48, 58, 62],
          monthlyActive: [180, 195, 210, 225, 240],
          sessionDuration: [15, 22, 18, 30, 25, 28, 20],
          bounceRate: 25,
          pageViews: 1250
        },
        learningProgress: {
          moduleProgress: [
            {
              moduleName: 'HTML Fundamentals',
              totalUsers: 5,
              completedUsers: 4,
              avgCompletionTime: 1200,
              difficulty: 'beginner'
            },
            {
              moduleName: 'CSS Mastery',
              totalUsers: 4,
              completedUsers: 2,
              avgCompletionTime: 1800,
              difficulty: 'intermediate'
            },
            {
              moduleName: 'JavaScript Core',
              totalUsers: 3,
              completedUsers: 1,
              avgCompletionTime: 2400,
              difficulty: 'intermediate'
            },
            {
              moduleName: 'React Development',
              totalUsers: 2,
              completedUsers: 0,
              avgCompletionTime: 0,
              difficulty: 'advanced'
            },
            {
              moduleName: 'Backend Basics',
              totalUsers: 1,
              completedUsers: 0,
              avgCompletionTime: 0,
              difficulty: 'advanced'
            }
          ],
          missionStats: [
            {
              title: 'Fix Broken HTML Structure',
              attempts: 45,
              successRate: 85,
              avgTime: 15,
              hintsUsed: 12
            },
            {
              title: 'Debug JavaScript Function',
              attempts: 32,
              successRate: 72,
              avgTime: 25,
              hintsUsed: 18
            },
            {
              title: 'Build REST API',
              attempts: 18,
              successRate: 65,
              avgTime: 45,
              hintsUsed: 8
            }
          ],
          skillGrowth: [
            {
              skill: 'HTML/CSS',
              currentLevel: 8,
              previousLevel: 6,
              growth: 33
            },
            {
              skill: 'JavaScript',
              currentLevel: 5,
              previousLevel: 3,
              growth: 67
            },
            {
              skill: 'React',
              currentLevel: 2,
              previousLevel: 1,
              growth: 100
            },
            {
              skill: 'Backend',
              currentLevel: 1,
              previousLevel: 0,
              growth: 100
            }
          ]
        },
        performance: {
          serverUptime: 99.9,
          avgResponseTime: 120,
          errorRate: 0.1,
          activeConnections: 25,
          memoryUsage: 65,
          cpuUsage: 42
        }
      };

      setData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: 'csv' | 'pdf' | 'json') => {
    console.log(`Exporting report as ${format}`);
    // Implementation for export functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reporting</h1>
              <p className="text-gray-600">Comprehensive insights into platform performance and user engagement</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              <Button variant="outline" onClick={() => exportReport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => exportReport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {data.overview.activeUsers} active ({Math.round((data.overview.activeUsers / data.overview.totalUsers) * 100)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.avgTimeSpent}m</div>
              <p className="text-xs text-muted-foreground">
                +3m from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Conversion</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overview.premiumConversion}%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="engagement" className="space-y-6">
          <TabsList>
            <TabsTrigger value="engagement">User Engagement</TabsTrigger>
            <TabsTrigger value="learning">Learning Progress</TabsTrigger>
            <TabsTrigger value="performance">Platform Performance</TabsTrigger>
            <TabsTrigger value="reports">Custom Reports</TabsTrigger>
          </TabsList>

          {/* User Engagement Tab */}
          <TabsContent value="engagement">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.userEngagement.dailyActive.map((count, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">Day {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(count / Math.max(...data.userEngagement.dailyActive)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.userEngagement.sessionDuration.map((duration, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">Session {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(duration / Math.max(...data.userEngagement.sessionDuration)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{duration}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Page Views</span>
                      <span className="font-medium">{data.userEngagement.pageViews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bounce Rate</span>
                      <span className="font-medium">{data.userEngagement.bounceRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Retention Rate</span>
                      <span className="font-medium">{data.overview.retentionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.userEngagement.weeklyActive.map((count, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">Week {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${(count / Math.max(...data.userEngagement.weeklyActive)) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Learning Progress Tab */}
          <TabsContent value="learning">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Module Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.learningProgress.moduleProgress.map((module, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{module.moduleName}</h4>
                            <p className="text-sm text-gray-600">
                              {module.completedUsers} of {module.totalUsers} users completed
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={
                              module.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                              module.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {module.difficulty}
                            </Badge>
                            <span className="text-sm font-medium">
                              {Math.round((module.completedUsers / module.totalUsers) * 100)}%
                            </span>
                          </div>
                        </div>
                        <Progress value={(module.completedUsers / module.totalUsers) * 100} className="h-2" />
                        <p className="text-xs text-gray-500">
                          Avg completion time: {Math.round(module.avgCompletionTime / 60)} minutes
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mission Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.learningProgress.missionStats.map((mission, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">{mission.title}</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Attempts:</span>
                              <span className="ml-2 font-medium">{mission.attempts}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Success Rate:</span>
                              <span className="ml-2 font-medium">{mission.successRate}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Avg Time:</span>
                              <span className="ml-2 font-medium">{mission.avgTime}m</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Hints Used:</span>
                              <span className="ml-2 font-medium">{mission.hintsUsed}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skill Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.learningProgress.skillGrowth.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{skill.skill}</h4>
                            <p className="text-sm text-gray-600">
                              Level {skill.previousLevel} → {skill.currentLevel}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">
                              +{skill.growth}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Platform Performance Tab */}
          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Server Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Server Uptime</span>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{data.performance.serverUptime}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="font-medium">{data.performance.avgResponseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error Rate</span>
                      <span className="font-medium">{data.performance.errorRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Connections</span>
                      <span className="font-medium">{data.performance.activeConnections}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Memory Usage</span>
                        <span>{data.performance.memoryUsage}%</span>
                      </div>
                      <Progress value={data.performance.memoryUsage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>CPU Usage</span>
                        <span>{data.performance.cpuUsage}%</span>
                      </div>
                      <Progress value={data.performance.cpuUsage} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Custom Reports Tab */}
          <TabsContent value="reports">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Custom Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      User Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <BookOpen className="h-6 w-6 mb-2" />
                      Learning Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Target className="h-6 w-6 mb-2" />
                      Mission Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Award className="h-6 w-6 mb-2" />
                      Achievement Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Performance Report
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Activity className="h-6 w-6 mb-2" />
                      Engagement Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Weekly Performance Report</h4>
                        <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Monthly User Analytics</h4>
                        <p className="text-sm text-gray-600">First day of each month</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}