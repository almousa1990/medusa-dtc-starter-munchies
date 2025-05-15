"use client";
import {useDebounce} from "@/hooks/use-debounce";
import {Input} from "@merchify/ui";
import {Search} from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useRef, useState} from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [input, setInput] = useState(initialQ);
  const debouncedInput = useDebounce(input, 500);
  const hasTyped = useRef(false);

  useEffect(() => {
    if (!hasTyped.current) return;

    const params = new URLSearchParams();
    if (debouncedInput.trim()) {
      params.set("q", debouncedInput);
      router.push(`/products?${params.toString()}`);
    } else {
      router.push(`/products`);
    }
  }, [debouncedInput, router]);

  return (
    <div className="relative flex items-center">
      <Search className="text-muted-foreground absolute right-4 h-4 w-4" />
      <Input
        value={input}
        onChange={(e) => {
          hasTyped.current = true;
          setInput(e.target.value);
        }}
        className="bg-accent h-12 w-full pr-10"
        placeholder="ابحث عن المنتجات والعلامات التجارية والفئات"
      />
    </div>
  );
}
