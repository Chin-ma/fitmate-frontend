# FitMate AI - Personal Fitness Coach

FitMate AI is a personalized AI fitness coaching platform that creates custom workout plans based on user health metrics, adapts dynamically with user progress, and supports diverse fitness goals.

## Features

- 🧠 **AI-Powered Workout Plans**: Generate personalized workout routines based on your goals, fitness level, and preferences
- 🔄 **Dynamic Plan Adaptation**: Workout plans adapt based on your progress, feedback, and performance
- 🏋️‍♀️ **Multiple Fitness Goals**: Support for weight loss, muscle gain, endurance, and flexibility training
- 💬 **AI Coach**: Chat interface for continuous interaction, recommendations, and plan tweaks
- 🍽️ **Food Analysis**: Analyze your meals using Google's Gemini AI

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
- Google Gemini API key (for food analysis features)

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

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

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

## Food Analysis Feature

The Food Analysis feature uses Google's Gemini AI to analyze photos of your meals and provide:

- Total calories
- Breakdown of individual food items
- Nutritional content (protein, carbs, fat)
- Overall nutritional analysis

To use this feature:
1. Navigate to the "Daily Update" section in the sidebar
2. Select the "Food Analysis" tab
3. Upload a clear photo of your meal
4. Click "Analyze Food"

For best results:
- Use good lighting
- Take photos from above
- Make sure all food items are visible
- Use a plain background if possible

## License

This project is licensed under the MIT License - see the LICENSE file for details.
