import { Sidebar, TopNavbar, Footer, ProtectedLayout } from '@/components/layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <TopNavbar />

        {/* Page content with smooth transitions */}
        <main className="flex-1 overflow-y-auto">
          <ProtectedLayout>
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
              {children}
            </div>
          </ProtectedLayout>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
