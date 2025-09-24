"use client";
import React, { useState } from "react";
import {
  verificationCodeSchema,
  type VerificationCodeFormSchema,
} from "@/lib/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import Container from "../container";
import Card from "./card";
import Title from "./title";
import SubTitle from "./subtitle";
import Input from "./input";
import Button from "./button";

interface EmailVerificationFormProps {
  handleVerify: (data: VerificationCodeFormSchema) => Promise<void>;
}

export default function EmailVerificationForm({
  handleVerify,
}: EmailVerificationFormProps) {
  const [error, setError] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const { signUp } = useSignUp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VerificationCodeFormSchema>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerificationCodeFormSchema) => {
    try {
      setError("");
      await handleVerify(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Verification failed");
    }
  };

  const resendCode = async () => {
    setIsResending(true);
    try {
      if (signUp) {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error resending verification code:", error.message);
      } else {
        console.error("Unexpected error resending verification code:", error);
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Container>
      <div className="mx-2 flex min-h-screen items-center justify-center sm:mx-4">
        <Card>
          <Title>Verify Your Email</Title>
          <SubTitle>
            Please enter the verification code sent to your email.
          </SubTitle>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 flex w-full max-w-sm flex-col items-center gap-4"
          >
            <Input
              type="text"
              placeholder="Verification Code"
              {...register("code")}
              className="w-full"
            />
            {error && (
              <p className="w-full text-left text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
          <div>
            <p className="font-quicksand mt-4 text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={resendCode}
                disabled={isResending}
                className="text-blue-600 underline hover:text-blue-800 disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend"}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </Container>
  );
}
