import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import prisma from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
            email: { label: "email", type: "text" },
            password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<any> {
                try {

                    if (!credentials) {
                        throw new Error("Email & Password are required");
                    }

                    const user = await prisma.user.findFirst({
                        where: {
                            email: credentials.email
                        }
                    })

                    if(!user){
                        throw new Error("No user found with this email")
                    }

                    if(!user.isVerified){
                        throw new Error("Account not verified")
                    }

                    const isComparePassword = await bcrypt.compare(credentials.password, user.password);

                    if(isComparePassword){
                        return user;
                    }else{
                        throw new Error ('Incorrect password')
                    }

                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user){
                token.id = user.id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },

        async session({ session, token }) {
            if (token){
                session.user.id = token.id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/signin'
    }
};