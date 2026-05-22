import { Skeleton } from "@/components/ui/skeleton";

export default function LinkAnalyticsLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="mt-1 h-4 w-40" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Skeleton className="h-80 rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
