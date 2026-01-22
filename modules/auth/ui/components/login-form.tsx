"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";
import { LoginInput, loginSchema } from "../../domain/schemas";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: LoginInput) => {
    setIsLoading(true);
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/",
    });

    if (error) {
      toast.error(error?.message || "Could not create account");
    }

    setIsLoading(false);
    console.log(isLoading);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Welcome Back</CardTitle>
        <CardDescription>
          <span className="text-custom-primary">Sign in</span> to continue
          shopping
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          onClick={async () =>
            await authClient.signIn.social({ provider: "google" })
          }
        >
          <FaGoogle />
        </Button>

        <div className="relative my-10">
          <Separator />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="bg-card mt-1 px-3 text-sm text-custom-primary">
              Or
            </span>
          </span>
        </div>

        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="example@gmail.com"
                  type="email"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Password</FieldLabel>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
                  type="password"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" variant="primary" className="w-full mt-6">
            {isLoading ? <Spinner /> : "Login"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground">
          Dont have an account?{" "}
          <Link href="/sign-up" passHref>
            <span className="text-custom-primary underline">Sign Up</span>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
