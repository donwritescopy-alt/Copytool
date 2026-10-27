/**
 * Select: pick one option from a list of 5+ (e.g. writer persona, channel). Built on base-ui Select.
 * Pass `items` to Select so the trigger shows labels, not raw values. Pass `name` to submit with a form.
 * Don't use for 2–4 options (SegmentedControl) or free text (Input).
 */
import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

function SelectLabel({ className, ...props }: SelectPrimitive.Label.Props) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-label leading-none font-medium text-primary", className)}
      {...props}
    />
  )
}

function SelectTrigger({ className, children, ...props }: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-11 w-full min-w-40 cursor-pointer items-center justify-between gap-3 rounded-field border border-subtle bg-input-bg pr-3 pl-4 text-body-sm text-primary transition-[background-color] duration-fast ease-out outline-none select-none hover:bg-surface-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring data-popup-open:bg-surface-solid data-disabled:cursor-not-allowed data-disabled:bg-surface-muted data-disabled:text-tertiary aria-invalid:border-danger",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="text-secondary transition-transform duration-fast ease-out data-popup-open:rotate-180">
        <ChevronDown className="size-4" aria-hidden />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("truncate data-placeholder:text-secondary", className)}
      {...props}
    />
  )
}

function SelectContent({
  className,
  children,
  sideOffset = 6,
  ...props
}: SelectPrimitive.Popup.Props & Pick<SelectPrimitive.Positioner.Props, "sideOffset">) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner className="z-50 outline-none select-none" sideOffset={sideOffset} alignItemWithTrigger={false}>
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "min-w-(--anchor-width) origin-(--transform-origin) rounded-panel border border-subtle bg-surface-solid p-1.5 text-body-sm text-primary shadow-card outline-none transition-[opacity,scale] duration-fast ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0",
            className
          )}
          {...props}
        >
          <SelectPrimitive.List className="max-h-(--available-height) overflow-y-auto">{children}</SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "grid cursor-pointer grid-cols-[1fr_1rem] items-center gap-3 rounded-tight px-3 py-2.5 outline-none select-none data-disabled:cursor-not-allowed data-disabled:text-tertiary data-highlighted:bg-surface-muted",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" aria-hidden />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export { Select, SelectLabel, SelectTrigger, SelectValue, SelectContent, SelectItem }
