"use client";

import {refreshOtp, verifyOtp} from "@/actions/medusa/auth";
import {Cta} from "@/components/shared/button";
import Heading from "@/components/shared/typography/heading";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  cn,
  useToast,
} from "@merchify/ui";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

const REFRESH_COOLDOWN = 30;

interface OtpFormProps {
  disabled?: boolean;

  input: {
    email?: string;
    phone?: string;
    stateKey: string;
  };
  onRestart: () => void;
  onSuccess: (token: string) => Promise<void>;
}

const formSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, ""),
});

export default function OtpForm({
  input,
  onRestart,
  onSuccess,
  disabled,
}: OtpFormProps) {
  const {toast} = useToast();

  const [stateKey, setStateKey] = useState(input.stateKey);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      otp: "",
    },
    mode: "onSubmit", // validate only when submitting
    reValidateMode: "onSubmit", // don't re-validate on blur/change
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (disabled) {
      return;
    }
    const response = await verifyOtp({
      otp: values.otp,
      stateKey: stateKey,
    });

    if (response.success) {
      await onSuccess(response.token);
    } else {
      form.reset();
      form.setError("otp", {
        message: response.error, // ✅ this will show inside <FormMessage />
        type: "manual",
      });
    }
  }

  async function onResend() {
    const response = await refreshOtp({
      stateKey,
    });

    form.reset();
    if (response.success) {
      setStateKey(response.stateKey);
    } else {
      setStateKey("");

      toast({
        description: response.error,
        variant: "destructive",
      });
      onRestart();
    }
  }

  const isDisabled = disabled || form.formState.isSubmitting;

  return (
    <>
      <Form {...form}>
        <form
          className="w-full space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <Heading mobileSize="2xl" tag="h1">
              رمز التحقق
            </Heading>
            <p className="text-muted-foreground text-sm text-balance">
              أدخل رمز التحقق المكون من ٦ أرقام والذي تم إرساله إلى{" "}
              <span className="text-primary font-medium">{input.phone}</span>
            </p>
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="otp"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      className="mx-auto"
                      disabled={isDisabled}
                      maxLength={6}
                      onComplete={() => form.handleSubmit(onSubmit)()}
                      {...field}
                      onChange={(value) => {
                        field.onChange(value);
                        form.clearErrors([field.name]);
                      }}
                    >
                      <InputOTPGroup className="mx-auto flex flex-row-reverse">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
            <ResendButton
              className={cn({hidden: isDisabled})}
              onClick={onResend}
            />
          </div>

          <Cta
            className="w-full"
            data-testid="sign-in-button"
            loading={isDisabled}
          >
            الاستمرار
          </Cta>
        </form>
      </Form>

      <Cta
        className="w-full"
        disabled={isDisabled}
        onClick={onRestart}
        size="sm"
        variant="ghost"
      >
        تغيير طريقة الدخول
      </Cta>
    </>
  );
}

function ResendButton({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  const [countdown, setCountdown] = useState(REFRESH_COOLDOWN);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowButton(true);
    }
  }, [countdown]);

  const handleSubmit = () => {
    setCountdown(REFRESH_COOLDOWN);
    setShowButton(false);

    onClick();
  };

  return (
    <div className={cn("flex w-full flex-col items-center", className)}>
      {showButton ? (
        <Cta
          className="w-full"
          onClick={handleSubmit}
          size="sm"
          type="button"
          variant="ghost"
        >
          إعادة إرسال رمز التحقق
        </Cta>
      ) : (
        <Cta className="w-full" disabled size="sm" variant="ghost">
          يمكنك إعادة الإرسال بعد {countdown} ثانية
        </Cta>
      )}
    </div>
  );
}
