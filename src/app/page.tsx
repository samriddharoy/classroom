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
          <button
            onClick={() => router.push("/teacher/upload")}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Teacher: Upload Notes
          </button>

          <button
            onClick={() => router.push("/student/notes")}
            className="w-full px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Student: Download Notes
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
