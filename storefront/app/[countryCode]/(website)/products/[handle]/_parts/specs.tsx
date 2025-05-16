import type {MerchifyProduct} from "@/types";

import Image from "next/image";

import {
  ProductSpecItem,
  ProductSpecItemContent,
  ProductSpecItemTitle,
} from "./product-spec-item";
import {SizeChartTable} from "./size-chart-table";

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
                  alt={instruction.title}
                  className="mb-4"
                  height={32}
                  key={instruction.code}
                  src={instruction.symbol_url}
                  width={32}
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
                    alt={feature.template.name}
                    className="mb-4 hidden lg:block"
                    height={48}
                    key={feature.template.name}
                    src={feature.template.symbol_url}
                    width={48}
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
            <SizeChartTable {...sizeChart} />
          </ProductSpecItemContent>
        </ProductSpecItem>
      )}
    </section>
  );
}
