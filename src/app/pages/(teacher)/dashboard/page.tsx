// src/app/(teacher)/dashboard/page.tsx
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

// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { Users, BookOpen, FileText, Calendar } from "lucide-react";
// import { useEffect, useState } from "react";
// import { MetricCard } from "@/components/ui/metric-card";
// import { ScheduleCard } from "@/components/ui/schedule-card";
// import { ActivityCard } from "@/components/ui/activity-card";

// interface Schedule {
//   day: string;
//   sessions: number;
// }

// interface Activity {
//   id: number;
//   user: string;
//   action: string;
//   subject: string;
//   time: string;
// }

// export default function TeacherDashboard() {
//   const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
//   const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Simular la carga de datos desde una API
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true);

//         // Simulación de datos obtenidos desde una API
//         const mockScheduleData: Schedule[] = [
//           { day: "Lun", sessions: 2 },
//           { day: "Mar", sessions: 1 },
//           { day: "Mié", sessions: 3 },
//           { day: "Jue", sessions: 2 },
//           { day: "Vie", sessions: 1 },
//           { day: "Sáb", sessions: 0 },
//           { day: "Dom", sessions: 0 },
//         ];

//         const mockRecentActivities: Activity[] = [
//           {
//             id: 1,
//             user: "María González",
//             action: "subió un nuevo material",
//             subject: "Cálculo I",
//             time: "Hace 2 horas",
//           },
//           {
//             id: 2,
//             user: "Carlos Ramírez",
//             action: "completó una sesión",
//             subject: "Física Básica",
//             time: "Hace 4 horas",
//           },
//           {
//             id: 3,
//             user: "Ana Torres",
//             action: "programó una nueva sesión",
//             subject: "Química",
//             time: "Hace 6 horas",
//           },
//         ];

//         // Simular un retraso de red
//         await new Promise((resolve) => setTimeout(resolve, 1000));

//         setScheduleData(mockScheduleData);
//         setRecentActivities(mockRecentActivities);
//       } catch (error) {
//         console.error("Error al cargar los datos del dashboard:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-8"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 Dr. Luis Martínez
//               </h1>
//               <p className="text-gray-600">Profesor</p>
//             </div>
//             <div className="flex space-x-2">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
//                 aria-label="Ver calendario"
//               >
//                 <Calendar className="h-5 w-5 text-gray-600" />
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
//                 aria-label="Ver lista de usuarios"
//               >
//                 <Users className="h-5 w-5 text-gray-600" />
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Metrics Grid */}
//         <AnimatePresence>
//           {isLoading ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
//             >
//               {[...Array(4)].map((_, index) => (
//                 <div
//                   key={index}
//                   className="bg-white rounded-lg shadow-md p-4 animate-pulse"
//                 >
//                   <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                   <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//                 </div>
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
//             >
//               <MetricCard
//                 title="Mis Preparadores"
//                 value={5}
//                 subtitle="En 3 materias"
//                 icon={Users}
//                 delay={0.1}
//               />
//               <MetricCard
//                 title="Materias con Preparaduría"
//                 value={3}
//                 subtitle="Este semestre"
//                 icon={BookOpen}
//                 delay={0.2}
//               />
//               <MetricCard
//                 title="Material Compartido"
//                 value={12}
//                 subtitle="Documentos y recursos"
//                 icon={FileText}
//                 delay={0.3}
//               />
//               <MetricCard
//                 title="Próxima Reunión"
//                 value="Mañana"
//                 subtitle="11:00 AM - Coordinación"
//                 icon={Calendar}
//                 delay={0.4}
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Schedule and Activity Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.5 }}
//           >
//             <ScheduleCard days={scheduleData} />
//           </motion.div>
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.6 }}
//           >
//             <ActivityCard activities={recentActivities} />
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }
