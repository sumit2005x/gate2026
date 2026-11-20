export default function RootLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
      {/* Subtle loader pill */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-rule bg-paper-2 shadow-xs">
        <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-muted tracking-wide">
          Loading material...
        </span>
      </div>
    </div>
  );
}
