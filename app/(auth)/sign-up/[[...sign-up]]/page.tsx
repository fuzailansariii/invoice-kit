"use client";
import Card from "@/components/auth-card/card";
import SubTitle from "@/components/auth-card/subtitle";
import Title from "@/components/auth-card/title";
import Container from "@/components/container";
import Image from "next/image";
import React, { useState } from "react";
import fuzail from "@/public/Fuzail.jpg";
import Input from "@/components/auth-card/input";
import Button from "@/components/auth-card/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import {
  signUpSchema,
  type SignUpFormSchema,
  type VerificationCodeFormSchema,
} from "@/lib/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SocialButton from "@/components/auth-card/socialButton";
import { useSignUp } from "@clerk/nextjs";
// import axios, { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
import EmailVerificationForm from "@/components/auth-card/emailVerificationForm";

export default function SignUp() {
  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<boolean>(false);
  // const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const { signUp, isLoaded, setActive } = useSignUp();

  const onSubmit = async (data: SignUpFormSchema) => {
    setError("");
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // console.log(data);
    if (!isLoaded) return;
    try {
      const { username, email, password } = data;
      const finalUsername = username?.trim();
      const finalEmail = email.trim();
      const finalPassword = password.trim();
      if (!finalEmail || !finalUsername || !finalPassword) {
        throw new Error("All input fields are required");
      }
      if (!signUp) {
        throw new Error("Sign-up Service is not available");
      }

      // create user in clerk
      await signUp.create({
        username: finalUsername,
        emailAddress: finalEmail,
        password: finalPassword,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setIsVerifying(true);
      reset();
    } catch (error) {
      // Add this to show errors to users
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  const handleEmailVerification = async (data: VerificationCodeFormSchema) => {
    if (!signUp || !isLoaded) return;
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // TODO: add toast notificatino for email verification successfully
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  if (isVerifying) {
    return <EmailVerificationForm handleVerify={handleEmailVerification} />;
  }

  const handleGoogleSignUp = async () => {
    if (!signUp || !isLoaded) {
      setError("Sign-up service is not ready. Please try again.");
      return;
    }
    setIsOAuthLoading(true);
    setError("");
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "sign-up/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (error) {
      console.error("Google Sign-Up error", error);
      if (error instanceof Error) {
        setError(`Google sign-up failed: ${error.message}`);
      } else {
        setError("Google sign-up failed, Please try again.");
      }
      setIsOAuthLoading(false);
    }
  };

  // const handleGitHubSignUp = async () => {};

  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center sm:mx-4">
        <Card>
          <Image
            src={fuzail}
            height={50}
            width={50}
            alt="fuzail"
            className="mb-5 rounded-full object-cover"
          />
          <Title>Create Your Account</Title>
          <SubTitle>
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="cursor-pointer text-blue-600 underline hover:text-blue-800"
            >
              Sign In
            </Link>
          </SubTitle>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="flex w-full max-w-sm flex-col items-center">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-auto mt-6 flex w-full flex-col items-center gap-4"
            >
              <div className="w-full">
                <Input
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* CAPTCHA Widget */}
              <div id="clerk-captcha" />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
            <div className="my-2 flex w-full items-center justify-center gap-2">
              <Separator className="flex-1" />
              <SubTitle>or</SubTitle>
              <Separator className="flex-1" />
            </div>
            <div className="flex w-full gap-4">
              <SocialButton
                onClick={handleGoogleSignUp}
                icon={<FcGoogle className="h-6 w-6" />}
                label={isOAuthLoading ? "Connecting..." : "Google"}
                disabled={isOAuthLoading}
              />
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}
