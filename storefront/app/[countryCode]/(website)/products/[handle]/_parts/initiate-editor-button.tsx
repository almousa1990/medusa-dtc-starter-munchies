"use client";

import {Cta} from "@/components/shared/button";
import {useRouter} from "next/navigation";

import {useProductVariants} from "../../../../../../components/context/product-context";
import {cn} from "@merchify/ui";
import {useState} from "react";

export default function InitiateEditorButton({
  regionId,
  variant,
  className,
}: {
  regionId: string;
  variant: "PDP" | "sticky";
  className?: string;
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
      loading={loading}
      className={cn("w-full", className)}
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
