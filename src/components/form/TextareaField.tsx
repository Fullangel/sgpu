import { Textarea } from "@/components/ui/textarea";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface TextareaFieldProps {
  label: string;
  id: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
}

export const TextareaField = ({
  label,
  id,
  register,
  error,
  className,
}: TextareaFieldProps) => (
  <div className={`space-y-2 ${className}`}>
    <label htmlFor={id} className="text-white text-sm font-medium">
      {label}
    </label>
    <Textarea
      id={id}
      className="bg-white/20 border-white/30 text-white placeholder:text-white/70 min-h-[100px]"
      {...register}
    />
    {error && <span className="text-red-500 text-sm">{error.message}</span>}
  </div>
);
