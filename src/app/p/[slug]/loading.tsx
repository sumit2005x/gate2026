export default function ProductLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-paper animate-pulse">
      {/* Top placeholder bar */}
      <div className="border-b border-rule bg-paper-2/40 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-4 w-40 bg-rule/70 rounded" />
          <div className="h-4 w-16 bg-rule/70 rounded" />
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 w-full pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Visual Gallery Skeleton */}
          <div className="lg:col-span-7 space-y-6">
            {/* Mobile Header Skeleton */}
            <div className="lg:hidden space-y-3 pb-6 border-b border-rule">
              <div className="h-5 w-48 bg-rule/80 rounded-full" />
              <div className="h-8 w-3/4 bg-rule/80 rounded" />
              <div className="h-4 w-full bg-rule/60 rounded" />
              <div className="h-8 w-28 bg-rule/80 rounded" />
              <div className="h-12 w-full bg-rule/80 rounded-xl" />
            </div>

            {/* Main Cover Placeholder */}
            <div className="aspect-[4/5] max-w-lg mx-auto rounded-2xl bg-paper-2 border border-rule flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              <span className="text-xs font-mono text-muted">
                Opening GATE CSE material...
              </span>
            </div>

            {/* Thumbnails Placeholder */}
            <div className="flex justify-center gap-3 py-2">
              <div className="w-16 h-20 rounded-lg bg-paper-2 border border-rule" />
              <div className="w-16 h-20 rounded-lg bg-paper-2 border border-rule" />
              <div className="w-16 h-20 rounded-lg bg-paper-2 border border-rule" />
            </div>

            {/* Description Skeleton */}
            <div className="space-y-4 pt-6 border-t border-rule">
              <div className="h-6 w-52 bg-rule/80 rounded" />
              <div className="h-32 w-full bg-paper-2/60 rounded-2xl border border-rule" />
            </div>
          </div>

          {/* Right Column: Desktop Title & Checkout Box Skeleton */}
          <div className="hidden lg:block lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="h-5 w-52 bg-rule/80 rounded-full" />
              <div className="h-10 w-4/5 bg-rule/80 rounded" />
              <div className="h-4 w-full bg-rule/60 rounded" />
            </div>

            {/* Checkout Card Skeleton */}
            <div className="bg-paper-2 rounded-2xl border border-rule p-6 space-y-5">
              <div className="flex justify-between items-center pb-4 border-b border-rule">
                <div className="h-5 w-32 bg-rule/80 rounded" />
                <div className="h-5 w-20 bg-rule/80 rounded" />
              </div>
              <div className="h-8 w-24 bg-rule/80 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-28 bg-rule/60 rounded" />
                <div className="h-10 w-full bg-paper rounded-xl border border-rule" />
              </div>
              <div className="h-12 w-full bg-rule/90 rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
