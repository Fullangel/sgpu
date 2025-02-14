import { motion } from "framer-motion";
import { User, FileText, Trash2 } from "lucide-react";
import type { Subject } from "@/types/subject";
import type React from "react"; // Added import for React

interface SubjectCardProps {
  subject: Subject;
  onDeleteMaterial: (materialId: number) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onDeleteMaterial,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow"
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-600">{subject.name}</h2>
      <div className="flex items-center mb-2">
        <User className="mr-2 text-gray-500" />
        <p className="text-gray-700">
          Profesor: {subject.teacher?.name || "Sin asignar"}
        </p>
      </div>
      <div className="flex items-center mb-4">
        <User className="mr-2 text-gray-500" />
        <p className="text-gray-700">
          Preparador: {subject.preparer?.name || "Sin asignar"}
        </p>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-blue-500">Materiales:</h3>
      <ul className="space-y-2">
        {subject.materials.map((material) => (
          <motion.li
            key={material.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between bg-gray-100 p-2 rounded"
          >
            <a
              href={material.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FileText className="mr-2" />
              {material.file_url.split("/").pop()}
            </a>
            <button
              onClick={() => onDeleteMaterial(material.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
