"use client";
import type {Footer} from "@/types/sanity.generated";

import {newsletterForm} from "@/actions/newsletter";
import {Cta} from "@/components/shared/button";
import {RichText} from "@/components/shared/rich-text";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import {useActionState} from "react";
import {useFormStatus} from "react-dom";

export default function Newsletter(props: NonNullable<Footer>) {
  const [state, action] = useActionState(newsletterForm, "idle");

  return (
    <section className="max-w-max-screen mx-auto flex w-full flex-col gap-4 px-5 py-10 lg:px-8">
      {state === "success" && (
        <Body desktopSize="8xl" font="serif" mobileSize="5xl">
          {props.signup_success && <RichText value={props.signup_success} />}
        </Body>
      )}
      {state !== "success" && (
        <>
          <Heading desktopSize="5xl" font="serif" mobileSize="2xl" tag="h2">
            {props.copy && <RichText value={props.copy} />}
          </Heading>
          <form action={action} className="flex flex-col gap-4 lg:flex-row">
            <input
              className="newletter-text border-accent text-body-4xl placeholder:text-body-4xl placeholder:text-accent lg:px-2xl lg:text-body-20 lg:placeholder:text-body-20 h-20 w-full max-w-[960px] rounded-lg border-[1.5px] bg-transparent px-6 py-[7.5px] font-sans leading-[140%] tracking-[-0.64px] outline-hidden placeholder:opacity-60 lg:py-[6.5px] lg:tracking-[-0.96px]"
              name="email"
              placeholder={props.placeholder}
              required
              type="email"
            />
            <SubmitButton text={props.button} />
          </form>
          <Body font="sans" mobileSize="sm">
            {props.footnote && <RichText value={props.footnote} />}
          </Body>
        </>
      )}
      {state === "error" && (
        <div className="bg-error bg-opacity-20 rounded-lg p-4">
          <Body
            className="text-error"
            desktopSize="2xl"
            font="sans"
            mobileSize="lg"
          >
            {props.signup_error && <RichText value={props.signup_error} />}
          </Body>
        </div>
      )}
    </section>
  );
}

function SubmitButton({text}: {text?: string}) {
  const {pending} = useFormStatus();

  return (
    <Cta
      className="w-full lg:flex-1"
      loading={pending}
      size="xl"
      type="submit"
      variant="outline"
    >
      {text || "Submit"}
    </Cta>
  );
}
