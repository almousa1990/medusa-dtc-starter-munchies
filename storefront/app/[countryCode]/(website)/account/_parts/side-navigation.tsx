"use client";

import LocalizedLink from "@/components/shared/localized-link";
import {buttonVariants} from "@merchify/ui";
import {cx} from "cva";
import {usePathname} from "next/navigation";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export default function SideNavigation({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cx(
        "flex gap-2 overflow-x-auto whitespace-nowrap lg:flex-col lg:gap-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <LocalizedLink
          className={cx(
            buttonVariants({variant: "ghost"}),
            pathname.startsWith(item.href)
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
          href={item.href}
          key={item.href}
        >
          {item.title}
        </LocalizedLink>
      ))}
    </nav>
  );
}
