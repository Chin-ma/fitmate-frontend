import { OnboardingForm } from '@/components/onboarding/onboarding-form';
import { Header } from '@/components/header';

export default function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-muted">
        <OnboardingForm />
      </main>
    </div>
  );
} 