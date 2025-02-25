"use client";
import Loading from "../../components/Loading";
import TodoPage from "@/components/Todos";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [showTodos, setShowTodos] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      const timeout = setTimeout(() => {
        setShowTodos(true);
      }, 2000);

      return () => clearTimeout(timeout);
    } 
  }, [status]);

  if (status === "loading") return <Loading />;

  return showTodos ? <TodoPage /> : <Loading />;
}