"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useFormField } from "@/components/ui/form";

type CustomInputProps = {
  isTextarea?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const CustomInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  CustomInputProps
>(({ isTextarea, className, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  const Component = isTextarea ? "textarea" : "input";

  return React.createElement(Component, {
    ref,
    id: formItemId,
    "aria-describedby": !error
      ? `${formDescriptionId}`
      : `${formDescriptionId} ${formMessageId}`,
    "aria-invalid": !!error,
    className: cn(
      "flex w-full rounded-[1px]  border-input bg-bgInput text-textColor px-3 py-2 text-base ring-offset-background placeholder:text-textColor focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:bg-[#e2e9f1] disabled:cursor-not-allowed disabled:opacity-50",
      error
        ? "border-red-500 focus:ring-2 focus-visible:ring-0 focus-visible:bg-[#fff]"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500",
      className
    ),
    ...props,
  });
});

CustomInput.displayName = "CustomInput";

export { CustomInput };
