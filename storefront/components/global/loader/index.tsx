"use client";

import React, {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {Progress} from "@merchify/ui";

export default function Loader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setProgress(60);
    setHidden(false);

    const timer = setTimeout(() => {
      setProgress(100);

      setTimeout(() => {
        setHidden(true);
        setProgress(0);
      }, 200);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <Progress
      value={progress}
      className="fixed top-0 left-0 z-[100] h-px rounded-none bg-transparent"
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
