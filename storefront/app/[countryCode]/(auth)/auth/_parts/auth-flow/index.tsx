"use client";

import type {StoreCustomer} from "@medusajs/types";

import {login, refresh, register} from "@/actions/medusa/auth";
import {navigate} from "@/actions/medusa/navigate";
import {useState} from "react";

import AuthMethodForm from "../auth-method-form";
import OtpForm from "../otp-form";
import SignupForm from "../signup-form";
import {useRouter} from "next/navigation";

type Step = "method" | "otp" | "signup";

interface AuthFlowProps {
  customer: StoreCustomer | null;
  redirect: string; // Accept referer as a prop
}
export default function AuthFlow({customer, redirect}: AuthFlowProps) {
  const [step, setStep] = useState<Step>("method");
  const [stateKey, setStateKey] = useState<null | string>(null);
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const [userInput, setUserInput] = useState<{email?: string; phone?: string}>(
    {},
  );

  function handleAuthSuccess(
    newStateKey: string,
    type: "email" | "phone",
    identifier?: string,
  ) {
    setStateKey(newStateKey);
    setUserInput({[type]: identifier}); // Store the identifier
    setStep("otp");
  }

  async function handleVerificationSuccess(token: string) {
    const response = await login(token);
    console.log("verifcation sucess", response);

    if (response.success) {
      console.log("response success", response);

      if (!response.customer) {
        setStep("signup");
      } else {
        console.log("should navigate to", redirect);
        setDisabled(true);
        router.push(redirect); // Server-side redirect
      }
    } else {
      const response = await register(token);
      if (response.success) {
        setStep("signup");
      }
    }
  }

  async function handleRestart() {
    setStep("method");
  }

  async function handleSignupSuccess() {
    // Refresh auth token
    const response = await refresh();

    if (response.success) {
      await navigate(redirect); // Server-side redirect
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {step === "method" && (
        <AuthMethodForm disabled={disabled} onSuccess={handleAuthSuccess} />
      )}
      {step === "otp" && stateKey && (
        <OtpForm
          disabled={disabled}
          input={{email: userInput.email, phone: userInput.phone, stateKey}}
          onRestart={handleRestart}
          onSuccess={handleVerificationSuccess}
        />
      )}
      {step === "signup" && (
        <SignupForm
          disabled={disabled}
          input={userInput}
          onSuccess={handleSignupSuccess}
        />
      )}
    </div>
  );
}
