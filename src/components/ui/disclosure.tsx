/**
 * Disclosure: a section that opens and closes, e.g. "More detail (optional)" in a form. Built on base-ui Collapsible.
 * Use to tuck away optional or advanced content. Don't hide required fields or errors inside a closed Disclosure.
 */
import * as React from "react"
import { Collapsible } from "@base-ui/react/collapsible"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

function Disclosure({
  title,
  children,
  className,
  ...props
}: Omit<Collapsible.Root.Props, "title"> & { title: React.ReactNode }) {
  return (
    <Collapsible.Root data-slot="disclosure" className={cn("flex flex-col", className)} {...props}>
      <Collapsible.Trigger className="group/disclosure flex h-10 w-fit cursor-pointer items-center gap-2 rounded-pill pr-2 text-body-sm font-medium text-primary outline-none hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring">
        {title}
        <ChevronDown
          aria-hidden
          className="size-4 text-secondary transition-transform duration-fast ease-out group-data-panel-open/disclosure:rotate-180"
        />
      </Collapsible.Trigger>
      <Collapsible.Panel
        hiddenUntilFound
        className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-base ease-out data-ending-style:h-0 data-starting-style:h-0"
      >
        <div className="pt-3">{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  )
}

export { Disclosure }
