import React from "react";
import {
  Tabs as UITabs,
  TabsList as UITabsList,
  TabsTrigger as UITabsTrigger,
  TabsContent as UITabsContent,
  cn,
} from "@merchify/ui";

const Tabs = React.forwardRef<
  React.ComponentRef<typeof UITabs>,
  React.ComponentPropsWithoutRef<typeof UITabs>
>(({className, ...props}, ref) => (
  <UITabs
    dir="rtl"
    ref={ref}
    className={cn("grid gap-2", className)}
    {...props}
  />
));

const TabsList = React.forwardRef<
  React.ElementRef<typeof UITabsList>,
  React.ComponentPropsWithoutRef<typeof UITabsList>
>(({className, ...props}, ref) => (
  <UITabsList
    ref={ref}
    className={cn(
      "bg-background scrollbar-hide flex w-full justify-start gap-2 overflow-x-auto",
      className,
    )}
    {...props}
  />
));

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof UITabsTrigger>,
  React.ComponentPropsWithoutRef<typeof UITabsTrigger>
>(({className, ...props}, ref) => (
  <UITabsTrigger
    ref={ref}
    className={cn(
      "bg-secondary text-secondary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 data-[state=active]:shadow-none",
      className,
    )}
    {...props}
  />
));

const TabsContent = UITabsContent;

export {Tabs, TabsList, TabsTrigger, TabsContent};
