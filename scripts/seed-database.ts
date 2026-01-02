import { db } from '@/lib/db'

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create modules
    const modules = await Promise.all([
      db.module.create({
        data: {
          title: "HTML Fundamentals",
          description: "Master the building blocks of the web",
          order: 1,
          isUnlocked: true,
          icon: "🌐",
          color: "bg-orange-500",
          estimatedHours: 15
        }
      }),
      db.module.create({
        data: {
          title: "CSS Styling",
          description: "Create beautiful, responsive designs",
          order: 2,
          isUnlocked: true,
          icon: "🎨",
          color: "bg-blue-500",
          estimatedHours: 20
        }
      }),
      db.module.create({
        data: {
          title: "JavaScript Essentials",
          description: "Add interactivity and logic to your pages",
          order: 3,
          isUnlocked: true,
          icon: "⚡",
          color: "bg-yellow-500",
          estimatedHours: 25
        }
      }),
      db.module.create({
        data: {
          title: "React Components",
          description: "Build modern, component-based UIs",
          order: 4,
          isUnlocked: false,
          icon: "⚛️",
          color: "bg-cyan-500",
          estimatedHours: 30
        }
      }),
      db.module.create({
        data: {
          title: "Backend Development",
          description: "Create powerful server-side applications",
          order: 5,
          isUnlocked: false,
          icon: "🔧",
          color: "bg-green-500",
          estimatedHours: 35
        }
      })
    ])

    console.log('✅ Created 5 modules')

    // Create lessons for HTML module
    const htmlLessons = await Promise.all([
      db.lesson.create({
        data: {
          title: "HTML Structure & Semantics",
          description: "Learn the fundamental structure of HTML documents",
          content: JSON.stringify({
            topics: ["HTML5 elements", "Semantic markup", "Document structure"],
            objectives: ["Understand HTML document structure", "Use semantic elements correctly"]
          }),
          order: 1,
          moduleId: modules[0].id,
          difficulty: "beginner",
          estimatedMinutes: 30,
          isPublished: true
        }
      }),
      db.lesson.create({
        data: {
          title: "Forms & Input Elements",
          description: "Create interactive forms with various input types",
          content: JSON.stringify({
            topics: ["Form elements", "Input validation", "Form submission"],
            objectives: ["Build working forms", "Validate user input"]
          }),
          order: 2,
          moduleId: modules[0].id,
          difficulty: "beginner",
          estimatedMinutes: 45,
          isPublished: true
        }
      })
    ])

    // Create lessons for JavaScript module
    const jsLessons = await Promise.all([
      db.lesson.create({
        data: {
          title: "Variables & Data Types",
          description: "Understanding JavaScript variables and data types",
          content: JSON.stringify({
            topics: ["let, const, var", "Data types", "Type conversion"],
            objectives: ["Declare variables correctly", "Understand data types"]
          }),
          order: 1,
          moduleId: modules[2].id,
          difficulty: "beginner",
          estimatedMinutes: 40,
          isPublished: true
        }
      }),
      db.lesson.create({
        data: {
          title: "DOM Manipulation",
          description: "Interact with HTML elements using JavaScript",
          content: JSON.stringify({
            topics: ["Selecting elements", "Modifying content", "Event handling"],
            objectives: ["Manipulate DOM elements", "Handle user events"]
          }),
          order: 2,
          moduleId: modules[2].id,
          difficulty: "intermediate",
          estimatedMinutes: 60,
          isPublished: true
        }
      })
    ])

    console.log('✅ Created lessons')

    // Create missions
    const missions = await Promise.all([
      db.mission.create({
        data: {
          title: "Fix the Broken Button",
          description: "This button should toggle the visibility of the hidden message when clicked.",
          instructions: JSON.stringify([
            "The button should toggle between showing and hiding the message",
            "The message should start hidden",
            "Clicking the button multiple times should alternate between show/hide",
            "The button text should update to reflect the current action"
          ]),
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Broken Button</title>
    <style>
        .message { display: none; }
    </style>
</head>
<body>
    <button onclick="showMessage()">Show Message</button>
    <div id="secretMessage" class="message">
        <h3>🎉 Congratulations!</h3>
        <p>You've successfully toggled the message visibility!</p>
    </div>
    <script>
        function showMessage() {
            document.getElementById('secretMessage').style.display = 'block';
        }
    </script>
</body>
</html>`,
          solutionCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fixed Button</title>
    <style>
        .message { display: none; }
    </style>
</head>
<body>
    <button onclick="toggleMessage()">Toggle Message</button>
    <div id="secretMessage" class="message">
        <h3>🎉 Congratulations!</h3>
        <p>You've successfully toggled the message visibility!</p>
    </div>
    <script>
        function toggleMessage() {
            const message = document.getElementById('secretMessage');
            const button = document.querySelector('button');
            
            if (message.style.display === 'block') {
                message.style.display = 'none';
                button.textContent = 'Show Message';
            } else {
                message.style.display = 'block';
                button.textContent = 'Hide Message';
            }
        }
    </script>
</body>
</html>`,
          validationRules: JSON.stringify({
            requiredPatterns: [
              { pattern: "if.*else", description: "Use conditional logic", points: 30 },
              { pattern: "style.display", description: "Check display property", points: 30 },
              { pattern: "display.*=.*'block'", description: "Set display to block", points: 20 },
              { pattern: "display.*=.*'none'", description: "Set display to none", points: 20 }
            ],
            minScore: 80
          }),
          hints: JSON.stringify([
            {
              level: 1,
              title: "Think about the current state",
              content: "You need to check if the message is currently visible or hidden before deciding what to do."
            },
            {
              level: 2,
              title: "Use a conditional statement",
              content: "An if/else statement can help you check the current display property and toggle it accordingly."
            },
            {
              level: 3,
              title: "Check the display style",
              content: "You can check `element.style.display === 'block'` to see if it's visible."
            },
            {
              level: 4,
              title: "Complete solution approach",
              content: "Get the element, check if display is 'block', then set it to 'none' or 'block' accordingly. Also update the button text!"
            }
          ]),
          lessonId: jsLessons[1].id,
          order: 1,
          difficulty: "beginner",
          points: 10,
          timeLimit: 15,
          isPublished: true
        }
      }),
      db.mission.create({
        data: {
          title: "Create a Form Validator",
          description: "Build a form that validates user input in real-time",
          instructions: JSON.stringify([
            "Validate email format using regex",
            "Check if password is at least 8 characters",
            "Show error messages for invalid input",
            "Prevent form submission if validation fails"
          ]),
          starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Form Validation</title>
</head>
<body>
    <form id="myForm">
        <input type="email" id="email" placeholder="Email">
        <input type="password" id="password" placeholder="Password">
        <button type="submit">Submit</button>
    </form>
    <script>
        // Add your validation logic here
    </script>
</body>
</html>`,
          validationRules: JSON.stringify({
            requiredPatterns: [
              { pattern: "addEventListener.*submit", description: "Handle form submission", points: 25 },
              { pattern: "preventDefault", description: "Prevent default submission", points: 25 },
              { pattern: "test\\(", description: "Use regex testing", points: 25 },
              { pattern: "length.*>", description: "Check string length", points: 25 }
            ],
            minScore: 75
          }),
          hints: JSON.stringify([
            {
              level: 1,
              title: "Event Handling",
              content: "Use addEventListener to handle the form's submit event."
            },
            {
              level: 2,
              title: "Prevent Default",
              content: "Call preventDefault() to stop the form from submitting normally."
            },
            {
              level: 3,
              title: "Email Validation",
              content: "Use a regex pattern like /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ to validate email format."
            }
          ]),
          lessonId: htmlLessons[1].id,
          order: 1,
          difficulty: "intermediate",
          points: 15,
          timeLimit: 20,
          isPublished: true
        }
      })
    ])

    console.log('✅ Created missions')

    // Create achievements
    const achievements = await Promise.all([
      db.achievement.create({
        data: {
          title: "First Steps",
          description: "Complete your first mission",
          icon: "🎯",
          points: 5,
          condition: JSON.stringify({ type: "mission_count", value: 1 })
        }
      }),
      db.achievement.create({
        data: {
          title: "Week Warrior",
          description: "Maintain a 7-day streak",
          icon: "🔥",
          points: 20,
          condition: JSON.stringify({ type: "streak", value: 7 })
        }
      }),
      db.achievement.create({
        data: {
          title: "Bug Hunter",
          description: "Fix 10 bugs in missions",
          icon: "🐛",
          points: 50,
          condition: JSON.stringify({ type: "mission_count", value: 10 })
        }
      }),
      db.achievement.create({
        data: {
          title: "Code Master",
          description: "Complete 50 missions",
          icon: "👨‍💻",
          points: 100,
          condition: JSON.stringify({ type: "mission_count", value: 50 })
        }
      })
    ])

    console.log('✅ Created achievements')

    // Create sample user
    const user = await db.user.create({
      data: {
        email: "demo@skillytics.com",
        name: "Demo User",
        level: 1,
        xp: 45,
        streak: 7,
        totalMissions: 12,
        completedMissions: 12
      }
    })

    console.log('✅ Created sample user')

    // Create user progress
    await Promise.all([
      db.userProgress.create({
        data: {
          userId: user.id,
          moduleId: modules[0].id,
          status: "completed",
          progress: 100,
          timeSpent: 3600
        }
      }),
      db.userProgress.create({
        data: {
          userId: user.id,
          moduleId: modules[2].id,
          status: "in_progress",
          progress: 30,
          timeSpent: 1800
        }
      })
    ])

    console.log('✅ Created user progress')

    // Create some tags
    const tags = await Promise.all([
      db.tag.create({ data: { name: "javascript" } }),
      db.tag.create({ data: { name: "html" } }),
      db.tag.create({ data: { name: "css" } }),
      db.tag.create({ data: { name: "dom" } }),
      db.tag.create({ data: { name: "forms" } })
    ])

    console.log('✅ Created tags')

    // Associate tags with missions
    await Promise.all([
      db.missionTag.create({
        data: { missionId: missions[0].id, tagId: tags[0].id }
      }),
      db.missionTag.create({
        data: { missionId: missions[0].id, tagId: tags[3].id }
      }),
      db.missionTag.create({
        data: { missionId: missions[1].id, tagId: tags[1].id }
      }),
      db.missionTag.create({
        data: { missionId: missions[1].id, tagId: tags[4].id }
      })
    ])

    console.log('✅ Associated tags with missions')

    console.log('🎉 Database seeding completed successfully!')
    console.log(`
    Sample Data Created:
    - 5 Modules
    - 4 Lessons  
    - 2 Missions
    - 4 Achievements
    - 1 User (demo@skillytics.com)
    - 2 User Progress records
    - 5 Tags
    `)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

// Run the seeding function
seedDatabase().catch(console.error)