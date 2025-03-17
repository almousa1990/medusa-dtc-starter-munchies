"use client";

import LocalizedLink from "@/components/shared/localized-link";
import {cx} from "cva";
import Link from "next/link";
import {useParams, usePathname} from "next/navigation";

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
  const {countryCode} = useParams();

  return (
    <nav
      className={cx(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <LocalizedLink
          className={cx(
            pathname === item.href
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
