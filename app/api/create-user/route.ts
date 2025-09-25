import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          message: "User already exist",
          user: user.emailAddresses[0].emailAddress,
        },

        { status: 200 },
      );
    }

    const newUser = await db
      .insert(users)
      .values({
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileData: {
          clerkId: user.id,
          username: user.firstName,
        },
      })
      .returning();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating the user");
    return NextResponse.json(
      { error: "Failed to create new user" },
      { status: 500 },
    );
  }
}
