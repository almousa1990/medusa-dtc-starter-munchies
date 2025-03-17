import Icon from "@/components/shared/icon";
import {cx} from "cva";
import {type KeyboardEvent, useEffect, useRef} from "react";

type SearchbarProps = {
  className?: string;
  containerClassName?: string;
  keydownHandler?: (event: KeyboardEvent) => void;
  onChange?: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  query: string;
  setQuery: (query: string) => void;
};

export default function SearchBar({
  className,
  keydownHandler = () => {},
  onChange,
  onSearch,
  placeholder,
  query,
  setQuery,
}: SearchbarProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 150);

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch]);

  const handleSearch = (searchQuery: string) => {
    if (onChange) {
      onChange();
    }
    setQuery(searchQuery);
  };

  return (
    <div
      className={cx(
        "relative mt-7 flex w-full items-start rounded-lg lg:max-w-[420px]",
        className,
      )}
    >
      <Icon
        className="absolute top-1/2 left-[14px] h-6 w-6 -translate-y-1/2"
        name="Search"
      />
      <input
        aria-label="Search"
        className="border-accent bg-background pr-sm text-body-base text-accent placeholder:text-accent h-full w-full appearance-none rounded-lg border-[1.5px] py-[10px] pl-[50px] font-sans leading-[150%] font-medium outline-hidden placeholder:opacity-60"
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={keydownHandler}
        placeholder={placeholder ?? "Search"}
        ref={ref}
        type="text"
        value={query}
      />
    </div>
  );
}
