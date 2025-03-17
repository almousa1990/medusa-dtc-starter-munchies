"use client";

import type {StoreCustomer} from "@medusajs/types";

import {login, refresh, register} from "@/actions/medusa/auth";
import Body from "@/components/shared/typography/body";
import {useRouter} from "next/navigation";
import {useState} from "react";

import AuthMethodForm from "../auth-method-form";
import OtpForm from "../otp-form";
import SignupForm from "../signup-form";

type Step = "authMethod" | "otp" | "signup";

interface AuthFlowProps {
  customer: StoreCustomer | null;
  referer: string; // Accept referer as a prop
}
export default function AuthFlow({customer, referer}: AuthFlowProps) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("authMethod");
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
        router.push(referer);
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

    setStep("authMethod");
  }

  async function handleSignupSuccess() {
    // Refresh auth token
    const response = await refresh();

    if (response.success) {
      console.log("User logged in successfully!");
      router.push(referer);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {step === "authMethod" && (
        <AuthMethodForm onErorr={setError} onSuccess={handleAuthSuccess} />
      )}
      {step === "otp" && stateKey && (
        <OtpForm
          input={{stateKey}}
          onErorr={setError}
          onRestart={handleRestart}
          onSuccess={handleVerificationSuccess}
        />
      )}
      {step === "signup" && (
        <SignupForm
          input={userInput}
          onErorr={setError}
          onSuccess={handleSignupSuccess}
        />
      )}
      <Body>{error}</Body>
    </div>
  );
}
