
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const CheckboxItem = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-primary-foreground")}
    >
      <Check className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
CheckboxItem.displayName = "Checkbox"

// Export both the original name and the new name for backward compatibility
const Checkbox = CheckboxItem;

// Create a CheckboxGroup component to contain multiple checkboxes
interface CheckboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string[];
  onValueChange: (value: string[]) => void;
  className?: string;
}

const CheckboxGroup = React.forwardRef<
  HTMLDivElement,
  CheckboxGroupProps
>(({ value, onValueChange, className, children, ...props }, ref) => {
  // Create a context to manage checkbox group state
  const CheckboxGroupContext = React.createContext<{
    value: string[];
    onValueChange: (value: string[]) => void;
  }>({
    value: [],
    onValueChange: () => {},
  });

  return (
    <CheckboxGroupContext.Provider value={{ value, onValueChange }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          
          // Add the CheckboxGroupContext to the child props
          return React.cloneElement(child);
        })}
      </div>
    </CheckboxGroupContext.Provider>
  );
});
CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxItem, CheckboxGroup }
