"use client";
import {changeName, changePassword} from "@/auth/profile/profile.actions";
import {changeNameSchema, changePasswordSchema} from "@/auth/schemas";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {InputOTPForm} from "./InputOTPForm";
import {generateVerificationCode} from "@/auth/email/generator.actions";

interface ActionDialogProps {
  title: string;
  type: string;
  description: string;
  email?: string;
}

export function DialogPopup({
  title,
  type,
  description,
  email,
}: ActionDialogProps) {
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const formName = useForm<z.infer<typeof changeNameSchema>>({
    defaultValues: {
      name: "",
    },
  });
  const formPassword = useForm<z.infer<typeof changePasswordSchema>>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmitName(values: z.infer<typeof changeNameSchema>) {
    setIsPending(true);
    setError(undefined);

    try {
      const error = await changeName(values);
      console.log(values);
      setError(error);
    } finally {
      setIsPending(false);
    }
  }

  async function onSubmitPassword(
    values: z.infer<typeof changePasswordSchema>
  ) {
    setIsPending(true);
    setError(undefined);

    try {
      const error = await changePassword(values);
      console.log(values);
      setError(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      {type === "name" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{title}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...formName}>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={formName.handleSubmit(onSubmitName)}
                className="space-y-4">
                {error && <p className="text-destructive">{error}</p>}
                <FormField
                  control={formName.control}
                  name="name"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Input placeholder="Ion Mocanu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Pending..." : "Update"}{" "}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
      {type === "password" && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{title}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...formPassword}>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={formPassword.handleSubmit(onSubmitPassword)}
                className="space-y-4">
                {error && <p className="text-destructive">{error}</p>}
                <FormField
                  control={formPassword.control}
                  name="currentPassword"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="•••••••••••••••"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formPassword.control}
                  name="newPassword"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="•••••••••••••••"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formPassword.control}
                  name="confirmNewPassword"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="•••••••••••••••"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Pending..." : "Update"}{" "}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
      {type === "email" && (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={async () => {
                  if (!email) return "Something went wrong";
                  await generateVerificationCode(email);
                }}>
                {title}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              <InputOTPForm />
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
