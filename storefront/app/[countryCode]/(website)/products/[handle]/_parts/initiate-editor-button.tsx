"use client";

import {Cta} from "@/components/shared/button";
import {cn} from "@merchify/ui";
import {useRouter} from "next/navigation";
import {useState} from "react";

import {useProductVariants} from "../../../../../../components/context/product-context";

export default function InitiateEditorButton({
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  regionId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant,
}: {
  className?: string;
  regionId: string;
  variant: "PDP" | "sticky";
}) {
  const {activeVariant, product} = useProductVariants();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!product) {
      return;
    }
    setLoading(true);
    if (activeVariant) {
      // Redirect to editor page with active variant
      router.push(`/editor/${product.handle}?variant=${activeVariant.id}`);
    } else {
      // Redirect to some fallback or error page
      router.push(`/editor/${product.id}`);
    }
  };

  return (
    <Cta
      className={cn("w-full", className)}
      loading={loading}
      onClick={(e) => {
        e.preventDefault();
        if (activeVariant) {
          handleSubmit();
        }
      }}
      size="lg"
    >
      تخصيص المنتج
    </Cta>
  );
}
