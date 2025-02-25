// import { NextResponse } from "next/server";
// import { Todo } from "../../../../models/TodoModel";
// import { connect } from "@/lib/mongodb";
// 
// export async function POST(request) {
//   await connect();
//   try {
//     const { email } = await request.json();
// 
//     const todos = await Todo.find({ email: email });
// 
//     if (todos && todos.length > 0) {
//       return NextResponse.json(todos, { status: 200 });
//     } else {
//       return NextResponse.json({ message: "Todo not found" }, { status: 200 });
//     }
//     
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Todo } from "@/models/TodoModel";
import { connect } from "@/lib/mongodb";

export async function POST(request) {
  await connect();

  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch only the authenticated user's todos
    const todos = await Todo.find({ email: session.user.email });

    return NextResponse.json(todos.length > 0 ? todos : { message: "No todos found" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}