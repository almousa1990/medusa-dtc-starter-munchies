"use client";

import type {StoreCustomer} from "@medusajs/types";

import {login, refresh, register} from "@/actions/medusa/auth";
import {navigate} from "@/actions/medusa/navigate";
import Body from "@/components/shared/typography/body";
import {useState} from "react";

import AuthMethodForm from "../auth-method-form";
import OtpForm from "../otp-form";
import SignupForm from "../signup-form";

type Step = "method" | "otp" | "signup";

interface AuthFlowProps {
  customer: StoreCustomer | null;
  redirect: string; // Accept referer as a prop
}
export default function AuthFlow({customer, redirect}: AuthFlowProps) {
  const [step, setStep] = useState<Step>("method");
  const [stateKey, setStateKey] = useState<null | string>(null);

  const [error, setError] = useState("");
  const [userInput, setUserInput] = useState<{email?: string; phone?: string}>(
    {},
  );

  function handleAuthSuccess(
    newStateKey: string,
    type: "email" | "phone",
    identifier?: string,
  ) {
    setError("");
    setStateKey(newStateKey);
    setUserInput({[type]: identifier}); // Store the identifier
    setStep("otp");
  }

  async function handleVerificationSuccess(token: string) {
    setError("");
    const response = await login(token);

    if (response.success) {
      if (!response.customer) {
        setStep("signup");
      } else {
        await navigate(redirect); // Server-side redirect
      }
    } else {
      const response = await register(token);
      if (response.success) {
        setStep("signup");
      }
    }
  }

  async function handleRestart() {
    setError("");

    setStep("method");
  }

  async function handleSignupSuccess() {
    // Refresh auth token
    const response = await refresh();

    if (response.success) {
      console.log("User logged in successfully!");
      await navigate(redirect); // Server-side redirect
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {step === "method" && (
        <AuthMethodForm onError={setError} onSuccess={handleAuthSuccess} />
      )}
      {step === "otp" && stateKey && (
        <OtpForm
          input={{stateKey, email: userInput.email, phone: userInput.phone}}
          onError={setError}
          onRestart={handleRestart}
          onSuccess={handleVerificationSuccess}
        />
      )}
      {step === "signup" && (
        <SignupForm
          input={userInput}
          onError={setError}
          onSuccess={handleSignupSuccess}
        />
      )}
    </div>
  );
}
