// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications/createNotification";
import { getUserNotifications } from "@/lib/notifications/getUserNotifications";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const notifs = await getUserNotifications(userId);
  return NextResponse.json(notifs);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.userId || !body.title || !body.message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const notif = await createNotification(body);
  return NextResponse.json(notif);
}
