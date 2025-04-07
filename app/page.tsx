import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background -z-10" />
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-6">
                Your Personal AI Fitness Coach
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Get personalized workout plans, adapt your training dynamically, and achieve your fitness goals with FitMate AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="min-w-[200px]">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="min-w-[200px]">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-muted/50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Features
              </h2>
              <p className="text-xl text-muted-foreground">
                FitMate AI delivers a comprehensive fitness experience to help you reach your goals
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div 
                  key={feature.title} 
                  className="group flex flex-col items-center text-center p-6 rounded-xl bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300 mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Goals Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Achieve Your Fitness Goals
              </h2>
              <p className="text-xl text-muted-foreground">
                Specialized plans for any fitness objective
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {goals.map((goal) => (
                <div 
                  key={goal.title} 
                  className="group bg-background p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <h3 className="text-xl font-bold mb-4">{goal.title}</h3>
                  <p className="text-muted-foreground">{goal.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-muted/50">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Ready to Transform Your Fitness Journey?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of users who have already achieved their fitness goals with FitMate AI
              </p>
              <Link href="/auth/register" className="inline-block">
                <Button size="lg" className="min-w-[200px]">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FitMate AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature data
const features = [
  {
    title: "Personalized Plans",
    description: "AI-generated workout plans based on your goals, fitness level, and preferences",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  },
  {
    title: "Adaptive Training",
    description: "Smart workouts that adjust based on your progress, feedback, and performance",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 2v20"></path><path d="m17 5-5-3-5 3"></path><path d="m17 19-5 3-5-3"></path><path d="M22 12h-4"></path><path d="M6 12H2"></path><path d="m4.93 19.07 2.83-2.83"></path><path d="m16.24 7.76 2.83-2.83"></path><path d="m4.93 5 2.83 2.8"></path><path d="m16.24 16.2 2.83 2.8"></path></svg>
  },
  {
    title: "Multiple Goals",
    description: "Specialized routines for weight loss, muscle gain, endurance, and flexibility",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
  },
  {
    title: "AI Assistant",
    description: "Interactive chat interface to modify plans, get advice, and stay motivated",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
  }
];

// Goals data
const goals = [
  { 
    title: "Weight Loss",
    description: "High-calorie burn routines with interval training to maximize fat loss"
  },
  {
    title: "Muscle Gain",
    description: "Hypertrophy-focused programs with progressive overload principles"
  },
  {
    title: "Endurance",
    description: "Combined aerobic and anaerobic training to improve stamina and performance"
  },
  {
    title: "Flexibility",
    description: "Yoga-inspired routines with dynamic and static stretching for mobility"
  }
];
