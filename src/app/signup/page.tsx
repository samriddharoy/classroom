"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ ...data, role }),
    });

    if (res.ok) {
      // After successful signup, go to login with the same role
      router.push(`/login?role=${role}`);
    } else {
      alert("Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {role === "teacher" ? "Teacher Sign Up" : "Student Sign Up"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("name")}
              placeholder="Name"
              className="w-full border rounded px-3 py-2"
            />
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
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Sign Up
            </button>

            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push(`/login?role=${role}`)}
                className="text-blue-600 underline"
              >
                Login
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
