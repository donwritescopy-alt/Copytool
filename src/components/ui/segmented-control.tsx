/**
 * SegmentedControl: choose exactly one of 2–4 short options (e.g. narrative stance). Built on base-ui RadioGroup,
 * so it has radio semantics, arrow-key navigation and submits with a form via `name`.
 * Don't use for 5+ options (Select) or for switching page sections (Dock / tabs).
 */
import { Radio } from "@base-ui/react/radio"
import { RadioGroup } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

function SegmentedControl({ className, ...props }: RadioGroup.Props) {
  return (
    <RadioGroup
      data-slot="segmented-control"
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-pill border border-subtle bg-input-bg p-1 data-disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
}

function SegmentedControlItem({ className, ...props }: Radio.Root.Props) {
  return (
    <Radio.Root
      data-slot="segmented-control-item"
      className={cn(
        "inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-pill px-4 text-label font-medium text-secondary transition-[background-color,color,box-shadow] duration-fast ease-out outline-none select-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring data-checked:bg-surface-solid data-checked:text-primary data-checked:shadow-raised data-disabled:cursor-not-allowed data-disabled:text-tertiary [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

export { SegmentedControl, SegmentedControlItem }
