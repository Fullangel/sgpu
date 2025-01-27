import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { ComponentProps, forwardRef } from "react";
import { AlertCircle } from "lucide-react";

type InputProps = ComponentProps<typeof Input>;

interface FormFieldProps extends InputProps {
  label: string;
  error?: FieldError;
  register?: UseFormRegisterReturn;
  className?: string;
  inputClassName?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, register, className = "", ...props }, ref) => {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label htmlFor={props.id} className="text-white/80">
          {label}
        </Label>
        <Input
          ref={ref}
          className={`bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-300 ${
            error ? "border-red-500" : ""
          }`}
          {...props}
          {...register}
        />
        {error && (
          <div className="text-red-300 text-sm flex items-center gap-1 mt-1">
            <AlertCircle className="h-4 w-4" />
            <span>{error.message}</span>
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
