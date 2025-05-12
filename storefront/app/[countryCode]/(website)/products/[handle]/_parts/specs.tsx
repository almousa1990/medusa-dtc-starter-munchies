import type {Product} from "@/types/sanity.generated";

import {
  ProductSpecItem,
  ProductSpecItemContent,
  ProductSpecItemTitle,
} from "./product-spec-item";
import {SizeChart} from "./size-chart";
import {MerchifyProduct} from "@/types";
import Image from "next/image";

type Props = MerchifyProduct;

export default function ProductSpecs(props: Props) {
  const sizeChart = props.metadata?.size_chart;
  const careSet = props.care_instructions;
  const features = props.feature_entries;

  return (
    <section className="mx-auto grid max-w-xl gap-6 px-4 pt-10 sm:px-6 sm:pt-32 lg:max-w-7xl lg:gap-12 lg:px-8">
      <ProductSpecItem>
        <ProductSpecItemTitle>الوصف</ProductSpecItemTitle>
        <ProductSpecItemContent>{props.description}</ProductSpecItemContent>
      </ProductSpecItem>
      {careSet && (
        <ProductSpecItem>
          <ProductSpecItemTitle>العناية</ProductSpecItemTitle>
          <ProductSpecItemContent>
            <>
              {careSet.map((instruction) => (
                <Image
                  className="mb-4"
                  width={32}
                  height={32}
                  src={instruction.symbol_url}
                  alt={instruction.title}
                  key={instruction.code}
                />
              ))}

              {careSet.map((instruction) => (
                <span key={instruction.code}>{instruction.title}. </span>
              ))}
            </>
          </ProductSpecItemContent>
        </ProductSpecItem>
      )}
      {features && (
        <ProductSpecItem>
          <ProductSpecItemTitle>الميزات</ProductSpecItemTitle>
          <ProductSpecItemContent>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
              {features.map((feature, index) => (
                <div key={index}>
                  <Image
                    className="mb-4 hidden lg:block"
                    width={48}
                    height={48}
                    src={feature.template.symbol_url}
                    alt={feature.template.name}
                    key={feature.template.name}
                  />
                  <p className="mb-2 font-bold">{feature.template.name}</p>
                  <p className="text-muted-foreground">{feature.content}</p>
                </div>
              ))}
            </div>
          </ProductSpecItemContent>
        </ProductSpecItem>
      )}
      {sizeChart && (
        <ProductSpecItem>
          <ProductSpecItemTitle>جدول المقاسات</ProductSpecItemTitle>
          <ProductSpecItemContent>
            <SizeChart data={sizeChart} />
          </ProductSpecItemContent>
        </ProductSpecItem>
      )}
    </section>
  );
}

/*    (specs?.length || 0) > 0 && (
      <Accordion
        initialOpen={null}
        items={
          specs
            ?.map(({_key, content, title}) => {
              if (!title || !content) return null;
              return {content, id: _key, title};
            })
            .filter(
              (item): item is {content: string; id: string; title: string} =>
                item !== null,
            ) || []
        }
        type="product"
      />
    ) */
