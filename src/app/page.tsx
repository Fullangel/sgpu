"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, TrendingUp, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import Particles from "../components/Particles";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const stats = [
  {
    icon: BookOpen,
    title: "Cursos Activos",
    value: "24",
    description: "Abarcando 6 facultades",
  },
  {
    icon: Users,
    title: "Preparadores",
    value: "52",
    description: "Apoyando a +500 estudiantes",
  },
  {
    icon: Clock,
    title: "Horas Totales",
    value: "1,248",
    description: "Este semestre",
  },
  {
    icon: TrendingUp,
    title: "Mejora Académica",
    value: "18%",
    description: "Incremento en rendimiento",
  },
];

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const { ref: footerRef, inView: footerInView } = useInView({
    triggerOnce: true,
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetch("/api/auth/create-admin")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error al verificar administrador", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      <Particles className="absolute inset-0 z-0" quantity={100} />

      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{ x: [-100, 100], rotate: [0, 360] }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute bottom-40 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
        animate={{ y: [0, -100], rotate: [0, 360] }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Header con efecto parallax */}
      <motion.header
        style={{ opacity, scale }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-blue-900/80 to-transparent backdrop-blur-sm py-4"
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative w-12 h-12 md:w-16 md:h-16"
            >
              <Image
                src="/logo.svg"
                alt="SGPU Logo"
                layout="fill"
                objectFit="contain"
                priority
                quality={100}
                className="transition-opacity opacity-0 duration-500 hover:scale-105"
                onLoadingComplete={(img) => {
                  img.classList.remove("opacity-0");
                  img.classList.add("drop-shadow-logo");
                }}
              />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 font-bold text-2xl md:text-3xl tracking-wide hover:scale-105 transition-transform drop-shadow-glow animate-pulse-slow"
            >
              SGPU
            </motion.span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 group relative overflow-hidden hover:-translate-y-0.5 transition-all"
              >
                <span className="relative z-10">Iniciar Sesión</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Contenido principal */}
      <motion.main ref={targetRef} className="relative z-10 pt-24">
        <div className="container mx-auto px-4 py-32">
          {/* Sección Hero */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
                Transformando la Educación
              </span>
              <br />
              <span className="text-blue-200 animate-pulse-slow relative inline-block">
                con Innovación
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-blue-100 max-w-2xl mx-auto"
            >
              Potenciando el aprendizaje colaborativo y el desarrollo académico
              en la educación superior
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-lg px-8 py-3">
                Comienza Ahora
              </Button>
            </motion.div>
          </motion.div>

          {/* Estadísticas interactivas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/20 hover:border-blue-300/50 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    {stat.title}
                  </h3>
                  <stat.icon className="h-6 w-6 text-blue-300 group-hover:text-white transition-colors" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <p className="text-sm text-blue-200">{stat.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Secciones de características */}
          <div className="mb-24">
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-lg bg-white/10 p-1">
                {["Cursos Destacados", "Impacto del Programa"].map(
                  (tab, index) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(index)}
                      className={`px-4 py-2 rounded-md transition-all ${
                        activeTab === index
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : "text-blue-200 hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
            </div>
            <AnimatePresence mode="wait">
              {activeTab === 0 ? (
                <motion.div
                  key="cursos"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/20 hover:shadow-xl transition-all"
                >
                  <h3 className="text-2xl font-semibold text-white mb-6">
                    Cursos Destacados
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: "Cálculo I", students: 89 },
                      { name: "Matemáticas", students: 76 },
                      { name: "Programación", students: 68 },
                      { name: "Lógica", students: 62 },
                    ].map((course, index) => (
                      <motion.div
                        key={course.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <span className="text-white">{course.name}</span>
                        <span className="text-blue-200">
                          {course.students} estudiantes
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="impacto"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/20 hover:shadow-xl transition-all"
                >
                  <h3 className="text-2xl font-semibold text-white mb-6">
                    Impacto del Programa
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        metric: "Tasa de aprobación",
                        value: "22%",
                        percentage: 78,
                      },
                      {
                        metric: "Promedio de calificaciones",
                        value: "+1.5 pts",
                        percentage: 65,
                      },
                      {
                        metric: "Retención estudiantil",
                        value: "15%",
                        percentage: 85,
                      },
                      { metric: "Satisfacción", value: "92%", percentage: 92 },
                    ].map((stat, index) => (
                      <div key={stat.metric} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white">{stat.metric}</span>
                          <span className="text-blue-200">{stat.value}</span>
                        </div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.percentage}%` }}
                          transition={{ delay: index * 0.1, duration: 0.8 }}
                          className="h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sección CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 py-16"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Listo para transformar tu educación?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Únete a nuestra comunidad y lleva tu aprendizaje al siguiente
              nivel.
            </p>
            <Button className="bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg hover:-translate-y-0.5 transition-all text-lg px-8 py-3">
              Comienza tu viaje
            </Button>
          </div>
        </motion.div>

        {/* Footer con animación holográfica */}
        <footer
          ref={footerRef}
          className="relative border-t border-white/10 py-12 bg-gradient-to-b from-blue-900/50 to-purple-900/50"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={footerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-blue-200">
              {/* Recursos */}
              <div>
                <h4 className="font-semibold text-white mb-3">Recursos</h4>
                <ul className="space-y-2">
                  {["Guía de Usuario", "Preguntas Frecuentes", "Soporte"].map(
                    (item, index) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={footerInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href="#"
                          className="hover:text-white transition-colors"
                        >
                          {item}
                        </Link>
                      </motion.li>
                    )
                  )}
                </ul>
              </div>

              {/* Enlaces */}
              <div>
                <h4 className="font-semibold text-white mb-3">Enlaces</h4>
                <ul className="space-y-2">
                  {["Preparadores", "Profesores", "Estudiantes"].map(
                    (item, index) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={footerInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        <Link
                          href="#"
                          className="hover:text-white transition-colors"
                        >
                          {item}
                        </Link>
                      </motion.li>
                    )
                  )}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold text-white mb-3">Legal</h4>
                <ul className="space-y-2">
                  {["Términos de Uso", "Privacidad"].map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={footerInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      <Link
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {item}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={footerInView ? { opacity: 1 } : {}}
              className="mt-12 pt-8 border-t border-white/10 text-center"
            >
              <p className="text-blue-200 text-sm">
                &copy; 2025 SGPU. Todos los derechos reservados.
              </p>
            </motion.div>
          </motion.div>
        </footer>
      </motion.main>
    </div>
  );
}

// "use client";

// import { motion, useScroll, useTransform } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { BookOpen, Users, Clock, TrendingUp } from "lucide-react";
// import { useRef } from "react";
// import Particles from "../components/Particles";
// import { useInView } from "react-intersection-observer";

// const stats = [
//   {
//     icon: BookOpen,
//     title: "Cursos Activos",
//     value: "24",
//     description: "Abarcando 6 facultades",
//   },
//   {
//     icon: Users,
//     title: "Preparadores",
//     value: "52",
//     description: "Apoyando a +500 estudiantes",
//   },
//   {
//     icon: Clock,
//     title: "Horas Totales",
//     value: "1,248",
//     description: "Este semestre",
//   },
//   {
//     icon: TrendingUp,
//     title: "Mejora Académica",
//     value: "18%",
//     description: "Incremento en rendimiento",
//   },
// ];

// export default function Home() {
//   const targetRef = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({ target: targetRef });
//   const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
//   const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
//   const { ref: footerRef, inView: footerInView } = useInView({
//     triggerOnce: true,
//   });

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 relative overflow-hidden">
//       <Particles className="absolute inset-0 z-0" />

//       {/* Floating background elements */}
//       <motion.div
//         className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
//         animate={{ x: [-100, 100], rotate: [0, 360] }}
//         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//       />

//       <motion.div
//         className="absolute bottom-40 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
//         animate={{ y: [0, -100], rotate: [0, 360] }}
//         transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
//       />

//       {/* Header con efecto parallax */}
//       <motion.header
//         style={{ opacity, scale }}
//         className="relative border-b border-white/10 backdrop-blur-sm py-4"
//       >
//         <div className="container mx-auto px-4 flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: "spring", stiffness: 100 }}
//               className="relative w-36 h-16"
//             >
//               <Image
//                 src="/logo.svg"
//                 alt="Sistema de Gestión"
//                 width={128}
//                 height={64}
//                 priority
//                 quality={100}
//                 className="transition-opacity opacity-0 duration-500 hover:scale-105 object-contain"
//                 onLoadingComplete={(img) => {
//                   img.classList.remove("opacity-0");
//                   img.classList.add("drop-shadow-logo");
//                 }}
//                 sizes="(max-width: 768px) 80px, 120px"
//               />
//               <motion.span
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 font-bold text-xl ml-3 tracking-wide hover:scale-105 transition-transformdrop-shadow-glow animate-pulse-slow"
//               >
//                 SGPU
//               </motion.span>
//             </motion.div>
//           </div>
//           <div className="flex gap-4">
//             <Link href="/auth/login">
//               <Button
//                 variant="ghost"
//                 className="text-white hover:bg-white/10 group relative overflow-hidden hover:-translate-y-0.5 transition-all"
//               >
//                 <span className="relative z-10">Iniciar Sesión</span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//               </Button>
//             </Link>
//             <Link href="/auth/register">
//               <Button className="bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg hover:-translate-y-0.5 transition-transform">
//                 Registrarse
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </motion.header>

//       {/* Contenido principal */}
//       <motion.main ref={targetRef} className="relative z-10">
//         <div className="container mx-auto px-4 py-32">
//           {/* Sección Hero */}
//           <motion.div
//             initial={{ y: 50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.8 }}
//             className="text-center text-white mb-16"
//           >
//             <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 leading-tight">
//               Transformando la Educación
//               <br />
//               <span className="text-blue-200 animate-pulse-slow">
//                 con Innovación
//               </span>
//             </h1>
//             <p className="text-xl text-blue-100 max-w-2xl mx-auto">
//               Potenciando el aprendizaje colaborativo y el desarrollo académico
//               en la educación superior
//             </p>
//           </motion.div>

//           {/* Estadísticas interactivas */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={stat.title}
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ delay: index * 0.1 }}
//                 whileHover={{ scale: 1.05 }}
//                 className="p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/20 hover:border-blue-300/50 hover:bg-white/10 transition-all group relative overflow-hidden"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-xl font-semibold text-white">
//                     {stat.title}
//                   </h3>
//                   <stat.icon className="h-6 w-6 text-blue-300 group-hover:text-white transition-colors" />
//                 </div>
//                 <div className="text-4xl font-bold text-white mb-2">
//                   {stat.value}
//                 </div>
//                 <p className="text-sm text-blue-200">{stat.description}</p>
//               </motion.div>
//             ))}
//           </div>

//           {/* Secciones de características */}
//           <div className="grid md:grid-cols-2 gap-8 mb-24">
//             {/* Cursos destacados */}
//             <motion.div
//               initial={{ x: -100, opacity: 0 }}
//               whileInView={{ x: 0, opacity: 1 }}
//               viewport={{ once: true, margin: "-100px" }}
//               className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/20 hover:shadow-xl transition-all"
//             >
//               <h3 className="text-2xl font-semibold text-white mb-6">
//                 Cursos Destacados
//               </h3>
//               <div className="space-y-4">
//                 {[
//                   { name: "Cálculo I", students: 89 },
//                   { name: "Matemáticas", students: 76 },
//                   { name: "Programación", students: 68 },
//                   { name: "Lógica", students: 62 },
//                 ].map((course, index) => (
//                   <motion.div
//                     key={course.name}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="flex justify-between items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
//                   >
//                     <span className="text-white">{course.name}</span>
//                     <span className="text-blue-200">
//                       {course.students} estudiantes
//                     </span>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>

//             {/* Impacto del programa */}
//             <motion.div
//               initial={{ x: 100, opacity: 0 }}
//               whileInView={{ x: 0, opacity: 1 }}
//               viewport={{ once: true, margin: "-100px" }}
//               className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/20 hover:shadow-xl transition-all"
//             >
//               <h3 className="text-2xl font-semibold text-white mb-6">
//                 Impacto del Programa
//               </h3>
//               <div className="space-y-4">
//                 {[
//                   {
//                     metric: "Tasa de aprobación",
//                     value: "22%",
//                     percentage: 78,
//                   },
//                   {
//                     metric: "Promedio de calificaciones",
//                     value: "+1.5 pts",
//                     percentage: 65,
//                   },
//                   {
//                     metric: "Retención estudiantil",
//                     value: "15%",
//                     percentage: 85,
//                   },
//                   { metric: "Satisfacción", value: "92%", percentage: 92 },
//                 ].map((stat, index) => (
//                   <div key={stat.metric} className="space-y-2">
//                     <div className="flex justify-between items-center">
//                       <span className="text-white">{stat.metric}</span>
//                       <span className="text-blue-200">{stat.value}</span>
//                     </div>
//                     <motion.div
//                       initial={{ width: 0 }}
//                       whileInView={{ width: `${stat.percentage}%` }}
//                       transition={{ delay: index * 0.1 }}
//                       className="h-2 bg-white/10 rounded-full overflow-hidden"
//                     >
//                       <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500" />
//                     </motion.div>
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.main>

//       {/* Footer con animación holográfica */}
//       <footer
//         ref={footerRef}
//         className="relative border-t border-white/10 py-12 bg-gradient-to-b from-blue-900/50 to-blue-900"
//       >
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={footerInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.5 }}
//           className="container mx-auto px-4"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-blue-200">
//             {/* Recursos */}
//             <div>
//               <h4 className="font-semibold text-white mb-3">Recursos</h4>
//               <ul className="space-y-2">
//                 {["Guía de Usuario", "Preguntas Frecuentes", "Soporte"].map(
//                   (item, index) => (
//                     <motion.li
//                       key={item}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={footerInView ? { opacity: 1, x: 0 } : {}}
//                       transition={{ delay: index * 0.1 }}
//                     >
//                       <Link
//                         href="#"
//                         className="hover:text-white transition-colors"
//                       >
//                         {item}
//                       </Link>
//                     </motion.li>
//                   )
//                 )}
//               </ul>
//             </div>

//             {/* Enlaces */}
//             <div>
//               <h4 className="font-semibold text-white mb-3">Enlaces</h4>
//               <ul className="space-y-2">
//                 {["Preparadores", "Profesores", "Estudiantes"].map(
//                   (item, index) => (
//                     <motion.li
//                       key={item}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={footerInView ? { opacity: 1, x: 0 } : {}}
//                       transition={{ delay: index * 0.1 + 0.2 }}
//                     >
//                       <Link
//                         href="#"
//                         className="hover:text-white transition-colors"
//                       >
//                         {item}
//                       </Link>
//                     </motion.li>
//                   )
//                 )}
//               </ul>
//             </div>

//             {/* Legal */}
//             <div>
//               <h4 className="font-semibold text-white mb-3">Legal</h4>
//               <ul className="space-y-2">
//                 {["Términos de Uso", "Privacidad"].map((item, index) => (
//                   <motion.li
//                     key={item}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={footerInView ? { opacity: 1, x: 0 } : {}}
//                     transition={{ delay: index * 0.1 + 0.4 }}
//                   >
//                     <Link
//                       href="#"
//                       className="hover:text-white transition-colors"
//                     >
//                       {item}
//                     </Link>
//                   </motion.li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Copyright */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={footerInView ? { opacity: 1 } : {}}
//             className="mt-12 pt-8 border-t border-white/10 text-center"
//           >
//             <p className="text-blue-200 text-sm">
//               &copy; 2025 SGPU. Todos los derechos reservados.
//             </p>
//           </motion.div>
//         </motion.div>
//       </footer>
//     </div>
//   );
// }
