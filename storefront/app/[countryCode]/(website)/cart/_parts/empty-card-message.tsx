import {Link} from "@/components/shared/button";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";

const EmptyCartMessage = () => {
  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <Heading desktopSize="3xl" mobileSize="2xl" tag="h1">
        سلة التسوق
      </Heading>
      <Body className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        سلة التسوق الخاصة بك فارغة حالياً. يمكنك استكشاف مجموعتنا المميزة من
        المنتجات عبر الرابط أدناه.
      </Body>
      <div>
        <Link href="/">تصفح المنتجات</Link>
      </div>
    </main>
  );
};

export default EmptyCartMessage;
