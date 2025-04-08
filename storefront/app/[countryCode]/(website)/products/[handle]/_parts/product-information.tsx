import type {MerchifyProduct} from "@/types";
import type {PRODUCT_QUERYResult} from "@/types/sanity.generated";

import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";

import {ProductVariantsProvider} from "../../../../../../components/context/product-context";
import Addons from "./addons";
import BreadCrumbs from "./breadcrumbs";
import InitiateEditor from "./initiate-editor-button";
import OptionsSelect from "./options";
import Price from "./price";

type Props = {
  content: PRODUCT_QUERYResult;
  region_id: string;
} & MerchifyProduct;

export default function ProductInformation(props: Props) {
  return (
    <ProductVariantsProvider product={props}>
      <div className="lg:y-4 pb-2xl flex w-full flex-col gap-4 pt-4 lg:max-w-[580px]">
        <BreadCrumbs collection={props.collection} title={props.title} />
        <Heading
          className="leading-[100%]"
          desktopSize="4xl"
          mobileSize="2xl"
          tag="h1"
        >
          {props.title}
        </Heading>
        <Price product={{id: props.id, variants: props.variants}} />
        <Body className="font-normal" font="sans" mobileSize="base">
          {props.metadata?.details ? (
            <ul className="mr-6 list-disc">
              {props.metadata.details.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            props.subtitle
          )}
        </Body>
        <div className="mt-4 flex flex-col gap-4">
          {props.options && <OptionsSelect options={props.options} />}
          <InitiateEditor
            className="mt-4"
            regionId={props.region_id}
            variant="PDP"
          />
        </div>
        <Addons
          products={props.content?.addons?.products}
          region_id={props.region_id}
          title={props.content?.addons?.title}
        />
      </div>
    </ProductVariantsProvider>
  );
}
