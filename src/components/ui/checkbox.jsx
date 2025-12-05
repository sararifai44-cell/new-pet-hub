import * as React from "react"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }