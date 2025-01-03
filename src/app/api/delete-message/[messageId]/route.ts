import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  req: NextRequest,
  context: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const messageId = context.params.messageId;

    if (!session || !user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const deletedMessage = await prisma.message.delete({
      where: { id: messageId },
    });

    if (!deletedMessage) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE handler:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
