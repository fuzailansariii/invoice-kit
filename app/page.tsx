"use client";
import Button from "@/components/auth-card/button";
import Container from "@/components/container";
import { useClerk } from "@clerk/nextjs";

export default function Home() {
  const { signOut } = useClerk();
  const { user } = useClerk();
  console.log("User:", user?.id);
  console.log("remerge the code");

  return (
    <Container className="">
      <div className="flex h-full items-center justify-center">
        <div className="flex w-full justify-center rounded-3xl border-2 border-dashed border-gray-300 bg-white/10 p-10 backdrop-blur-md">
          <div className="font-quicksand text-4xl font-semibold">
            Hello World
          </div>
          {user && (
            <>
              <div className="font-quicksand ml-4 text-xl">
                User ID: {user.id}
              </div>
              <Button type="button" variant="primary" onClick={() => signOut()}>
                Sign-out
              </Button>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
