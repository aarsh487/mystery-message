import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendverificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
          });

        return { success: true, message: "Verification email send successfully"}
        
    } catch (Emailerror) {
        console.log("Error sending verification email", Emailerror);
        return { success: false, message: "Failed to send verification email"}
    }
}
   