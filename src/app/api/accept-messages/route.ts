import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const user = session?.user;
  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user.id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isAcceptingMessage: acceptMessages,
      },
    });

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to find user",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Messages acceptance status updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating message status", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating message status",
      },
      { status: 500 }
    );
  }
};


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
  
    const user = session?.user;
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }
  
    try {
      const foundUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        }
      });
  
      if (!foundUser) {
        return NextResponse.json(
          {
            success: false,
            message: "Unable to find user",
          },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        {
          success: true,
          isAcceptingMessages: foundUser.isAcceptingMessage,
        },
        { status: 200 }
      );
    } catch (error) {
      console.log("Error getting message status", error);
      return NextResponse.json(
        {
          success: false,
          message: "Error getting message status",
        },
        { status: 500 }
      );
    }
  };
  
  
  