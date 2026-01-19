"use client";

import { forwardRef } from "react";

interface TextInputProps {
  id: string;
  label: string;
  type?: "text" | "email";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id,
      label,
      type = "text",
      placeholder,
      value,
      onChange,
      error,
      disabled = false,
      required = false,
      autoComplete,
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#111827]"
        >
          {label}
          {required && <span className="text-[#EF4444] ml-1">*</span>}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-label={label}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-lg border ${
            error
              ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
              : "border-[#E5E7EB] focus:border-[#4DA3FF] focus:ring-[#4DA3FF]/20"
          } bg-white px-4 py-3 text-base text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] transition-colors`}
        />
        {error && (
          <p
            id={`${id}-error`}
            className="text-sm text-[#EF4444]"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
