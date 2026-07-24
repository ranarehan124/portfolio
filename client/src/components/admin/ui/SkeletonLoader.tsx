import { cn } from '@/utils/helpers';

export function SkeletonLine({ width = '100%', className }: { width?: string; className?: string }) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{ width, height: '1em' }}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-white/[0.08]',
        'bg-[#0a0a0a]/80 p-5',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <SkeletonLine width="40%" />
          <SkeletonLine width="70%" className="h-7" />
          <SkeletonLine width="50%" />
        </div>
        <div className="skeleton ml-4 h-11 w-11 shrink-0 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-white/[0.08]',
        'bg-[#0a0a0a]/80',
      )}
    >
      {/* Header */}
      <div className="flex gap-4 border-b border-white/[0.06] px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1">
            <SkeletonLine width="60%" className="h-3" />
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 border-b border-white/[0.04] px-4 py-3 last:border-b-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="flex-1">
              <SkeletonLine width={c === 0 ? '80%' : '60%'} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}