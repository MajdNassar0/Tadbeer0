export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded-3xl ${className}`} />
);

export const ProjectCardSkeleton = () => (
  <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
    <Skeleton className="h-52 w-full rounded-none" />
    <div className="p-4 space-y-2 bg-white">
      <Skeleton className="h-4 w-3/4 rounded-xl" />
      <Skeleton className="h-3 w-1/2 rounded-xl" />
    </div>
  </div>
);