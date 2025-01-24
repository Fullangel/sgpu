import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { ComponentProps } from "react";

type InputProps = ComponentProps<typeof Input>;

interface FormFieldProps extends InputProps {
  label: string;
  error?: FieldError;
  register?: UseFormRegisterReturn;
  className?: string;
}

export const FormField = ({
  label,
  error,
  register,
  className = "",
  ...props
}: FormFieldProps) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor={props.id} className="text-white">
      {label}
    </Label>
    <Input
      className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
      {...props}
      {...register}
    />
    {error && <span className="text-red-500 text-sm">{error.message}</span>}
  </div>
);
