"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  saving?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  savingLabel?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function SaveButton({
  saving = false,
  disabled = false,
  className,
  label = "Save",
  savingLabel = "Saving…",
  onClick,
  type = "submit",
}: SaveButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={saving || disabled}
      className={cn("min-w-[100px]", className)}
    >
      {saving ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <Save className="w-4 h-4 mr-2" />
      )}
      {saving ? savingLabel : label}
    </Button>
  );
}
