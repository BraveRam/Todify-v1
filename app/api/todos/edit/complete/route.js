import { NextResponse } from "next/server";
import { Todo } from "../../../../../models/TodoModel";
import { connect } from "@/lib/mongodb";

export async function POST(request) {
  await connect();

  try {
    const { todoId, completed } = await request.json();
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }
    
    await Todo.findByIdAndUpdate(todoId, {completed: completed});

    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}