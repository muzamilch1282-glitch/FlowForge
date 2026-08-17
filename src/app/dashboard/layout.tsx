import { Sidebar, TopNavbar, Footer, ProtectedLayout } from '@/components/layout';
import { RealtimeProvider } from '@/components/realtime/RealtimeProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RealtimeProvider>
      <ProtectedLayout>
        <div className="flex h-[100dvh] overflow-hidden bg-background">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Top navbar */}
            <TopNavbar />

            {/* Page content with smooth transitions */}
            <main className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8 h-full">
                {children}
              </div>
            </main>

          </div>
        </div>
      </ProtectedLayout>
    </RealtimeProvider>
  );
}
