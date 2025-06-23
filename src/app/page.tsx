"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="max-w-md w-full p-6">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            Welcome to Notes Share
          </CardTitle>
          <CardDescription className="text-center mt-2 mb-6 text-lg">
            Please select your role to continue:
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 items-center">
          {/* Teacher Section */}
          <div className="w-full">
            <button
              onClick={() => router.push("/signup?role=teacher")}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Teacher: Sign Up
            </button>
            <p className="text-center text-sm mt-2">
              Already registered?{" "}
              <button
                onClick={() => router.push("/login?role=teacher")}
                className="text-blue-600 underline"
              >
                Login as Teacher
              </button>
            </p>
          </div>

          {/* Student Section */}
          <div className="w-full">
            <button
              onClick={() => router.push("/signup?role=student")}
              className="w-full px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Student: Sign Up
            </button>
            <p className="text-center text-sm mt-2">
              Already registered?{" "}
              <button
                onClick={() => router.push("/login?role=student")}
                className="text-green-600 underline"
              >
                Login as Student
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
