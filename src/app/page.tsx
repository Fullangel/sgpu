import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 via-transparent to-blue-600/30 animate-gradient-slow" />

      {/* Header */}
      <header className="relative border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={150}
            height={80}
            className="w-auto h-10"
          />
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Sistema de Gestión de
              <br />
              Preparadurías Universitario
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Potenciando el aprendizaje colaborativo y el desarrollo académico
              en la educación superior
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-white">
                  Cursos Activos
                </h3>
                <BookOpen className="h-5 w-5 text-blue-200" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">24</div>
              <p className="text-sm text-blue-200">Abarcando 6 facultades</p>
            </div>

            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-white">Preparadores</h3>
                <Users className="h-5 w-5 text-blue-200" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">52</div>
              <p className="text-sm text-blue-200">
                Apoyando a +500 estudiantes
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-white">
                  Horas Totales
                </h3>
                <Clock className="h-5 w-5 text-blue-200" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">1,248</div>
              <p className="text-sm text-blue-200">Este semestre</p>
            </div>

            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-white">
                  Mejora Académica
                </h3>
                <TrendingUp className="h-5 w-5 text-blue-200" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">18%</div>
              <p className="text-sm text-blue-200">Incremento en rendimiento</p>
            </div>
          </div>

          {/* Info Sections */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">
                Cursos Destacados
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Cálculo I", students: 89 },
                  { name: "Matemáticas", students: 76 },
                  { name: "Programación", students: 68 },
                  { name: "Lógica", students: 62 },
                ].map((course) => (
                  <div
                    key={course.name}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-white">{course.name}</span>
                    <span className="text-blue-200">
                      {course.students} estudiantes
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">
                Impacto del Programa
              </h3>
              <div className="space-y-4">
                {[
                  { metric: "Tasa de aprobación", value: "Incremento del 22%" },
                  {
                    metric: "Promedio de calificaciones",
                    value: "Aumento de 1.5 puntos",
                  },
                  { metric: "Retención estudiantil", value: "Mejora del 15%" },
                  {
                    metric: "Satisfacción estudiantil",
                    value: "92% de aprobación",
                  },
                ].map((stat) => (
                  <div
                    key={stat.metric}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-white">{stat.metric}</span>
                    <span className="text-blue-200">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-blue-200">
            <div>
              <h4 className="font-semibold text-white mb-3">Recursos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Guía de Usuario
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Soporte
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Enlaces</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Preparadores
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Profesores
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Estudiantes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Términos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-blue-200">
            <p>&copy; 2025 SGPU. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
