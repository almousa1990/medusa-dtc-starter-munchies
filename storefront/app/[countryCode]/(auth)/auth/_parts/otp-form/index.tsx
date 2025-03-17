"use client";

import {generateOtp, refreshOtp, verifyOtp} from "@/actions/medusa/auth";
import {Cta} from "@/components/shared/button";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@merchify/ui";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

const REFRESH_COOLDOWN = 30;

interface OtpFormProps {
  input: {stateKey: string};
  onErorr: (message: string) => void;
  onRestart: () => void;
  onSuccess: (token: string) => void;
}

const formSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, ""),
});

export default function OtpForm({
  input,
  onErorr,
  onRestart,
  onSuccess,
}: OtpFormProps) {
  const [stateKey, setStateKey] = useState(input.stateKey);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      otp: "",
    },
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await verifyOtp({
      otp: values.otp,
      stateKey: stateKey,
    });

    form.reset();
    if (response.success) {
      onSuccess(response.token);
    } else {
      onErorr(response.error);
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
      onErorr(response.error);
      onRestart();
    }
  }

  // Reset error when user starts typing
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.otp) {
        onErorr(""); // Clear error when user starts typing
      }
    });

    return () => subscription.unsubscribe();
  }, [form, form.watch, onErorr]);

  return (
    <>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="otp"
            render={({field}) => (
              <FormItem>
                <FormLabel>رقم التحقق</FormLabel>
                <FormControl>
                  <InputOTP
                    disabled={form.formState.isSubmitting}
                    maxLength={6}
                    onComplete={() => form.handleSubmit(onSubmit)()}
                    {...field}
                  >
                    <InputOTPGroup className="flex flex-row-reverse">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  لقد تم إرسال رمز التحقق فى رسالة إليكم
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Cta
              data-testid="sign-in-button"
              disabled={!form.formState.isDirty || !form.formState.isValid}
              loading={form.formState.isSubmitting}
            >
              الاستمرار
            </Cta>
          </div>
        </form>
      </Form>
      <ResendButton onClick={onResend} />
    </>
  );
}

function ResendButton({onClick}: {onClick: () => void}) {
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
    <div className="flex flex-col items-center">
      {showButton ? (
        <Cta className="w-full" onClick={handleSubmit}>
          إعادة إرسال
        </Cta>
      ) : (
        <span className="text-gray-500">
          يمكنك إعادة الإرسال بعد {countdown} ثانية
        </span>
      )}
    </div>
  );
}
