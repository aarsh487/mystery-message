import prisma from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, content } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "User not accepting Messages",
        },
        { status: 403 }
      );
    }

    await prisma.message.create({
      data: {
        content,
        createdAt: new Date(),
        userId: user.id
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error sending messages", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error sending messages",
      },
      { status: 500 }
    );
  }
}
