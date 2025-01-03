'use client'

import { verifySchema } from "@/schemas/verifySchema";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function page() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Verification sucessfull",
        description: response.data.message,
      });

      router.replace("/dashboard");
    } catch (error) {
      console.error("Error during signup:", error);

      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage = axiosError.response?.data.message;

      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Verify your account
            </h1>
            <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verifivation code</FormLabel>
                  <FormControl>
                    <Input placeholder="code" {...field} value={field.value || ""}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
            </form>
        </Form>
    </div>
  </div>;
}

export default page;
