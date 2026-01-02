import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function generateDemoData() {
  console.log('🚀 Generating comprehensive demo data for Skillytics...');

  // Demo Users with different roles
  const demoUsers = [
    {
      email: 'admin@skillytics.com',
      name: 'Admin User',
      role: 'ADMIN',
      password: 'admin123',
      xp: 10000,
      level: 15,
      streak: 30,
      isPremium: true,
      bio: 'Platform administrator with full access to all features'
    },
    {
      email: 'instructor@skillytics.com',
      name: 'Sarah Instructor',
      role: 'INSTRUCTOR',
      password: 'instructor123',
      xp: 8500,
      level: 12,
      streak: 25,
      isPremium: true,
      bio: 'Senior developer and course instructor'
    },
    {
      email: 'student@skillytics.com',
      name: 'Alex Student',
      role: 'USER',
      password: 'student123',
      xp: 2500,
      level: 5,
      streak: 7,
      isPremium: false,
      bio: 'Passionate learner working through the curriculum'
    },
    {
      email: 'premium@skillytics.com',
      name: 'Jordan Premium',
      role: 'USER',
      password: 'premium123',
      xp: 6500,
      level: 9,
      streak: 15,
      isPremium: true,
      bio: 'Premium user with access to advanced features'
    },
    {
      email: 'beginner@skillytics.com',
      name: 'Taylor Beginner',
      role: 'USER',
      password: 'beginner123',
      xp: 150,
      level: 1,
      streak: 2,
      isPremium: false,
      bio: 'Just starting the coding journey'
    }
  ];

  console.log('👥 Creating demo users...');
  const createdUsers = [];

  for (const userData of demoUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        role: userData.role,
        password: hashedPassword,
        xp: userData.xp,
        level: userData.level,
        streak: userData.streak,
        isPremium: userData.isPremium,
        bio: userData.bio,
        updatedAt: new Date()
      },
      create: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: hashedPassword,
        xp: userData.xp,
        level: userData.level,
        streak: userData.streak,
        isPremium: userData.isPremium,
        bio: userData.bio
      }
    });
    
    createdUsers.push(user);
    console.log(`✅ Created user: ${user.email} (${user.role})`);
  }

  // Get or create tags
  console.log('🏷️ Creating tags...');
  const tags = [
    { name: 'beginner' },
    { name: 'intermediate' },
    { name: 'advanced' },
    { name: 'frontend' },
    { name: 'backend' },
    { name: 'fullstack' },
    { name: 'database' },
    { name: 'security' },
    { name: 'performance' },
    { name: 'testing' }
  ];

  const createdTags = [];
  for (const tagData of tags) {
    const tag = await prisma.tag.upsert({
      where: { name: tagData.name },
      update: tagData,
      create: tagData
    });
    createdTags.push(tag);
  }

  // Create comprehensive modules
  console.log('📚 Creating comprehensive modules...');
  const modules = [
    {
      id: 'module-1',
      title: 'HTML Fundamentals',
      description: 'Master the building blocks of the web',
      order: 1,
      isUnlocked: true,
      icon: '🌐',
      estimatedHours: 20
    },
    {
      id: 'module-2',
      title: 'CSS Mastery',
      description: 'Create beautiful, responsive designs',
      order: 2,
      isUnlocked: true,
      icon: '🎨',
      estimatedHours: 25
    },
    {
      id: 'module-3',
      title: 'JavaScript Core',
      description: 'Learn programming fundamentals',
      order: 3,
      isUnlocked: true,
      icon: '⚡',
      estimatedHours: 40
    },
    {
      id: 'module-4',
      title: 'React Development',
      description: 'Build modern user interfaces',
      order: 4,
      isUnlocked: true,
      icon: '⚛️',
      estimatedHours: 35
    },
    {
      id: 'module-5',
      title: 'Backend Basics',
      description: 'Server-side programming fundamentals',
      order: 5,
      isUnlocked: true,
      icon: '🔧',
      estimatedHours: 30
    }
  ];

  const createdModules = [];
  for (const moduleData of modules) {
    const module = await prisma.module.upsert({
      where: { id: moduleData.id },
      update: moduleData,
      create: moduleData
    });
    createdModules.push(module);
    console.log(`✅ Created module: ${module.title}`);
  }

  // Create lessons for each module
  console.log('📖 Creating lessons...');
  for (const module of createdModules) {
    const lessonCount = 5; // 5 lessons per module for demo
    
    for (let i = 1; i <= lessonCount; i++) {
      const lesson = await prisma.lesson.create({
        data: {
          title: `Lesson ${i}: ${getLessonTitle(module.id, i)}`,
          description: `Learn ${getLessonTitle(module.id, i).toLowerCase()} in ${module.title}`,
          content: getLessonContent(module.id, i),
          order: i,
          moduleId: module.id,
          estimatedMinutes: Math.floor(Math.random() * 30) + 15,
          difficulty: 'beginner',
          isPublished: true,
        }
      });
      
      console.log(`✅ Created lesson: ${lesson.title}`);
    }
  }

  // Create missions for lessons
  console.log('🎯 Creating missions...');
  const allLessons = await prisma.lesson.findMany();
  
  for (const lesson of allLessons.slice(0, 15)) { // Create missions for first 15 lessons
    const missionCount = 2; // 2 missions per lesson for demo
    
    for (let i = 1; i <= missionCount; i++) {
      const mission = await prisma.mission.create({
        data: {
          title: `Mission ${i}: ${getMissionTitle(lesson.moduleId, i)}`,
          description: getMissionDescription(lesson.moduleId, i),
          instructions: 'Fix the broken code and make it work correctly',
          starterCode: getInitialCode(lesson.moduleId, i),
          solutionCode: getSolutionCode(lesson.moduleId, i),
          validationRules: JSON.stringify(getValidationRules(lesson.moduleId, i)),
          hints: JSON.stringify(getMissionHints(lesson.moduleId, i)),
          points: Math.floor(Math.random() * 50) + 25,
          order: i,
          lessonId: lesson.id,
          difficulty: 'beginner',
          isPublished: true,
        }
      });
      
      // Add tags to missions
      const tagCount = 2;
      const missionTags = createdTags.slice(0, tagCount);
      
      for (const tag of missionTags) {
        await prisma.missionTag.create({
          data: {
            missionId: mission.id,
            tagId: tag.id
          }
        });
      }
      
      console.log(`✅ Created mission: ${mission.title}`);
    }
  }

  // Create achievements
  console.log('🏆 Creating achievements...');
  const achievements = [
    {
      id: 'first-mission',
      title: 'First Steps',
      description: 'Complete your first mission',
      icon: '🎯',
      points: 50,
      condition: JSON.stringify({ type: 'mission_count', value: 1 })
    },
    {
      id: 'streak-warrior',
      title: 'Streak Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      points: 100,
      condition: JSON.stringify({ type: 'streak', value: 7 })
    },
    {
      id: 'module-master',
      title: 'Module Master',
      description: 'Complete an entire module',
      icon: '📚',
      points: 200,
      condition: JSON.stringify({ type: 'module_completion', value: 1 })
    },
    {
      id: 'code-ninja',
      title: 'Code Ninja',
      description: 'Reach level 10',
      icon: '🥷',
      points: 500,
      condition: JSON.stringify({ type: 'level', value: 10 })
    }
  ];

  for (const achievementData of achievements) {
    const achievement = await prisma.achievement.upsert({
      where: { id: achievementData.id },
      update: achievementData,
      create: achievementData
    });
    console.log(`✅ Created achievement: ${achievement.title}`);
  }

  // Create user progress and achievements
  console.log('📊 Creating user progress...');
  for (const user of createdUsers) {
    // Give some users progress
    if (user.email !== 'beginner@skillytics.com') {
      const missions = await prisma.mission.findMany({
        take: Math.floor(Math.random() * 10) + 3
      });
      
      for (const mission of missions) {
        await prisma.missionAttempt.create({
          data: {
            userId: user.id,
            missionId: mission.id,
            code: getSolutionCode('module-1', 1),
            status: 'completed',
            score: Math.floor(Math.random() * 30) + 70,
            timeSpent: Math.floor(Math.random() * 1800) + 300,
            attempts: Math.floor(Math.random() * 3) + 1,
            completedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
          }
        });
      }
    }
    
    // Grant some achievements
    const userAchievements = achievements.slice(0, Math.floor(Math.random() * 3) + 1);
    for (const achievement of userAchievements) {
      await prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId: achievement.id,
          unlockedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
      });
    }
  }

  // Create mini projects
  console.log('🏗️ Creating mini projects...');
  const projects = [
    {
      title: 'Todo App',
      description: 'Build a complete todo application with CRUD operations',
      moduleId: 'module-3',
      missions: JSON.stringify(['mission-1', 'mission-2']),
      difficulty: 'beginner',
      estimatedHours: 3
    },
    {
      title: 'Weather Dashboard',
      description: 'Create a weather app with API integration',
      moduleId: 'module-4',
      missions: JSON.stringify(['mission-3', 'mission-4']),
      difficulty: 'intermediate',
      estimatedHours: 5
    }
  ];

  for (const projectData of projects) {
    const project = await prisma.miniProject.create({
      data: projectData
    });
    console.log(`✅ Created project: ${project.title}`);
  }

  console.log('🎉 Demo data generation complete!');
  console.log('\n📋 Demo Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  demoUsers.forEach(user => {
    console.log(`👤 ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Level: ${user.level} | XP: ${user.xp} | Streak: ${user.streak}`);
    console.log(`   Premium: ${user.isPremium ? '✅' : '❌'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });

  console.log('\n🔑 Admin Features:');
  console.log('• Admin user has full platform access');
  console.log('• Instructor can create and manage content');
  console.log('• Premium users have access to all features');
  console.log('• Regular users have limited access');
}

// Helper functions for generating content
function getLessonTitle(moduleId: string, lessonNumber: number): string {
  const titles: Record<string, string[]> = {
    'module-1': ['HTML Structure', 'Semantic HTML', 'Forms & Input', 'Media Elements', 'Accessibility'],
    'module-2': ['CSS Basics', 'Layout & Positioning', 'Flexbox', 'Grid', 'Responsive Design'],
    'module-3': ['Variables & Types', 'Functions', 'Arrays & Objects', 'DOM Manipulation', 'Async JavaScript'],
    'module-4': ['Components', 'State Management', 'Hooks', 'Routing', 'Context API'],
    'module-5': ['Node.js Basics', 'Express.js', 'Middleware', 'Error Handling', 'REST Principles']
  };
  
  const moduleTitles = titles[moduleId] || ['Introduction', 'Advanced Topics', 'Best Practices', 'Project Work'];
  return moduleTitles[Math.min(lessonNumber - 1, moduleTitles.length - 1)];
}

function getLessonContent(moduleId: string, lessonNumber: number): string {
  return `
# ${getLessonTitle(moduleId, lessonNumber)}

## Overview
This lesson covers fundamental concepts and practical applications.

## Learning Objectives
- Understand core concepts
- Apply best practices
- Build practical skills

## Topics Covered
1. Introduction to the topic
2. Key concepts and terminology
3. Practical examples
4. Common pitfalls and how to avoid them
5. Best practices and guidelines

## Exercises
Complete the missions to practice what you've learned.
  `;
}

function getMissionTitle(moduleId: string, missionNumber: number): string {
  const titles: Record<string, string[]> = {
    'module-1': ['Fix Broken HTML Structure', 'Create Semantic Layout'],
    'module-2': ['Style the Navigation', 'Create Responsive Grid'],
    'module-3': ['Debug JavaScript Function', 'Manipulate DOM Elements'],
    'module-4': ['Fix React Component', 'Implement State Management'],
    'module-5': ['Build REST API', 'Fix Server Error']
  };
  
  const moduleTitles = titles[moduleId] || ['Debug Issue', 'Implement Feature'];
  return moduleTitles[Math.min(missionNumber - 1, moduleTitles.length - 1)];
}

function getMissionDescription(moduleId: string, missionNumber: number): string {
  return `
You are working on a real-world project and have encountered an issue that needs to be fixed.

## Problem Statement
The current implementation has bugs and doesn't work as expected. Your task is to identify and fix the issues.

## Requirements
- Analyze the provided code
- Identify the problems
- Implement a working solution
- Follow best practices
  `;
}

function getInitialCode(moduleId: string, missionNumber: number): string {
  return `
// Broken code that needs fixing
function broken() {
    return null;
}
`;
}

function getSolutionCode(moduleId: string, missionNumber: number): string {
  return `
// Working solution
function solution() {
    return "success";
}
`;
}

function getValidationRules(moduleId: string, missionNumber: number): any {
  return {
    patterns: [
      {
        type: "function_exists",
        name: "solution",
        message: "Solution function must exist"
      }
    ],
    tests: [
      {
        input: [],
        expected: "success",
        message: "Should return success message"
      }
    ]
  };
}

function getMissionHints(moduleId: string, missionNumber: number): any {
  return [
    {
      level: 1,
      content: "Start by examining the code structure and identifying obvious issues.",
      pointsCost: 5
    },
    {
      level: 2,
      content: "Look for missing syntax elements and proper function definitions.",
      pointsCost: 10
    }
  ];
}

generateDemoData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());