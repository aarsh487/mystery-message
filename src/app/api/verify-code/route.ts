// import prisma from "@/lib/dbConnect";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { username, code } = await req.json();
//     const decodedUsername = decodeURIComponent(username);

//     const user = await prisma.user.findFirst({
//       where: {
//         username: decodedUsername,
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "User not found",
//         },
//         { status: 404 }
//       );
//     }

//     const isCodeValid = user.verifyCode === code;
//     const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

//     if (isCodeNotExpired && isCodeValid) {
//       await prisma.user.update({
//         where: {
//           username,
//         },
//         data: {
//           isVerified: true,
//         },
//       });
//       return NextResponse.json(
//         {
//           success: true,
//           message: "User verified",
//         },
//         { status: 200 }
//       );
//     } else if (!isCodeNotExpired) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Code expired! Signup again",
//         },
//         { status: 400 }
//       );
//     } else {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid Code! Signup again",
//         },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     console.log("Error checking username:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error checking username",
//       },
//       { status: 500 }
//     );
//   }
// }
