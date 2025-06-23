"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const onSubmit = async (data: any) => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      if (role === "teacher") {
        router.push("/teacher/upload");
      } else {
        router.push("/student/notes");
      }
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {role === "teacher" ? "Teacher Login" : "Student Login"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="w-full border rounded px-3 py-2"
            />
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full border rounded px-3 py-2"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
