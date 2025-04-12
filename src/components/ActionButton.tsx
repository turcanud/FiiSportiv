"use client";
import {Button} from "./ui/button";
import {useState} from "react";

interface ActionButtonProps {
  action: () => Promise<string | undefined>;
  defaultText: string;
  pendingText?: string;
  variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

const ActionButton = ({
  action,
  defaultText,
  pendingText = "Pending...",
  variant,
  className,
}: ActionButtonProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleAction() {
    setIsPending(true);
    try {
      await action();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleAction}
      disabled={isPending}>
      {isPending ? pendingText : defaultText}
    </Button>
  );
};

export default ActionButton;
