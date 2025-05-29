import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-center">Overview</h1>

      {/* Stepper Skeleton */}
      <div className="w-full max-w-3xl mx-auto px-4">
        <Skeleton className="h-20 w-full" />
      </div>

      {/* Testosterone Value Skeleton */}
      <div className="text-center space-y-4">
        <div>
          <Skeleton className="h-4 w-48 mx-auto mb-2" />
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
        <Skeleton className="h-10 w-64 mx-auto" />
      </div>

      {/* Chart Skeletons */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>

      {/* Health Stats Grid Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-muted/50 p-4 rounded-lg">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  )
}
