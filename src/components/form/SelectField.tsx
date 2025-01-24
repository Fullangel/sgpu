import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  options: { value: string; label: string }[];
  field: ControllerRenderProps<T, "nationality">;
  error?: any;
}

export const SelectField = <T extends FieldValues>({
  label,
  options,
  field,
  error,
}: SelectFieldProps<T>) => (
  <div className="space-y-2">
    <label className="text-white text-sm font-medium">{label}</label>
    <Select
      onValueChange={field.onChange}
      value={field.value}
      defaultValue={field.value}
    >
      <SelectTrigger className="bg-white/20 border-white/30 text-white">
        <SelectValue placeholder={`Selecciona ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && <span className="text-red-500 text-sm">{error.message}</span>}
  </div>
);
