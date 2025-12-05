import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef(({ children, ...props }, ref) => {
  return <select ref={ref} {...props}>{children}</select>
})
Select.displayName = "Select"

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
    </div>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef(({ className, ...props }, ref) => {
  return <span ref={ref} className={cn("block", className)} {...props} />
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("hidden", className)} {...props} />
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <option
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </option>
  )
})
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}