import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const hashed = await hash(password, 10);

  const user = await prisma.user.create({
    data: { email, name, password: hashed },
  });

  return NextResponse.json({ message: "User registered", user });
}
