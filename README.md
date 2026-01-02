# 📱 Skillytics - Learn by Doing Platform

A comprehensive full-stack learning platform that teaches programming through interactive missions instead of videos. Covers all 16 modules with 320+ hands-on missions.

## 🚀 Features Implemented

### ✅ Core Features
- **Mission-Based Learning Engine** - Convert lessons into real-world programming missions
- **Interactive Code Playground** - Monaco Editor with live preview and validation
- **Problem-First Learning Flow** - Show broken code, ask users to fix it
- **AI Mentor Integration** - LLM-powered hints and guidance
- **Progressive Hint System** - 4-level hint system with point costs
- **Skill Tree & Module Unlock** - Sequential learning progression
- **Automatic Code Validation** - Pattern-based validation with scoring
- **Real-time WebSocket Service** - Live collaboration and updates

### ✅ User Experience
- **Responsive Mobile Interface** - Mobile-first design with bottom navigation
- **Progress Analytics** - XP, levels, streaks, and achievement tracking
- **Gamification Elements** - Points, badges, leaderboards
- **Offline-First Design** - Text-based content for low bandwidth

### ✅ Technical Architecture
- **Next.js 15** with App Router and TypeScript
- **Prisma ORM** with SQLite database
- **Real-time Communication** via WebSocket service
- **AI Integration** using z-ai-web-dev-sdk
- **Monaco Editor** for professional code editing
- **shadcn/ui** components with Tailwind CSS

## 📁 Project Structure

```
skillytics/
├── src/
│   ├── app/
│   │   ├── api/                    # Backend API routes
│   │   │   ├── missions/           # Mission CRUD and validation
│   │   │   ├── modules/            # Module management
│   │   │   └── mentor/             # AI mentor service
│   │   ├── mission/[id]/           # Mission interface
│   │   ├── page.tsx                # Main dashboard
│   │   └── layout.tsx              # Root layout
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   └── mobile-interface.tsx    # Mobile-optimized UI
│   ├── lib/
│   │   ├── db.ts                   # Prisma client
│   │   └── utils.ts                # Utility functions
│   └── hooks/                      # Custom React hooks
├── mini-services/
│   └── realtime-service/           # WebSocket server
├── prisma/
│   └── schema.prisma               # Database schema
├── scripts/
│   └── seed-database.ts            # Sample data seeding
└── public/                         # Static assets
```

## 🗄️ Database Schema

The platform uses a comprehensive database schema with the following key models:

### Core Models
- **User** - Profiles, XP, levels, streaks
- **Module** - Learning modules (16 total)
- **Lesson** - Individual lessons within modules
- **Mission** - Interactive coding challenges
- **MissionAttempt** - User attempts and solutions

### Progress Tracking
- **UserProgress** - Module and lesson completion
- **Achievement** - Gamification achievements
- **UserAchievement** - Unlocked achievements

### Support Features
- **Hint** - Multi-level hint system
- **Tag** - Mission categorization
- **MiniProject** - Multi-mission projects

## 🎯 Learning Modules

1. **HTML Fundamentals** - Web structure and semantics
2. **CSS Styling** - Responsive design and layouts
3. **JavaScript Essentials** - Programming fundamentals
4. **React Components** - Modern UI development
5. **Backend Development** - Server-side programming
6. **Git & Version Control** - Code collaboration
7. **API Development** - RESTful services
8. **Authentication** - User management
9. **Database Design** - Data persistence
10. **Testing & QA** - Code quality
11. **DevOps** - Deployment pipelines
12. **Security** - Web security best practices
13. **Performance** - Optimization techniques
14. **System Design** - Architecture patterns
15. **Full-Stack Project** - Capstone project
16. **Career Development** - Professional skills

## 🔧 Getting Started

### Prerequisites
- Node.js 18+
- Bun package manager
- SQLite

### Installation

1. **Clone and setup:**
   ```bash
   cd /home/z/my-project
   bun install
   ```

2. **Setup database:**
   ```bash
   bun run db:push
   bun run scripts/seed-database.ts
   ```

3. **Start services:**
   ```bash
   # Start main app (runs on port 3000)
   bun run dev
   
   # Start realtime service (runs on port 3001)
   cd mini-services/realtime-service
   bun run dev
   ```

4. **Access the application:**
   - Main app: http://localhost:3000
   - Mobile interface: Automatically detected on mobile devices
   - Mission example: http://localhost:3000/mission/1

## 🎮 Mission System

### Mission Structure
Each mission includes:
- **Broken starter code** that needs fixing
- **Clear objectives** and instructions
- **Validation rules** for automatic checking
- **Progressive hints** (4 levels)
- **Point rewards** based on difficulty

### Validation Engine
The validation system uses:
- **Pattern matching** for required code elements
- **Forbidden patterns** to prevent bad practices
- **Execution testing** in sandboxed environments
- **Scoring algorithm** for partial credit

### Example Mission
The "Fix the Broken Button" mission teaches:
- DOM manipulation
- Event handling
- Conditional logic
- State management

## 📱 Mobile Experience

The platform features a dedicated mobile interface with:
- **Bottom navigation** for easy thumb access
- **Swipe gestures** for mission navigation
- **Offline support** for downloaded content
- **Touch-optimized** code editor
- **Progress sync** across devices

## 🤖 AI Mentor

The AI mentor provides:
- **Context-aware hints** based on user code
- **Explanations** tailored to skill level
- **Alternative approaches** to problems
- **Encouragement** and motivation

Integration uses the `z-ai-web-dev-sdk` LLM skill with:
- Custom prompts for programming education
- Code analysis capabilities
- Progressive hint generation

## 🔌 Real-time Features

WebSocket service enables:
- **Live mission collaboration**
- **Real-time progress updates**
- **Achievement notifications**
- **Leaderboard updates**
- **Streak tracking**

## 🏆 Gamification

### Progress System
- **XP points** for completed missions
- **Level progression** (100 XP per level)
- **Streak tracking** for daily engagement
- **Achievement badges** for milestones

### Achievements
- 🎯 First Steps - Complete first mission
- 🔥 Week Warrior - 7-day streak
- 🐛 Bug Hunter - Fix 10 bugs
- 👨‍💻 Code Master - Complete 50 missions

## 🚀 Deployment

### Production Build
```bash
bun run build
bun run start
```

### Environment Variables
```env
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 🔮 Future Features

### Planned Enhancements
- **Version Control Simulation** - Visual Git experience
- **Architecture Visualization** - System diagramming
- **Security Analyzer** - Code vulnerability scanning
- **Performance Profiler** - Optimization suggestions
- **Testing Simulator** - Unit test challenges
- **Career Mode** - Resume builder and interview prep

### Advanced Features
- **Multiplayer missions** - Collaborative coding
- **AI code reviewer** - Advanced feedback system
- **Custom mission creator** - User-generated content
- **Integration with real repos** - GitHub/GitLab sync
- **Voice guidance** - TTS for accessibility

## 📊 Analytics & Insights

The platform tracks:
- **Learning velocity** - Time per concept
- **Weak areas** - Struggle detection
- **Optimal paths** - Personalized curriculum
- **Engagement metrics** - Session analysis

## 🤝 Contributing

### Development Workflow
1. Create feature branch from main
2. Implement changes with tests
3. Run `bun run lint` for code quality
4. Test mobile responsiveness
5. Submit PR with description

### Code Standards
- TypeScript strict mode
- ESLint + Prettier formatting
- Component-based architecture
- Mobile-first responsive design

## 📄 License

This project is part of the Skillytics learning platform ecosystem.

## 🙏 Acknowledgments

Built with:
- Next.js 15 and modern web technologies
- shadcn/ui component library
- Monaco Editor for code editing
- Prisma for database management
- z-ai-web-dev-sdk for AI capabilities

---

**Skillytics - Where every line of code is a lesson learned.** 🚀