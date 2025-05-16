"use client";
import type {FAQS_PAGE_QUERYResult} from "@/types/sanity.generated";

import {NativeSelect} from "@/components/shared/native-select";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@merchify/ui";
import React from "react";

type FaqContentProps = {
  category: NonNullable<FAQS_PAGE_QUERYResult>["category"];
  openAnswer: null | string;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

export default function FaqContent({
  category,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openAnswer,
  selectedCategory,
  setSelectedCategory,
}: FaqContentProps) {
  const currentCategory = category?.find(
    (category) => category.slug?.current === selectedCategory,
  );

  const items =
    currentCategory?.questions
      ?.map((item) => {
        if (!item || !item.question || !item.answer) return null;
        return {
          content: item.answer,
          id: item._id,
          title: item.question,
        };
      })
      .filter(
        (item): item is {content: string; id: string; title: string} =>
          item !== null,
      ) || [];

  return (
    <>
      <div className="sticky top-[calc(var(--header-height)+2rem)] hidden h-full w-[300px] flex-col items-start lg:flex">
        {category?.map((group) => {
          return (
            <button
              className="border-accent-40 hover:border-accent border-r-1 p-2 transition-all duration-300 first:pt-1 last:pb-1"
              key={group._id}
              onClick={() => setSelectedCategory(group.slug?.current || "")}
            >
              <Body font="sans" mobileSize="sm">
                {group.title}
              </Body>
            </button>
          );
        })}
      </div>
      <div className="w-full lg:max-w-[690px]">
        <NativeSelect
          className="lg:hidden"
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={
            category?.map((group) => ({
              label: group.title || "",
              value: group.slug?.current || "",
            })) || []
          }
        />
        <Heading
          className="mb-2 hidden lg:block"
          desktopSize="xl"
          font="serif"
          mobileSize="lg"
          tag="h2"
        >
          {currentCategory?.title}
        </Heading>
        <div className="flex flex-col gap-5">
          <Accordion className="w-full" collapsible type="single">
            {items.map((item) => (
              <AccordionItem className="border-0" key={item.id} value={item.id}>
                <AccordionTrigger className="font-serif font-semibold hover:no-underline lg:text-lg">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
