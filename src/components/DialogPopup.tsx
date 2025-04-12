"use client";
import {changeName} from "@/auth/actions";
import {changeNameSchema} from "@/auth/schemas";
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

export function DialogPopup() {
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const form = useForm<z.infer<typeof changeNameSchema>>({
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof changeNameSchema>) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Change Name</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>Change Name</DialogTitle>
            <DialogDescription>
              Make changes to your name here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-destructive">{error}</p>}
            <FormField
              control={form.control}
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
  );
}
