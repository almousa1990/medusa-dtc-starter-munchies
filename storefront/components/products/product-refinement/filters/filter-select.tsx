"use client";
import type Select from "@/components/shared/select";

import Icon from "@/components/shared/icon";
import Body from "@/components/shared/typography/body";
import {cx} from "cva";
import {parseAsArrayOf, parseAsString, useQueryState} from "nuqs";
import {type ComponentProps, useEffect, useRef, useState} from "react";

import DropDown from "./drop-down";

export function useMultiFilter(name: string) {
  const [state, setState] = useQueryState(
    name,
    parseAsArrayOf(parseAsString).withOptions({shallow: false}),
  );

  const setFilter = (value: string) => {
    setState((prev) => {
      if (prev && prev.includes(value)) {
        const values = prev.filter((item) => item !== value);
        return values.length > 0 ? values : null;
      }
      return prev ? [value, ...prev] : [value];
    });
  };

  return {filter: state, setFilter};
}

export default function FilterSelect(
  props: {name: string; placeholder: string} & Omit<
    ComponentProps<typeof Select>,
    "setOption" | "variant"
  >,
) {
  const {filter, setFilter} = useMultiFilter(props.name);

  const [isOpen, setOpen] = useState(false);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowTopArrow(container.scrollTop > 0);
      setShowBottomArrow(
        container.scrollHeight - container.clientHeight >
          container.scrollTop + 1,
      );
    }
  };

  useEffect(() => {
    handleScroll();
  }, [isOpen]);

  const scrollBy = (amount: number) => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({behavior: "smooth", top: amount});
    }
  };

  return (
    <DropDown isOpen={isOpen} placeholder={props.placeholder} setOpen={setOpen}>
      <div
        className="relative max-h-[320px] w-full overflow-y-auto rounded-sm"
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        <div className="sticky top-0">
          <div
            className={cx(
              "border-accent bg-background absolute top-0 left-0 flex w-full cursor-pointer items-center justify-center border-b-[1.5px] transition-all duration-300",
              {
                "translate-y-[-100%]": !showTopArrow,
              },
            )}
            onClick={() => scrollBy(-250)}
          >
            <Icon className="size-6" name="AccordionBottom" />
          </div>
        </div>
        <div className="group flex w-full flex-col gap-2 p-2">
          {props.options.map((option) => {
            const selected = filter?.includes(option.value);
            return (
              <button
                className="hover:bg-secondary flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 disabled:pointer-events-none"
                key={option.value}
                onClick={() => setFilter(option.value)}
              >
                <div className="border-accent flex size-4! items-center justify-center rounded-[4px] border">
                  <Icon
                    className={cx(
                      "size-3! shrink-0 transform opacity-0 transition-transform duration-300",
                      {"opacity-100": selected},
                    )}
                    height={24}
                    name="Check"
                    width={24}
                  />
                </div>
                <Body
                  className="truncate text-left text-nowrap"
                  font="sans"
                  mobileSize="base"
                >
                  {option.label}
                </Body>
              </button>
            );
          })}
        </div>
        <div className="sticky bottom-0 -mt-[25.5px] h-[25.5px] overflow-hidden">
          <div
            className={cx(
              "border-accent bg-background sticky bottom-0 left-0 flex w-full cursor-pointer items-center justify-center border-t-[1.5px] transition-all duration-300",
              {
                "translate-y-[100%]": !showBottomArrow,
              },
            )}
            onClick={() => scrollBy(250)}
          >
            <Icon className="size-6" name="AccordionTop" />
          </div>
        </div>
      </div>
    </DropDown>
  );
}
