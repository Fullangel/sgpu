"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Upload, AlertCircle } from "lucide-react";
import { SubjectCard } from "@/components/ui/SubjectCard";
import type { Subject } from "@/types/subject";

export default function MateriasPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((data: Subject[]) => {
        setSubjects(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar las materias:", error);
        setError(
          "Error al cargar las materias. Por favor, intenta de nuevo más tarde."
        );
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File;
    if (!selectedSubjectId || !file) {
      setError("Selecciona una materia y un archivo válido.");
      return;
    }
    try {
      const response = await fetch(
        `/api/subjects/${selectedSubjectId}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        const newMaterial = await response.json();
        setSubjects((prevSubjects) =>
          prevSubjects.map((subject) =>
            subject.id === selectedSubjectId
              ? { ...subject, materials: [...subject.materials, newMaterial] }
              : subject
          )
        );
        setError(null);
      } else {
        setError("Error al subir el material.");
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setError("Ocurrió un error al subir el archivo.");
    }
  };

  const handleEditMaterial = async (
    materialId: number,
    newFileUrl: string,
    newType: string
  ) => {
    try {
      const response = await fetch(`/api/materials/${materialId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_url: newFileUrl, type: newType }),
      });
      if (response.ok) {
        setSubjects((prevSubjects) =>
          prevSubjects.map((subject) => ({
            ...subject,
            materials: subject.materials.map((material) =>
              material.id === materialId
                ? { ...material, file_url: newFileUrl, type: newType }
                : material
            ),
          }))
        );
        setError(null);
      } else {
        setError("Error al editar el material");
      }
    } catch (error) {
      console.error("Error al editar el material:", error);
      setError("Ocurrió un error al editar el material");
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    try {
      const response = await fetch(
        `/api/subjects/${materialId}/delete-material`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setSubjects((prevSubjects) =>
          prevSubjects.map((subject) => ({
            ...subject,
            materials: subject.materials.filter(
              (material) => material.id !== materialId
            ),
          }))
        );
      } else {
        setError("Error al eliminar el material.");
      }
    } catch (error) {
      console.error("Error al eliminar el material:", error);
      setError("Ocurrió un error al eliminar el material.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center text-blue-600"
      >
        Gestión de Materias
      </motion.h1>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            <div className="flex items-center">
              <AlertCircle className="mr-2" />
              <p>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Book className="mr-2" />
            Lista de Materias
          </h2>
          <AnimatePresence>
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onDeleteMaterial={handleDeleteMaterial}
                onEditMaterial={handleEditMaterial} // Pasar la función de edición
              />
            ))}
          </AnimatePresence>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Upload className="mr-2" />
            Subir Material
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="subject_id"
              >
                Selecciona una materia:
              </label>
              <select
                id="subject_id"
                name="subject_id"
                value={selectedSubjectId || ""}
                onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">-- Selecciona una materia --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="file"
              >
                Selecciona un archivo:
              </label>
              <input
                type="file"
                id="file"
                name="file"
                required
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              >
                Subir Material
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Book, Upload, AlertCircle } from "lucide-react";
// import { SubjectCard } from "@/components/ui/SubjectCard";
// import type { Subject } from "@/types/subject";

// export default function MateriasPage() {
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
//     null
//   );
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetch("/api/subjects")
//       .then((res) => res.json())
//       .then((data: Subject[]) => {
//         setSubjects(data);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error al cargar las materias:", error);
//         setError(
//           "Error al cargar las materias. Por favor, intenta de nuevo más tarde."
//         );
//         setIsLoading(false);
//       });
//   }, []);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const formData = new FormData(event.currentTarget);
//     const file = formData.get("file") as File;

//     if (!selectedSubjectId || !file) {
//       setError("Selecciona una materia y un archivo válido.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `/api/subjects/${selectedSubjectId}/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (response.ok) {
//         const newMaterial = await response.json();
//         setSubjects((prevSubjects) =>
//           prevSubjects.map((subject) =>
//             subject.id === selectedSubjectId
//               ? { ...subject, materials: [...subject.materials, newMaterial] }
//               : subject
//           )
//         );
//         setError(null);
//       } else {
//         setError("Error al subir el material.");
//       }
//     } catch (error) {
//       console.error("Error al subir el archivo:", error);
//       setError("Ocurrió un error al subir el archivo.");
//     }
//   };

//   const handleEditMaterial = async (
//     materialId: number,
//     newFileUrl: string,
//     newType: string
//   ) => {
//     try {
//       const response = await fetch(`/api/materials/${materialId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ file_url: newFileUrl, type: newType }),
//       });

//       if (response.ok) {
//         setSubjects((prevSubjects) =>
//           prevSubjects.map((subject) => ({
//             ...subject,
//             materials: subject.materials.map((material) =>
//               material.id === materialId
//                 ? { ...material, file_url: newFileUrl, type: newType }
//                 : material
//             ),
//           }))
//         );
//         setError(null);
//       } else {
//         setError("Error al editar el material");
//       }
//     } catch (error) {
//       console.error("Error al editar el material:", error);
//       setError("Ocurrio un error al editar el material");
//     }
//   };

//   const handleDeleteMaterial = async (materialId: number) => {
//     try {
//       const response = await fetch(
//         `/api/subjects/${materialId}/delete-material`,
//         { method: "DELETE" }
//       );
//       if (response.ok) {
//         setSubjects((prevSubjects) =>
//           prevSubjects.map((subject) => ({
//             ...subject,
//             materials: subject.materials.filter(
//               (material) => material.id !== materialId
//             ),
//           }))
//         );
//       } else {
//         setError("Error al eliminar el material.");
//       }
//     } catch (error) {
//       console.error("Error al eliminar el material:", error);
//       setError("Ocurrió un error al eliminar el material.");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-4xl font-bold mb-8 text-center text-blue-600"
//       >
//         Gestión de Materias
//       </motion.h1>

//       <AnimatePresence>
//         {error && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
//             role="alert"
//           >
//             <div className="flex items-center">
//               <AlertCircle className="mr-2" />
//               <p>{error}</p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="grid md:grid-cols-2 gap-6">
//         <div>
//           <h2 className="text-2xl font-semibold mb-4 flex items-center">
//             <Book className="mr-2" />
//             Lista de Materias
//           </h2>
//           <AnimatePresence>
//             {subjects.map((subject) => (
//               <SubjectCard
//                 key={subject.id}
//                 subject={subject}
//                 onDeleteMaterial={handleDeleteMaterial}
//               />
//             ))}
//           </AnimatePresence>
//         </div>

//         <div>
//           <h2 className="text-2xl font-semibold mb-4 flex items-center">
//             <Upload className="mr-2" />
//             Subir Material
//           </h2>
//           <form
//             onSubmit={handleSubmit}
//             className="bg-white rounded-lg shadow-lg p-6"
//           >
//             <div className="mb-4">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="subject_id"
//               >
//                 Selecciona una materia:
//               </label>
//               <select
//                 id="subject_id"
//                 name="subject_id"
//                 value={selectedSubjectId || ""}
//                 onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
//                 required
//                 className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               >
//                 <option value="">-- Selecciona una materia --</option>
//                 {subjects.map((subject) => (
//                   <option key={subject.id} value={subject.id}>
//                     {subject.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-6">
//               <label
//                 className="block text-gray-700 text-sm font-bold mb-2"
//                 htmlFor="file"
//               >
//                 Selecciona un archivo:
//               </label>
//               <input
//                 type="file"
//                 id="file"
//                 name="file"
//                 required
//                 className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <button
//                 type="submit"
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
//               >
//                 Subir Material
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
