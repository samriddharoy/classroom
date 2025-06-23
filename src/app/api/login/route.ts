import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase} from "@/lib/mongodb";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    await connectToDatabase ();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: "Login successful",
        role: user.role || "student", // default to student if no role field
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
