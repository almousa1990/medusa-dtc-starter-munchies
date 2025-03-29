import {Link} from "@/components/shared/button";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";

const EmptyCartMessage = () => {
  return (
    <div
      className="flex flex-col items-start justify-center px-2 py-48"
      data-testid="empty-cart-message"
    >
      <Heading
        tag="h1"
        className="text-3xl-regular flex flex-row items-baseline gap-x-2"
      >
        سلة التسوق
      </Heading>
      <Body className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        سلة التسوق فارغة حالياً. ابدأ بتصفح منتجاتنا من خلال الرابط أدناه
        واملأها بما يعجبك.
      </Body>
      <div>
        <Link href="/">تصفح المنتجات</Link>
      </div>
    </div>
  );
};

export default EmptyCartMessage;
