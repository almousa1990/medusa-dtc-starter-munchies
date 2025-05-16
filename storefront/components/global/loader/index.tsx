"use client";

import {Progress} from "@merchify/ui";
import {usePathname} from "next/navigation";
import React, {useEffect, useState} from "react";

export default function Loader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(60);

    const timer = setTimeout(() => {
      setProgress(100);

      setTimeout(() => {
        setProgress(0);
      }, 200);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <Progress
      className="fixed top-0 left-0 z-[100] h-px rounded-none bg-transparent"
      value={progress}
    />
  );
}
/**
 * 
 *     <div
      className={`bg-primary fixed top-0 left-0 h-px transition-all duration-300 ${
        hidden ? "w-0 opacity-0" : "z-[70] w-full opacity-100"
      }`}
      style={{
        width: `${progress}%`,
        transition: progress === 100 ? "none" : "width 0.3s ease-in-out",
      }}
    />
 */
