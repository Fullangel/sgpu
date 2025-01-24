const PersonalInfoSection = ({ register, errors }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white">Información Personal</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        label="Primer Nombre"
        id="first_name"
        {...register("first_name", { required: "Requerido" })}
        error={errors.first_name}
      />
      {/* Repetir para otros campos */}
    </div>
  </div>
);
