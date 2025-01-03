import prisma from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { sendverificationEmail } from "@/constants/sendVerificationEmail";

export async function POST(req: NextRequest) {
    try {

        const { username, email, password } = await req.json();
        const existingUserByUsename = await prisma.user.findFirst({
            where: {
                username,
                isVerified: true
            }
        });

        if(existingUserByUsename){
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
            if(existingUserByEmail.isVerified){
                return  NextResponse.json({
                    success: false,
                    message: "User already exists"
                },
                { status: 400 }
                );
            } else{
                const hashedPassword = await bcrypt.hash(password, 10);
                const verifyCodeExpiry = new Date(Date.now() + 3600000)
                await prisma.user.update({
                    where:{
                        email
                    },
                    data: {
                        password: hashedPassword,
                        verifyCode,
                        verifyCodeExpiry,
                    }
                })
            }
        } else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifyCodeExpiry = new Date(Date.now() + 3600000)

            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry
                }
            })   
        }

        const emailResponse = await sendverificationEmail(email, username, verifyCode);
        if(!emailResponse.success){
            return  NextResponse.json({
                success: false,
                message: emailResponse.message
            },
            { status: 500 }
            );
        }

        return  NextResponse.json({
            success: true,
            message: 'User registered successfully. Please verify your account.'
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