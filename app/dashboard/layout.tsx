import { Sidebar } from '@/components/dashboard/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <main className="flex min-h-screen flex-col md:pl-72">
        <div className="flex-1">
          <div className="container py-6 md:py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 