"use client";

import {cn} from "@merchify/ui";
import {useEffect, useState} from "react";

export default function BottomBorder({
  DropdownOpen,
  className,
}: {
  DropdownOpen?: boolean;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(className, "h-px w-screen transition-all duration-300", {
        "bg-background": !isVisible,
        "bg-background transition-none": DropdownOpen,
        "bg-border": isVisible && !DropdownOpen,
      })}
    />
  );
}
