import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, InferInsertModel } from "drizzle-orm";

type SaveUserProps = InferInsertModel<typeof users>;

export async function SaveUser({
  id,
  email,
  profileData,
}: SaveUserProps): Promise<{ userId: string; email: string } | null> {
  try {
    if (!id || !email) return null;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (existingUser.length > 0) {
      return null;
    }

    const newUser = await db
      .insert(users)
      .values({
        id,
        email,
        profileData,
      })
      .onConflictDoNothing({ target: users.id })
      .returning();

    if (newUser.length === 0) {
      return null;
    }

    return {
      userId: id,
      email,
    };
  } catch (error) {
    if (error instanceof Error)
      console.error("Error creating the user", error.message);
    return null;
  }
}
