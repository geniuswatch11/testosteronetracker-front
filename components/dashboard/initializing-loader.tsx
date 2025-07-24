import { Logo } from "@/components/ui/logo"

export function InitializingLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center space-y-4">
        <Logo width={80} height={80} className="animate-pulse" />
        <h2 className="text-2xl font-bold">GENIUS TESTOSTERONE</h2>
        <div className="mt-4 flex flex-col items-center">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 animate-[loading_1s_ease-in-out_infinite] rounded-full bg-primary"></div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    </div>
  )
}

// Definir la animación en globals.css
