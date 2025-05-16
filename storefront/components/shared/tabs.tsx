import {
  Tabs as UITabs,
  TabsContent as UITabsContent,
  TabsList as UITabsList,
  TabsTrigger as UITabsTrigger,
  cn,
} from "@merchify/ui";
import React from "react";

const Tabs = React.forwardRef<
  React.ComponentRef<typeof UITabs>,
  React.ComponentPropsWithoutRef<typeof UITabs>
>(({className, ...props}, ref) => (
  <UITabs
    className={cn("grid gap-2", className)}
    dir="rtl"
    ref={ref}
    {...props}
  />
));

Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  React.ComponentRef<typeof UITabsList>,
  React.ComponentPropsWithoutRef<typeof UITabsList>
>(({className, ...props}, ref) => (
  <UITabsList
    className={cn(
      "bg-background scrollbar-hide flex w-full justify-start gap-2 overflow-x-auto",
      className,
    )}
    ref={ref}
    {...props}
  />
));

TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof UITabsTrigger>,
  React.ComponentPropsWithoutRef<typeof UITabsTrigger>
>(({className, ...props}, ref) => (
  <UITabsTrigger
    className={cn(
      "hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:hover:bg-secondary/80 gap-2 data-[state=active]:shadow-none",
      className,
    )}
    ref={ref}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = UITabsContent;

export {Tabs, TabsContent, TabsList, TabsTrigger};
