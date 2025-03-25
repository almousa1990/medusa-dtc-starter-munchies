import type {ModularPageSection} from "./types";

import CarouselSection from "../shared/carousel-section";
import Body from "../shared/typography/body";
import Heading from "../shared/typography/heading";

export default function Testimonials(
  props: ModularPageSection<"section.testimonials">,
) {
  const slides = props.testimonials?.map((testimonial) => (
    <TestimonialCard
      author={testimonial.author}
      key={testimonial._id}
      text={testimonial.quote}
    />
  ));
  return (
    <section {...props.rootHtmlAttributes}>
      <CarouselSection
        slides={slides}
        title={
          <Heading
            className="text-center"
            desktopSize="3xl"
            mobileSize="lg"
            tag="h3"
          >
            {props.title}
          </Heading>
        }
      />
    </section>
  );
}

function TestimonialCard(props: {
  author: string | undefined;
  text: string | undefined;
}) {
  return (
    <div className="border-accent flex h-full min-h-[340px] w-[88vw] max-w-[450px] cursor-pointer flex-col items-start justify-start gap-6 rounded-lg border px-8 py-6 lg:min-h-[400px]">
      <Body desktopSize="2xl" font="sans" mobileSize="xl">
        {props.text}
      </Body>
      <Body font="sans" mobileSize="xl">
        {props.author}
      </Body>
    </div>
  );
}
