import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user.id;

  try {
    const sortedMessages = await prisma.message.findMany({
      where: { userId: userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
    

    if (!sortedMessages || sortedMessages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Messages not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messages: sortedMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error getting messages", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting messages",
      },
      { status: 500 }
    );
  }
}
