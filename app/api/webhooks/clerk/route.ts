import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    // Verify webhook event
    const evt = (await verifyWebhook(req)) as WebhookEvent;

    console.log(`Clerk webhook received: ${evt.type}`);

    if (evt.type === "user.created") {
      const user = evt.data;

      const id = user.id;
      const email = user.email_addresses?.[0]?.email_address || "";
      const profileData = {
        clerkId: user.id,
        email,
        username: user.username,
        profile_url: user.image_url || "",
      };

      console.log("Inserting/Updating user in DB:", id);

      await db
        .insert(users)
        .values({
          id,
          email,
          profileData,
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email,
            profileData,
            updatedAt: new Date(),
          },
        });

      console.log(`👤 User ${id} created/updated in DB`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error verifying webhook or saving user:", error.message);
    }
    return new Response("Error verifying webhook", { status: 400 });
  }
}
