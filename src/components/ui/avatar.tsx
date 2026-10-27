/**
 * Avatar: circle showing the user's photo, falling back to their initials.
 * Use next to a person's name (AppHeader, member lists). Don't use as a decorative icon.
 */
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@/lib/utils"

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?"
}

function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string
  src?: string | null
  size?: "sm" | "md"
  className?: string
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-pill bg-accent font-medium text-on-accent select-none",
        size === "sm" ? "size-8 text-caption" : "size-10 text-label",
        className
      )}
    >
      {src && <AvatarPrimitive.Image src={src} alt="" className="size-full object-cover" />}
      <AvatarPrimitive.Fallback aria-hidden>{initials(name)}</AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}

export { Avatar, initials }
