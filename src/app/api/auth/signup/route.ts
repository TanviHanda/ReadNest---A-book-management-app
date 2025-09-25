import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, universityId, password, universityCard } = body;

    // Log incoming signup data (avoid logging passwords in production)
    // eslint-disable-next-line no-console
    console.log('signup payload', { fullName, email, universityId, universityCard });

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate universityId is a safe 32-bit integer for the DB column
    const uniIdNum = Number(universityId || 0);
    const INT32_MIN = -2147483648;
    const INT32_MAX = 2147483647;
    if (!Number.isInteger(uniIdNum) || uniIdNum < INT32_MIN || uniIdNum > INT32_MAX) {
      return NextResponse.json({ error: 'Invalid universityId value' }, { status: 400 });
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

    // eslint-disable-next-line no-console
    console.log("signup success for", email);

    return NextResponse.json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('signup error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
