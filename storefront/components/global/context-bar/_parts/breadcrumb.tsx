import LocalizedLink from "@/components/shared/localized-link";
import {
  Breadcrumb as UIBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@merchify/ui";
import {ChevronLeft} from "lucide-react";
import {Fragment} from "react";

export function Breadcrumb({
  items,
}: {
  items: {
    label: string;
    href?: string;
  }[];
}) {
  return (
    <UIBreadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <LocalizedLink href="/">المنتجات</LocalizedLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronLeft />
        </BreadcrumbSeparator>
        {items.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <LocalizedLink href={item.href}>{item.label}</LocalizedLink>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {index !== items.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronLeft />
              </BreadcrumbSeparator>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </UIBreadcrumb>
  );
}
