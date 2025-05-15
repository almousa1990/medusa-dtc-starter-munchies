import {cx} from "cva";

import Label from "./typography/label";

export default function Tag({
  className,
  text,
}: {
  className?: string;
  text: string | undefined;
}) {
  return (
    <Label
      className={cx("bg-primary text-accent px-1 py-px text-end", className)}
      desktopSize="sm"
      font="display"
      mobileSize="2xs"
    >
      {text}
    </Label>
  );
}
