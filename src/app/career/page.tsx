'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Briefcase, 
  User, 
  FileText, 
  Award, 
  TrendingUp, 
  Target,
  ArrowLeft,
  Download,
  Share2,
  Users,
  Star,
  Code,
  Globe,
  Building,
  Lightbulb,
  CheckCircle,
  Clock,
  Calendar
} from 'lucide-react'

interface CareerProfile {
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    website: string
    linkedin: string
    github: string
    summary: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    current: boolean
    description: string[]
    technologies: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    current: boolean
    gpa?: string
    achievements: string[]
  }>
  skills: {
    technical: Array<{
      name: string
      level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
      yearsOfExperience: number
    }>
    soft: string[]
  }
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    liveUrl?: string
    githubUrl?: string
    featured: boolean
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
    expiryDate?: string
    credentialId?: string
  }>
  achievements: Array<{
    id: string
    title: string
    description: string
    date: string
    type: 'mission' | 'project' | 'streak' | 'skill'
  }>
}

interface CareerPath {
  id: string
  title: string
  description: string
  requiredSkills: string[]
  avgSalary: string
  growth: string
  companies: string[]
  requirements: string[]
}

const careerPaths: CareerPath[] = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Build user interfaces and web applications with modern JavaScript frameworks',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Responsive Design'],
    avgSalary: '$75,000 - $120,000',
    growth: 'High demand with remote opportunities',
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix'],
    requirements: ['Strong portfolio', 'Modern framework experience', 'Problem-solving skills']
  },
  {
    id: 'fullstack-developer',
    title: 'Full-Stack Developer',
    description: 'Work on both frontend and backend development to build complete web applications',
    requiredSkills: ['JavaScript', 'Node.js', 'Database', 'APIs', 'React', 'DevOps'],
    avgSalary: '$90,000 - $150,000',
    growth: 'Excellent growth with leadership opportunities',
    companies: ['Stripe', 'Airbnb', 'Uber', 'Spotify', 'Dropbox', 'Slack'],
    requirements: ['Full-stack experience', 'System design knowledge', 'Project management']
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    description: 'Design and implement server-side logic, databases, and APIs',
    requiredSkills: ['Node.js', 'Python', 'Java', 'Database Design', 'APIs', 'Cloud Services'],
    avgSalary: '$85,000 - $140,000',
    growth: 'Steady demand with specialization opportunities',
    companies: ['AWS', 'Google Cloud', 'Microsoft', 'IBM', 'Oracle', 'Salesforce'],
    requirements: ['Strong programming skills', 'Database expertise', 'System architecture']
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Automate and streamline the software development and deployment process',
    requiredSkills: ['CI/CD', 'Docker', 'Kubernetes', 'Cloud Platforms', 'Monitoring', 'Scripting'],
    avgSalary: '$95,000 - $160,000',
    growth: 'Very high demand with competitive salaries',
    companies: ['Amazon', 'Microsoft', 'Google', 'Netflix', 'Adobe', 'IBM'],
    requirements: ['Infrastructure knowledge', 'Automation skills', 'Security best practices']
  },
  {
    id: 'mobile-developer',
    title: 'Mobile Developer',
    description: 'Create native and cross-platform mobile applications',
    requiredSkills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile UI/UX', 'App Store Deployment'],
    avgSalary: '$80,000 - $130,000',
    growth: 'Growing market with app economy expansion',
    companies: ['Apple', 'Google', 'Meta', 'Uber', 'Lyft', 'Airbnb'],
    requirements: ['Mobile platform knowledge', 'Performance optimization', 'App store guidelines']
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    description: 'Design user interfaces and experiences for web and mobile applications',
    requiredSkills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Visual Design', 'Design Systems'],
    avgSalary: '$70,000 - $120,000',
    growth: 'Creative field with diverse opportunities',
    companies: ['Apple', 'Google', 'Meta', 'Microsoft', 'Adobe', 'Figma'],
    requirements: ['Strong portfolio', 'Design thinking', 'Communication skills']
  }
]

export default function CareerMode() {
  const [selectedPath, setSelectedPath] = useState<CareerPath>(careerPaths[0])
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<CareerProfile>({
    personalInfo: {
      name: 'John Doe',
      title: 'Full Stack Developer',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      summary: 'Passionate full-stack developer with 3+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies. Strong problem-solving skills and a track record of delivering high-quality code.'
    },
    experience: [
      {
        id: '1',
        company: 'TechCorp Inc.',
        position: 'Senior Full Stack Developer',
        startDate: '2022-01',
        endDate: '',
        current: true,
        description: [
          'Lead development of microservices architecture',
          'Mentor junior developers and conduct code reviews',
          'Implement CI/CD pipelines and automated testing',
          'Collaborate with product team to define requirements'
        ],
        technologies: ['React', 'Node.js', 'TypeScript', 'Docker', 'AWS', 'PostgreSQL']
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        startDate: '2020-06',
        endDate: '2021-12',
        current: false,
        description: [
          'Built and launched MVP from scratch',
          'Implemented real-time features using WebSockets',
          'Optimized database queries and API performance',
          'Integrated third-party payment and analytics services'
        ],
        technologies: ['Vue.js', 'Express', 'MongoDB', 'Redis', 'Stripe', 'Google Analytics']
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016-09',
        endDate: '2020-05',
        current: false,
        gpa: '3.8',
        achievements: [
          'Dean\'s List for 6 semesters',
          'President of Computer Science Club',
          'Hackathon winner (3x)',
          'Published research paper on machine learning'
        ]
      }
    ],
    skills: {
      technical: [
        { name: 'JavaScript', level: 'expert', yearsOfExperience: 4 },
        { name: 'React', level: 'expert', yearsOfExperience: 3 },
        { name: 'Node.js', level: 'advanced', yearsOfExperience: 3 },
        { name: 'TypeScript', level: 'advanced', yearsOfExperience: 2 },
        { name: 'Python', level: 'intermediate', yearsOfExperience: 1 },
        { name: 'AWS', level: 'intermediate', yearsOfExperience: 2 }
      ],
      soft: [
        'Leadership',
        'Communication',
        'Problem Solving',
        'Team Collaboration',
        'Project Management',
        'Time Management'
      ]
    },
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        description: 'Full-featured e-commerce platform with user authentication, payment processing, and admin dashboard',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Docker'],
        liveUrl: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/johndoe/ecommerce',
        featured: true
      },
      {
        id: '2',
        name: 'Task Management App',
        description: 'Real-time task management application with drag-and-drop interface and team collaboration',
        technologies: ['Vue.js', 'Express', 'Socket.io', 'PostgreSQL'],
        liveUrl: 'https://taskapp-demo.com',
        githubUrl: 'https://github.com/johndoe/taskapp',
        featured: false
      }
    ],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023-03',
        expiryDate: '2026-03',
        credentialId: 'AWS-SAA-C003'
      },
      {
        id: '2',
        name: 'Google Cloud Professional Developer',
        issuer: 'Google',
        date: '2022-11',
        credentialId: 'GCP-PROF-001'
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Completed 320 Missions',
        description: 'Mastered all 16 modules in Skillytics platform',
        date: '2024-01',
        type: 'mission'
      },
      {
        id: '2',
        title: '30-Day Streak Champion',
        description: 'Maintained perfect 30-day learning streak',
        date: '2023-12',
        type: 'streak'
      },
      {
        id: '3',
        title: 'Full-Stack Project Master',
        description: 'Successfully completed all advanced full-stack projects',
        date: '2023-11',
        type: 'project'
      }
    ]
  })

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-100 text-purple-800'
      case 'advanced': return 'bg-blue-100 text-blue-800'
      case 'intermediate': return 'bg-green-100 text-green-800'
      case 'beginner': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProfileCompletion = () => {
    let completed = 0
    let total = 0
    
    // Personal info (20%)
    if (profile.personalInfo.name && profile.personalInfo.summary) completed += 20
    total += 20
    
    // Experience (25%)
    if (profile.experience.length > 0) completed += 25
    total += 25
    
    // Education (15%)
    if (profile.education.length > 0) completed += 15
    total += 15
    
    // Skills (20%)
    if (profile.skills.technical.length > 3 && profile.skills.soft.length > 3) completed += 20
    total += 20
    
    // Projects (15%)
    if (profile.projects.length > 0) completed += 15
    total += 15
    
    // Achievements (5%)
    if (profile.achievements.length > 0) completed += 5
    total += 5
    
    return Math.round((completed / total) * 100)
  }

  const generateResume = () => {
    const resumeData = {
      ...profile,
      profileCompletion: getProfileCompletion(),
      generatedAt: new Date().toISOString()
    }
    
    // In a real app, this would generate a PDF or Word document
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.personalInfo.name.replace(/\s+/g, '_')}_resume.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareProfile = () => {
    const shareData = {
      title: `${profile.personalInfo.name} - ${profile.personalInfo.title}`,
      text: profile.personalInfo.summary,
      url: window.location.href
    }
    
    if (navigator.share) {
      navigator.share(shareData)
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
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
                <Briefcase className="h-6 w-6 text-indigo-600" />
                <h1 className="text-2xl font-bold">Career Mode</h1>
              </div>
              <Badge variant="secondary">Module 16 - Professional Development</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={generateResume}>
                <Download className="h-4 w-4 mr-2" />
                Resume
              </Button>
              <Button size="sm" variant="outline" onClick={shareProfile}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Career Paths */}
          <div className="lg:col-span-1 space-y-4">
            {/* Career Paths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Career Paths
                </CardTitle>
                <CardDescription>
                  Choose your professional development path
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {careerPaths.map((path) => (
                    <button
                      key={path.id}
                      onClick={() => setSelectedPath(path)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedPath.id === path.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{path.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {path.requiredSkills.length} skills
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {path.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span>{path.avgSalary}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Path Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  {selectedPath.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{selectedPath.description}</p>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedPath.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Growth Potential:</h4>
                  <p className="text-sm text-muted-foreground">{selectedPath.growth}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Top Companies:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedPath.companies.map((company, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {selectedPath.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Completion</span>
                      <span>{getProfileCompletion()}%</span>
                    </div>
                    <Progress value={getProfileCompletion()} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {profile.skills.technical.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Skills</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {profile.projects.length}
                      </div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Complete your profile to unlock career opportunities
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Profile Builder */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Career Profile Builder
                  </CardTitle>
                  <Badge variant="outline">
                    {getProfileCompletion()}% Complete
                  </Badge>
                </div>
                <CardDescription>
                  Build your professional profile based on your learning progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Personal Information</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium">Name</label>
                            <div className="mt-1 p-2 bg-muted rounded text-sm">
                              {profile.personalInfo.name}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Professional Title</label>
                            <div className="mt-1 p-2 bg-muted rounded text-sm">
                              {profile.personalInfo.title}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <div className="mt-1 p-2 bg-muted rounded text-sm">
                              {profile.personalInfo.email}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Location</label>
                            <div className="mt-1 p-2 bg-muted rounded text-sm">
                              {profile.personalInfo.location}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Professional Summary</h4>
                        <div className="p-3 bg-muted rounded text-sm">
                          {profile.personalInfo.summary}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Website</label>
                        <div className="mt-1 p-2 bg-muted rounded text-sm text-blue-600">
                          {profile.personalInfo.website}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">LinkedIn</label>
                        <div className="mt-1 p-2 bg-muted rounded text-sm text-blue-600">
                          {profile.personalInfo.linkedin}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">GitHub</label>
                        <div className="mt-1 p-2 bg-muted rounded text-sm text-gray-600">
                          {profile.personalInfo.github}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="experience" className="space-y-4">
                    <div className="space-y-4">
                      {profile.experience.map((exp) => (
                        <div key={exp.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{exp.position}</h4>
                              <p className="text-sm text-muted-foreground">{exp.company}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </div>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                            {exp.description.map((desc, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                                <span>{desc}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex flex-wrap gap-1">
                            {exp.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="education" className="space-y-4">
                    <div className="space-y-4">
                      {profile.education.map((edu) => (
                        <div key={edu.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{edu.degree}</h4>
                              <p className="text-sm text-muted-foreground">{edu.institution}</p>
                              <p className="text-sm text-muted-foreground">{edu.field}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                            </div>
                          </div>
                          {edu.gpa && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">GPA: </span>
                              <span className="text-sm text-muted-foreground">{edu.gpa}</span>
                            </div>
                          )}
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {edu.achievements.map((achievement, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="skills" className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Technical Skills</h4>
                      <div className="space-y-2">
                        {profile.skills.technical.map((skill) => (
                          <div key={skill.name} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <span className="font-medium">{skill.name}</span>
                              <div className="text-xs text-muted-foreground">
                                {skill.yearsOfExperience} years experience
                              </div>
                            </div>
                            <Badge className={getSkillLevelColor(skill.level)}>
                              {skill.level}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.soft.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="projects" className="space-y-4">
                    <div className="space-y-4">
                      {profile.projects.map((project) => (
                        <div key={project.id} className={`p-4 border rounded-lg ${
                          project.featured ? 'border-primary bg-primary/5' : ''
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{project.name}</h4>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>
                            {project.featured && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {project.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            {project.liveUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                  <Globe className="h-4 w-4 mr-2" />
                                  Live Demo
                                </a>
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Code className="h-4 w-4 mr-2" />
                                  GitHub
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="achievements" className="space-y-4">
                    <div className="space-y-3">
                      {profile.achievements.map((achievement) => (
                        <div key={achievement.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Award className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {achievement.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {achievement.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}