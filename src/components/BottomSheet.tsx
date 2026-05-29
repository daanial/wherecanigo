import type { ReactNode } from 'react'

interface BottomSheetProps {
  children: ReactNode
}

/** Mobile-only wrapper: controls sit in a bottom sheet; map stays full-bleed */
export function BottomSheet({ children }: BottomSheetProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="max-h-[45vh] overflow-y-auto border-t border-border bg-paper-raised/95 px-4 pb-4 pt-3 shadow-lg backdrop-blur-sm">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" aria-hidden />
        {children}
      </div>
    </div>
  )
}
