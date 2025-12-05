import * as React from "react"
import { cn } from "../../lib/utils"

const Form = ({ className, ...props }) => {
  return <form className={cn("space-y-6", className)} {...props} />
}

const FormField = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />
})
FormField.displayName = "FormField"

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  return <label ref={ref} className={cn("text-sm font-medium", className)} {...props} />
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("mt-1", className)} {...props} />
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-slate-600", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-red-600", className)}
      {...props}
    >
      {children}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}