"use client";

import type {HttpTypes} from "@medusajs/types";

import {Cta} from "@/components/shared/button";
import {
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Label,
} from "@merchify/ui";
import {FunnelIcon} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import {parseAsArrayOf, parseAsString, useQueryState} from "nuqs";

type ProductFiltersProps = {
  categories: HttpTypes.StoreProductCategory[];
  className?: string;
  filters?: {
    id: string;
    tags: {
      id: string;
      value: string;
    }[];
    title: string;
  }[];
  initialTags?: string | string[]; // ✅ updated
  sortBy?: any;
};

export default function ProductFilters({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  categories,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
  filters,
  initialTags = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sortBy,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const normalizedInitialTags = Array.isArray(initialTags)
    ? initialTags
    : initialTags
      ? [initialTags]
      : [];
  const [tags, setTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString)
      .withDefault(normalizedInitialTags)
      .withOptions({shallow: false}),
  );

  const toggleTag = (tagId: string) => {
    const current = tags || [];
    const updated = current.includes(tagId)
      ? current.filter((t) => t !== tagId)
      : [...current, tagId];
    setTags(updated);
  };

  const clearFilters = () => {
    setTags(null);
    router.push(pathname);
  };

  return (
    <Collapsible
      aria-labelledby="filter-heading"
      className="border-border grid items-center border-b"
    >
      <h2 className="sr-only" id="filter-heading">
        الترشيح
      </h2>
      <div className="relative col-start-1 row-start-1 py-2">
        <div className="divide-border mx-auto grid max-w-7xl auto-cols-max grid-flow-col gap-x-6 divide-x text-sm">
          <CollapsibleTrigger
            asChild
            className="group flex h-9 cursor-default items-center pl-6 font-medium"
          >
            <div className="cursor-pointer">
              <FunnelIcon
                aria-hidden="true"
                className="ml-2 size-5 flex-none"
              />
              {!!tags?.length ? <>{tags.length} مرشحات</> : <>الترشيح</>}
            </div>
          </CollapsibleTrigger>
          {!!tags?.length && (
            <div className="pl-6">
              <Cta
                className="text-muted-foreground"
                onClick={clearFilters}
                size="sm"
                type="button"
                variant="ghost"
              >
                إعادة تعيين
              </Cta>
            </div>
          )}
        </div>
      </div>
      <CollapsibleContent className="border-border border-t py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 text-sm md:gap-x-6">
          <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
            {filters?.map((filter) => (
              <fieldset key={filter.id}>
                <legend className="block font-medium">{filter.title}</legend>
                <div className="grid gap-6 pt-6 sm:gap-4 sm:pt-4">
                  {filter.tags?.map((tag) => (
                    <div className="flex gap-3" key={tag.id}>
                      <Checkbox
                        checked={tags?.includes(tag.id)}
                        id={tag.id}
                        onCheckedChange={() => toggleTag(tag.id)}
                      />
                      <Label
                        className="text-base font-normal sm:text-sm"
                        htmlFor={tag.id}
                      >
                        {tag.value}
                      </Label>
                    </div>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
      </CollapsibleContent>
      <div className="col-start-1 row-start-1 py-4">
        <div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
          {/* <ProductSort sortBy={sortBy} /> */}
        </div>
      </div>
    </Collapsible>
  );
}
