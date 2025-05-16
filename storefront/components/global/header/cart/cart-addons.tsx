/* eslint-disable @typescript-eslint/no-unused-vars */
import {AddonsItem} from "@/components/shared/addons-item";
import {getProductsByIds} from "@/data/medusa/products";

type Props = {ids: string[]; isEmptyCart: boolean; region_id: string};

export default async function CartAddons({ids, isEmptyCart, region_id}: Props) {
  const {products} = await getProductsByIds(ids, region_id);

  const slides = products.map((item) => (
    <div className="w-[380px]" key={item.id}>
      <AddonsItem region_id={region_id} variant="cart" {...item} />
    </div>
  ));

  return <div>tbd</div>;
}
