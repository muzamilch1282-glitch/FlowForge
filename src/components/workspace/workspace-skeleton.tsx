export function WorkspaceSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-muted"></div>
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-muted"></div>
            <div className="h-4 w-48 rounded bg-muted/50"></div>
          </div>
        </div>
        <div className="h-8 w-8 rounded-md bg-muted"></div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div className="h-4 w-24 rounded bg-muted"></div>
        <div className="h-4 w-24 rounded bg-muted"></div>
      </div>
    </div>
  );
}
