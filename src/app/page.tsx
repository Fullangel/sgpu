"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, TrendingUp } from "lucide-react";
import { useRef } from "react";
import Particles from "../components/Particles";
import { useInView } from "react-intersection-observer";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 relative overflow-hidden">
      <Particles className="absolute inset-0 z-0" />

      {/* Floating background elements */}
      <motion.div
        className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{ x: [-100, 100], rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute bottom-40 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
        animate={{ y: [0, -100], rotate: [0, 360] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Header con efecto parallax */}
      <motion.header
        style={{ opacity, scale }}
        className="relative border-b border-white/10 backdrop-blur-sm py-2"
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <Image
                src="/logo.svg"
                alt="Sistema de Gestión"
                width={120}
                height={40}
                priority
                quality={85}
                className="transition-opacity opacity-0 duration-500 hover:scale-105"
                onLoadingComplete={(img) => {
                  img.classList.remove("opacity-0");
                  img.classList.add("drop-shadow-logo");
                }}
                sizes="(max-width: 768px) 80px, 120px"
                style={{
                  objectFit: "contain",
                  objectPosition: "left",
                  width: "auto",
                  height: "auto",
                }}
              />
              <span className="text-white text-lg font-semibold hidden md:block">
                SGPU
              </span>
            </motion.div>
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
<<<<<<< HEAD
              <Button className="bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg hover:-translate-y-0.5 transition-transform">
=======
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Contenido principal */}
      <motion.main ref={targetRef} className="relative z-10">
        <div className="container mx-auto px-4 py-32">
          {/* Sección Hero */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 leading-tight">
              Transformando la Educación
              <br />
              <span className="text-blue-200 animate-pulse-slow">
                con Innovación
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Potenciando el aprendizaje colaborativo y el desarrollo académico
              en la educación superior
            </p>
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
                className="p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/20 hover:border-blue-300/50 hover:bg-white/10 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {/* Cursos destacados */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/20 hover:shadow-xl transition-all"
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

            {/* Impacto del programa */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/20 hover:shadow-xl transition-all"
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
                      whileInView={{ width: `${stat.percentage}%` }}
                      transition={{ delay: index * 0.1 }}
                      className="h-2 bg-white/10 rounded-full overflow-hidden"
                    >
                      <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500" />
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>

      {/* Footer con animación holográfica */}
      <footer
        ref={footerRef}
        className="relative border-t border-white/10 py-12 bg-gradient-to-b from-blue-900/50 to-blue-900"
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
    </div>
  );
}
