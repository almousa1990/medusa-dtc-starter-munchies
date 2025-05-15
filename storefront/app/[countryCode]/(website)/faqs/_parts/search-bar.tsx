import Icon from "@/components/shared/icon";
import {Input} from "@merchify/ui";
import {cx} from "cva";
import {Search} from "lucide-react";
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
        "relative mt-7 flex w-full items-center rounded-md lg:max-w-[420px]",
        className,
      )}
    >
      <Search className="text-muted-foreground absolute right-4 h-4 w-4" />

      <Input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-12 w-full pr-10"
        placeholder={placeholder ?? "بحث"}
        onKeyDown={keydownHandler}
        ref={ref}
      />
    </div>
  );
}
