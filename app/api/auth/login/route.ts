import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, email: true, name: true, password: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not registered" }, { status: 400 });
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }

  const token = generateToken(user);

  return NextResponse.json({ message: "Login successful", token });
}
