import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ControllerRenderProps,
  FieldValues,
  FieldError,
} from "react-hook-form";
import { AlertCircle } from "lucide-react";

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  options: { value: string; label: string }[];
  field: ControllerRenderProps<T, any>;
  error?: FieldError;
  className?: string;
}

export const SelectField = <T extends FieldValues>({
  label,
  options,
  field,
  error,
  className = "",
}: SelectFieldProps<T>) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-white/80 text-sm font-medium">{label}</label>
    <Select
      onValueChange={field.onChange}
      value={field.value}
      defaultValue={field.value}
    >
      <SelectTrigger className="bg-white/5 border-white/20 text-white hover:bg-white/10 focus:ring-2 focus:ring-blue-300">
        <SelectValue placeholder={`Selecciona ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent className="bg-white/5 border-white/20 backdrop-blur-lg">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="hover:bg-white/10 focus:bg-white/10"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    {error && (
      <div className="text-red-300 text-sm flex items-center gap-1 mt-1">
        <AlertCircle className="h-4 w-4" />
        <span>{error.message}</span>
      </div>
    )}
  </div>
);

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ControllerRenderProps, FieldValues } from "react-hook-form";

// interface SelectFieldProps<T extends FieldValues> {
//   label: string;
//   options: { value: string; label: string }[];
//   field: ControllerRenderProps<T, "nationality">;
//   error?: any;
// }

// export const SelectField = <T extends FieldValues>({
//   label,
//   options,
//   field,
//   error,
// }: SelectFieldProps<T>) => (
//   <div className="space-y-2">
//     <label className="text-white text-sm font-medium">{label}</label>
//     <Select
//       onValueChange={field.onChange}
//       value={field.value}
//       defaultValue={field.value}
//     >
//       <SelectTrigger className="bg-white/20 border-white/30 text-white">
//         <SelectValue placeholder={`Selecciona ${label.toLowerCase()}`} />
//       </SelectTrigger>
//       <SelectContent>
//         {options.map((option) => (
//           <SelectItem key={option.value} value={option.value}>
//             {option.label}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//     {error && <span className="text-red-500 text-sm">{error.message}</span>}
//   </div>
// );
