import { Skeleton } from "@/components/ui/skeleton";

interface LoadingProps {
  type?: "page" | "card" | "inline";
  text?: string;
}

export const Loading = ({
  type = "page",
  text = "Loading...",
}: LoadingProps) => {
  if (type === "inline") {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">{text}</span>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  // Full page loading
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{text}</h2>
          <p className="text-muted-foreground">
            Please wait while we load your content
          </p>
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </div>
    </div>
  );
};
