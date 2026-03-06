export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-5 w-48 bg-[#e8ecf1] rounded" />
        <div className="h-3 w-72 bg-[#e8ecf1] rounded" />
      </div>

      {/* Card skeleton */}
      <div className="bg-white rounded-xl border border-[#e8ecf1] p-6 space-y-4">
        <div className="h-4 w-36 bg-[#e8ecf1] rounded" />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-[#e8ecf1] rounded" />
            <div className="h-9 bg-[#e8ecf1] rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-[#e8ecf1] rounded" />
            <div className="h-9 bg-[#e8ecf1] rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-[#e8ecf1] rounded" />
            <div className="h-9 bg-[#e8ecf1] rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-[#e8ecf1] rounded" />
            <div className="h-9 bg-[#e8ecf1] rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-[#e8ecf1] rounded" />
            <div className="h-20 bg-[#e8ecf1] rounded-lg" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-[#e8ecf1] rounded" />
            <div className="h-20 bg-[#e8ecf1] rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
