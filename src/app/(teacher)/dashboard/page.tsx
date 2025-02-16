import { motion } from "framer-motion";

export default function TeacherDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 p-8"
    >
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard del Profesor
      </h1>
      <p className="mt-4 text-gray-600">
        Bienvenido al panel de control del profesor.
      </p>
    </motion.div>
  );
}
