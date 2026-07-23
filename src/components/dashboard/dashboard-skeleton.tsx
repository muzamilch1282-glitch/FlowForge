import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-md bg-muted"></div>
          <div className="h-4 w-64 rounded-md bg-muted"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-10 w-full sm:w-64 rounded-md bg-muted"></div>
          <div className="h-10 w-full sm:w-32 rounded-md bg-muted"></div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-card border border-border p-5">
            <div className="flex justify-between">
              <div className="space-y-3">
                <div className="h-4 w-20 rounded bg-muted"></div>
                <div className="h-8 w-16 rounded bg-muted"></div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted"></div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-3 w-12 rounded bg-muted"></div>
              <div className="h-3 w-16 rounded bg-muted"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Projects Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 rounded bg-muted"></div>
            <div className="h-4 w-16 rounded bg-muted"></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-card border border-border p-5">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 rounded bg-muted"></div>
                    <div className="h-4 w-full rounded bg-muted"></div>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="h-2 w-full rounded bg-muted"></div>
                </div>
                <div className="mt-6 flex justify-between">
                  <div className="h-4 w-24 rounded bg-muted"></div>
                  <div className="flex -space-x-2">
                    <div className="h-7 w-7 rounded-full bg-muted border-2 border-card"></div>
                    <div className="h-7 w-7 rounded-full bg-muted border-2 border-card"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="h-[280px] rounded-xl bg-card border border-border p-6">
            <div className="h-5 w-32 rounded bg-muted mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-full rounded bg-muted"></div>
                    <div className="h-3 w-20 rounded bg-muted"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[280px] rounded-xl bg-card border border-border p-6">
            <div className="h-5 w-32 rounded bg-muted mb-6"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 w-full rounded-lg bg-muted border border-border"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
