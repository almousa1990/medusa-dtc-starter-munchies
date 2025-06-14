"use client";

import type {FAQS_PAGE_QUERYResult, FaqEntry} from "@/types/sanity.generated";

import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";

import FaqContent from "./faq-content";
import SearchBar from "./search-bar";

type FaqEntryWithCategory = {categorySlug: string} & FaqEntry;

export default function Faq({
  data,
}: {
  data: NonNullable<FAQS_PAGE_QUERYResult>;
}) {
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const categories = data.category ?? [];
  const queryRef = useRef("");
  const questionToScrollTo = useRef<null | string>(null);
  const initialCategory = categories[0]?.slug?.current || "";

  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<FaqEntryWithCategory[]>(
    [],
  );
  const [openAnswer, setOpenAnswer] = useState<null | string>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory ?? "",
  );

  const categoriesMemo = useMemo(() => data.category ?? [], [data.category]);

  const onSearch = useCallback(
    (query: string) => {
      const search = query?.toLowerCase().trim();
      queryRef.current = search;
      if (search === "" || !categoriesMemo) {
        setSearchResults([]);
        return;
      }

      const uniqueQuestions = new Set<string>();
      const entries = categoriesMemo.flatMap(
        (category) =>
          category.questions?.map((entry) => ({
            ...entry,
            categorySlug: category.slug?.current,
          })) ?? [],
      );

      const results = entries.filter((entry) => {
        if (!entry?.question) return false;
        const question = entry.question.toLowerCase().trim();
        if (uniqueQuestions.has(question)) return false;
        uniqueQuestions.add(question);
        return question.includes(search);
      }) as FaqEntryWithCategory[];

      setSearchResults(results);
    },
    [categoriesMemo, setSearchResults],
  );

  const scrollToQuestion = (id: string) => {
    const top = document.getElementById(id)?.getBoundingClientRect()?.top;
    if (top) {
      setOpenAnswer(id);
      window.scroll({behavior: "smooth", top: top - 200});
    }
  };

  const onClickSearchResult = (result: FaqEntryWithCategory) => {
    setQuery("");
    if (selectedCategory !== result.categorySlug) {
      questionToScrollTo.current = result._id;
      setSelectedCategory(result.categorySlug ?? "");
    } else {
      scrollToQuestion(result._id);
    }
  };

  useEffect(() => {
    if (questionToScrollTo.current) {
      scrollToQuestion(questionToScrollTo.current);
      questionToScrollTo.current = null;
    }
  }, [selectedCategory]);

  const keydownHandler = (event: KeyboardEvent) => {
    if (!event) return;
    switch (event.key) {
      case "Escape":
        setQuery("");
        break;
      case "Enter":
        const activeElement = document.activeElement as HTMLElement;
        const id = activeElement?.id;
        const index = parseInt(id?.split("-").pop() ?? "0");
        onClickSearchResult(searchResults[index]);
        break;
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        const sibling =
          event.key === "ArrowDown"
            ? "nextElementSibling"
            : "previousElementSibling";
        const element = document.activeElement?.[sibling] as HTMLElement;
        element?.focus();
        break;
    }
  };

  const searchbarKeydownHandler = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const first = searchResultsRef.current?.firstElementChild as HTMLElement;
      first?.focus();

      searchResultsRef.current?.addEventListener(
        "keydown",
        keydownHandler as any,
      );
      return () => {
        searchResultsRef.current?.removeEventListener(
          "keydown",
          keydownHandler as any,
        );
      };
    }
  };
  return (
    <div className="scroll-mt-header-height flex-col items-center justify-center">
      <section className="bg-accent text-accent-foreground flex w-full flex-col items-center justify-center gap-1 px-8 py-20 text-center">
        <Heading
          className="heading-l mx-auto w-fit"
          desktopSize="4xl"
          font="serif"
          mobileSize="2xl"
          tag="h1"
        >
          {data?.title}
        </Heading>
        <Body
          className="max-w-[280px] text-balance lg:max-w-[320px]"
          font="sans"
          mobileSize="base"
        >
          {data.description}
        </Body>
        <div className="relative flex w-full max-w-[420px] justify-center">
          <SearchBar
            keydownHandler={searchbarKeydownHandler}
            onSearch={onSearch}
            placeholder={data.textTranslations?.searchPlaceholder}
            query={query}
            setQuery={setQuery}
          />
          {queryRef.current.trim() && (
            <>
              {searchResults.length > 0 ? (
                <div className="bg-background absolute top-full left-0 z-10 mt-1 w-full max-w-[420px] rounded-md border p-2">
                  <div
                    className="max-h-[16rem] overflow-y-auto outline-hidden"
                    ref={searchResultsRef}
                    tabIndex={0}
                  >
                    {searchResults.map((result, index) => (
                      <button
                        className="hover:bg-secondary focus:bg-secondary w-full rounded-lg px-4 py-2 text-start outline-hidden"
                        id={`search-${result._id}-${index}`}
                        key={`search-${result._id}-${index}`}
                        onClick={() => onClickSearchResult(result)}
                        tabIndex={index + 1}
                      >
                        <Body font="sans" mobileSize="base">
                          {result.question && (
                            <HighlitedText
                              query={query}
                              question={result.question}
                            />
                          )}
                        </Body>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-background absolute top-full left-0 z-10 mt-1 w-full max-w-[420px] rounded-md border p-2">
                  <div className="text-accent-foreground w-full px-4 py-2 text-start opacity-60">
                    {data.textTranslations?.searchNoResults}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <section className="max-w-max-screen relative mx-auto flex h-full w-full flex-col items-start justify-start gap-8 px-5 py-10 lg:flex-row lg:justify-center lg:py-20">
        <FaqContent
          category={data.category}
          openAnswer={openAnswer}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </section>
    </div>
  );
}

const HighlitedText = ({query, question}: {query: string; question: string}) =>
  question?.split(new RegExp(`(${query})`, "gi"))?.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span className="bg-accent text-accent-foreground" key={index}>
        {part}
      </span>
    ) : (
      part
    ),
  );
