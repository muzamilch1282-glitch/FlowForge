import { LoadingSpinner } from '@/components/shared/loading-spinner';

export default function DashboardLoading() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
