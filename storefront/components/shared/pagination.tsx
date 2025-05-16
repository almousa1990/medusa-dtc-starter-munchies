"use client";

import {cn} from "@merchify/ui";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

import {Cta} from "./button";

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper function to generate an array of numbers within a range
  const arrayRange = (start: number, stop: number) =>
    Array.from({length: stop - start + 1}, (_, index) => start + index);

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Function to render a page button
  const renderPageButton = (
    p: number,
    label: number | string,
    isCurrent: boolean,
  ) => (
    <Cta
      className={cn("px-4", {"pointer-events-none": isCurrent})}
      key={p}
      onClick={() => handlePageChange(p)}
      size={"sm"}
      variant={isCurrent ? "default" : "ghost"}
    >
      {label}
    </Cta>
  );

  // Function to render ellipsis
  const renderEllipsis = (key: string) => (
    <Cta disabled key={key} variant="ghost">
      ...
    </Cta>
  );

  // Function to render page buttons based on the current page and total pages
  const renderPageButtons = () => {
    const buttons = [];

    if (totalPages <= 7) {
      // Show all pages
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page),
        ),
      );
    } else {
      // Handle different cases for displaying pages and ellipses
      if (page <= 4) {
        // Show 1, 2, 3, 4, 5, ..., lastpage
        buttons.push(
          ...arrayRange(1, 5).map((p) => renderPageButton(p, p, p === page)),
        );
        buttons.push(renderEllipsis("ellipsis1"));
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page),
        );
      } else if (page >= totalPages - 3) {
        // Show 1, ..., lastpage - 4, lastpage - 3, lastpage - 2, lastpage - 1, lastpage
        buttons.push(renderPageButton(1, 1, 1 === page));
        buttons.push(renderEllipsis("ellipsis2"));
        buttons.push(
          ...arrayRange(totalPages - 4, totalPages).map((p) =>
            renderPageButton(p, p, p === page),
          ),
        );
      } else {
        // Show 1, ..., page - 1, page, page + 1, ..., lastpage
        buttons.push(renderPageButton(1, 1, 1 === page));
        buttons.push(renderEllipsis("ellipsis3"));
        buttons.push(
          ...arrayRange(page - 1, page + 1).map((p) =>
            renderPageButton(p, p, p === page),
          ),
        );
        buttons.push(renderEllipsis("ellipsis4"));
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page),
        );
      }
    }

    return buttons;
  };

  // Render the component
  return (
    <nav
      aria-label="Pagination"
      className="mx-auto mt-6 flex justify-between space-x-2 space-x-reverse lg:justify-end"
    >
      <Cta
        className="px-2"
        disabled={page == 1}
        onClick={() => handlePageChange(page - 1)}
        size={"sm"}
        variant="ghost"
      >
        <ChevronRight className="h-5 w-5" />
      </Cta>
      {renderPageButtons()}
      <Cta
        className="px-2"
        disabled={page == totalPages}
        onClick={() => handlePageChange(page + 1)}
        size="sm"
        variant="ghost"
      >
        <ChevronLeft className="h-5 w-5" />
      </Cta>
    </nav>
  );
}
