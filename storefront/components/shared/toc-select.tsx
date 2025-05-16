"use client";

import type {BlocksBody} from "@/utils/content/toc";

import {getPtComponentId} from "@/utils/ids";
import {toPlainText} from "@portabletext/react";

import {NativeSelect} from "./native-select";

type Props = {
  outlines: {block: BlocksBody; isSub: boolean}[];
};

export default function TocSelect({outlines}: Props) {
  if (!outlines || outlines.length === 0) return null;

  const options = outlines.map((item, index) => ({
    key: index,
    label: toPlainText(item.block),
    value: getPtComponentId(item.block as any),
  }));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const el = document.getElementById(value);
    if (el) {
      el.scrollIntoView({behavior: "smooth"});
    } else {
      window.location.hash = value;
    }
  };

  return (
    <NativeSelect
      className="lg:hidden"
      onChange={handleChange}
      options={options}
    />
  );
}
