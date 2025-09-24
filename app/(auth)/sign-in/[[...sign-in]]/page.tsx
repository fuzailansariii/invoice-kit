"use client";
import Card from "@/components/auth-card/card";
import SubTitle from "@/components/auth-card/subtitle";
import Title from "@/components/auth-card/title";
import Container from "@/components/container";
import Image from "next/image";
import { useState } from "react";
import fuzail from "@/public/Fuzail.jpg";
import Input from "@/components/auth-card/input";
import Button from "@/components/auth-card/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { ImGithub } from "react-icons/im";
import { useSignIn } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormSchema } from "@/lib/schemas/auth";
import SocialButton from "@/components/auth-card/socialButton";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [error, setError] = useState<string>("");

  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormSchema) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // console.log("Login Data:", data);
    const { email, password } = data;
    if (!isLoaded) return;
    try {
      setError("");
      const result = await signIn?.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.push("/"); // or dashboard
      } else {
        setError("Sign-in failed. Please try again.");
        console.error("Sign-in not complete:", result);
      }
    } catch (error: any) {
      if (error.errors && error.errors[0]) {
        setError(error.errors[0].message); // Clerk provides detailed errors
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <Container className="">
      <div className="flex min-h-screen items-center justify-center sm:mx-4">
        <Card>
          <Image
            src={fuzail}
            height={50}
            width={50}
            alt="fuzail"
            className="mb-5 rounded-full object-cover"
          />
          <Title>Welcome Back</Title>
          <SubTitle>
            Don't have an account yet?{" "}
            <Link
              href="/sign-up"
              className="cursor-pointer text-blue-600 underline hover:text-blue-800"
            >
              Register
            </Link>
          </SubTitle>
          {error && (
            <p className="border-destructive mt-2 rounded-xl border p-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="flex w-full max-w-sm flex-col items-center">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-auto mt-6 flex w-full flex-col items-center gap-4"
            >
              <div className="w-full">
                <Input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="w-full text-left text-sm text-red-600">
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
                  <p className="w-full text-left text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting} variant="primary">
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            <div className="my-2 flex w-full items-center justify-center gap-2">
              <Separator className="flex-1" />
              <SubTitle>or</SubTitle>
              <Separator className="flex-1" />
            </div>
            <div className="flex w-full gap-4">
              <SocialButton
                icon={<FcGoogle className="h-6 w-6" />}
                label="Sign-up with Google"
              />
              <SocialButton
                icon={<ImGithub className="h-6 w-6" />}
                label="Sign-up with GitHub"
              />
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}
