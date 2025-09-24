import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, universityId, password, universityCard } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(String(password), 10);

    await db.insert(users).values({
      fullName,
      email,
      universityId: Number(universityId || 0),
      password: hashed,
      universityCard: universityCard || "",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('signup error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
