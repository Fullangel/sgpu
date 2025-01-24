interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection = ({
  title,
  children,
  className,
}: FormSectionProps) => (
  <div className={`space-y-4 ${className}`}>
    <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
      {title}
    </h3>
    {children}
  </div>
);
