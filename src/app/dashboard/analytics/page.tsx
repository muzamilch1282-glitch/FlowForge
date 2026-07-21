import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { BarChart3, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analytics',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Insights and performance metrics for your workspace."
      >
        <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </PageHeader>

      <EmptyState
        icon={BarChart3}
        title="No data yet"
        description="Analytics will appear once you have projects and tasks with activity."
      />
    </div>
  );
}
