import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default", // default | outline | ghost | destructive
      size = "default",    // default | sm | icon
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          // 🎨 Variants
          {
            // زر عادي أزرق
            "bg-blue-600 text-white hover:bg-blue-700":
              variant === "default",

            // زر حذف موحّد أحمر بكل السيستم
            "bg-red-600 text-white hover:bg-red-700 shadow-sm":
              variant === "destructive",

            // outline
            "border border-gray-300 bg-white hover:bg-gray-50":
              variant === "outline",

            // ghost
            "hover:bg-gray-100": variant === "ghost",
          },
          // الأحجام
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-8 rounded-md px-2": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
          