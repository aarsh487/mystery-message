import prisma from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    try {

        const { username, email, password } = await req.json();
        const existingUserByUsername = await prisma.user.findFirst({
            where: {
                username,
                isVerified: true
            }
        });

        if(existingUserByUsername){
            return  NextResponse.json({
                success: false,
                message: "Username Taken"
            },
            { status: 400 }
            );
        }

        const existingUserByEmail = await prisma.user.findFirst({
            where: {
                email
            }
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
                return  NextResponse.json({
                    success: false,
                    message: "User already exists"
                },
                { status: 400 }
                );
        } else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifyCodeExpiry = new Date(Date.now() + 3600000)

            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry,
                    isVerified : true
                }
            })   
        }

        return  NextResponse.json({
            success: true,
            message: 'User registered successfully'
        },
        { status: 201 }
        );

    } catch (error) {
        console.log("Error registering user:", error)
        return NextResponse.json({
            success: false,
            message: "Error registering user"
        },
        { status: 500 }
        );
    }
    
}