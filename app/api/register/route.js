import { NextResponse } from "next-auth/next";
import { db } from "../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const existingUsers = await db.query('SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1', [username, email]);
    const existingUser = existingUsers.length > 0 ? existingUsers[0] : null;

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Username or email already exists" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
      username,
      email,
      hashedPassword
    ]);
    const newUserId = typeof result.insertId === 'bigint' ? Number(result.insertId) : result.insertId;
    const user = { id: newUserId, username };

    return new Response(JSON.stringify({ message: "User created successfully", user: { id: user.id, username: user.username } }), { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
