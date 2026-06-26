"use client";

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled route error boundary:', error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center bg-paper">
      <h1 className="text-2xl font-serif font-bold text-foreground">Something went wrong</h1>
      <p className="text-muted-foreground text-sm max-w-md">
        {error.message || 'An unexpected server or runtime error occurred.'}
      </p>
      <button
        onClick={reset}
        className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/95 transition-colors cursor-pointer"
      >
        Try again
      </button>
    </main>
  );
}
