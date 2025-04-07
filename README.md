# FitMate AI - Personal Fitness Coach

FitMate AI is a personalized AI fitness coaching platform that creates custom workout plans based on user health metrics, adapts dynamically with user progress, and supports diverse fitness goals.

## Features

- 🧠 **AI-Powered Workout Plans**: Generate personalized workout routines based on your goals, fitness level, and preferences
- 🔄 **Dynamic Plan Adaptation**: Workout plans adapt based on your progress, feedback, and performance
- 🏋️‍♀️ **Multiple Fitness Goals**: Support for weight loss, muscle gain, endurance, and flexibility training
- 💬 **AI Coach**: Chat interface for continuous interaction, recommendations, and plan tweaks

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Python (Flask) - Coming soon
- **AI/ML Engine**: Google Gemini - Coming soon
- **Database**: MongoDB - Coming soon
- **Authentication**: JWT Email authentication - Coming soon

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/fitmate-ai.git
cd fitmate-ai
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

```
fitmate-ai/
├── app/                    # Next.js app directory
│   ├── auth/               # Authentication routes
│   ├── dashboard/          # Dashboard routes
│   └── api/                # API routes
├── components/             # React components
│   ├── ui/                 # UI components from shadcn
│   ├── dashboard/          # Dashboard components
│   ├── onboarding/         # Onboarding flow components
│   └── workout/            # Workout-related components
├── lib/                    # Utility functions and hooks
├── public/                 # Static assets
└── styles/                 # Global styles
```

## Current Status

This project is in development stage with the frontend MVP in progress.

## Roadmap

- Backend API integration
- AI model integration
- Data persistence
- Authentication system
- User profile management
- Progress tracking and analytics
- Mobile responsiveness optimization
- Wearable device integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.
