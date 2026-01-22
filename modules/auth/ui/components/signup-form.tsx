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
import { RegisterInput, registerSchema } from "../../domain/schemas";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FaGoogle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: RegisterInput) => {
    setIsLoading(true);

    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      callbackURL: "/",
    });

    if (error) {
      toast.error(error?.message || "Could not create account");
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Create Your Account</CardTitle>
        <CardDescription>
          <span className="text-custom-primary">Sign up</span> to shop the
          latest styles and track your orders.
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
            <span className="mt-1 rounded-md text-red px-3 text-sm text-custom-primary bg-card">
              Or
            </span>
          </span>
        </div>

        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>

                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="John Doe"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

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

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Confirm Password</FieldLabel>

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
            {isLoading ? <Spinner /> : "Sign Up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" passHref>
            <span className="text-custom-primary underline">Login</span>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
