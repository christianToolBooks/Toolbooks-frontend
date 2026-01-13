"use client";

export function SavedCardSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative rounded-2xl p-6 shadow-xl aspect-[1.586/1] bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] animate-[pulse_1.5s_ease-in-out_infinite]" />
        <div className="absolute top-6 right-6">
          <div className="h-8 w-16 rounded-md bg-white/10 animate-pulse" />
        </div>
        <div className="mt-8 mb-8">
          <div className="h-12 w-16 rounded-md bg-white/10 animate-pulse" />
        </div>
        <div className="mb-6 space-y-2">
          <div className="h-5 w-64 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-28 bg-white/20 rounded animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-14 bg-white/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
