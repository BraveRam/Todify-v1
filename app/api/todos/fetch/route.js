import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Todo } from "@/models/TodoModel";
import { connect } from "@/lib/mongodb";

export async function POST(request) {
  await connect();

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized: You do not have permission to access this resource." }, { status: 401 });
    }
    const todos = await Todo.find({ email: session.user.email }).lean(); 
    return NextResponse.json(todos, { status: 200 });

  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}