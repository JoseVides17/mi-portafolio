"use client";

import Image from "next/image";
import { useState, FormEvent, useEffect, useRef } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    errorMessage: ""
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const sectionsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Cerrar el menú cuando se hace clic en un enlace
  const handleLinkClick = (sectionId: string) => {
    setIsMenuOpen(false);
    scrollToSection(sectionId);
  };

  // Función para hacer scroll suave a una sección
  const scrollToSection = (sectionId: string) => {
    const section = sectionsRef.current[sectionId];
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Ajuste para el navbar fijo
        behavior: "smooth"
      });
    }
  };

  // Detectar la sección activa durante el scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Ajuste para detectar la sección actual
      
      Object.entries(sectionsRef.current).forEach(([id, element]) => {
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar el menú cuando se cambia el tamaño de la ventana a un tamaño grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      errorMessage: ""
    });

    try {
      // Enviar el formulario a nuestra API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje');
      }
      
      setFormStatus({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        errorMessage: ""
      });
      
      // Limpiar el formulario después de un envío exitoso
      setFormData({
        name: "",
        email: "",
        message: ""
      });
      
      // Mostrar mensaje de éxito por 5 segundos
      setTimeout(() => {
        setFormStatus(prev => ({
          ...prev,
          isSuccess: false
        }));
      }, 5000);
      
    } catch (error) {
      setFormStatus({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : "Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Mi Portafolio</h1>
          
          {/* Botón de menú hamburguesa para móviles */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {/* Menú de navegación para pantallas grandes */}
          <div className="hidden md:flex gap-6">
            <a 
              href="#inicio" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("inicio");
              }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                activeSection === "inicio" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
              }`}
            >
              Inicio
            </a>
            <a 
              href="#sobre-mi" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("sobre-mi");
              }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                activeSection === "sobre-mi" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
              }`}
            >
              Sobre Mí
            </a>
            <a 
              href="#habilidades" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("habilidades");
              }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                activeSection === "habilidades" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
              }`}
            >
              Habilidades
            </a>
            <a 
              href="#proyectos" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("proyectos");
              }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                activeSection === "proyectos" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
              }`}
            >
              Proyectos
            </a>
            <a 
              href="#contacto" 
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contacto");
              }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                activeSection === "contacto" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
              }`}
            >
              Contacto
            </a>
          </div>
        </div>
        
        {/* Menú móvil */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? "max-h-64 opacity-100 visible" 
              : "max-h-0 opacity-0 invisible"
          } overflow-hidden bg-white dark:bg-gray-900 shadow-lg`}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a 
              href="#inicio" 
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("inicio");
              }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 py-2 border-b border-gray-200 dark:border-gray-700 transition-colors ${
                activeSection === "inicio" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
              }`}
            >
              Inicio
            </a>
            <a 
              href="#sobre-mi" 
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("sobre-mi");
              }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 py-2 border-b border-gray-200 dark:border-gray-700 transition-colors ${
                activeSection === "sobre-mi" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
              }`}
            >
              Sobre Mí
            </a>
            <a 
              href="#habilidades" 
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("habilidades");
              }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 py-2 border-b border-gray-200 dark:border-gray-700 transition-colors ${
                activeSection === "habilidades" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
              }`}
            >
              Habilidades
            </a>
            <a 
              href="#proyectos" 
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("proyectos");
              }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 py-2 border-b border-gray-200 dark:border-gray-700 transition-colors ${
                activeSection === "proyectos" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
              }`}
            >
              Proyectos
            </a>
            <a 
              href="#contacto" 
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("contacto");
              }}
              className={`hover:text-blue-600 dark:hover:text-blue-400 py-2 transition-colors ${
                activeSection === "contacto" ? "text-blue-600 dark:text-blue-400 font-medium" : ""
              }`}
            >
              Contacto
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="inicio" 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current["inicio"] = el; }}
        className="pt-24 pb-12 px-4 transition-all duration-500 ease-in-out"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">¡Hola! Soy <span className="text-blue-600 dark:text-blue-400">Jose Vides Baron</span></h1>
            <p className="text-xl mb-6">Desarrollador de Software</p>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Apasionado por crear experiencias web increíbles y soluciones innovadoras.
            </p>
            <div className="flex gap-4">
              <a 
                href="#contacto" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                onClick={() => scrollToSection("contacto")}
              >
                Contáctame
              </a>
              <a 
                href="#proyectos" 
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:scale-105"
                onClick={() => scrollToSection("proyectos")}
              >
                Ver Proyectos
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-blue-500 dark:border-blue-400 transform hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 z-10"></div>
              <Image 
                src="/perfil.jpeg" 
                alt="Foto de perfil" 
                width={256} 
                height={256} 
                className="object-cover w-full h-full"
                priority
              />
            
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Mí Section */}
      <section 
        id="sobre-mi" 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current["sobre-mi"] = el; }}
        className="py-16 px-4 bg-gray-50 dark:bg-gray-800 transition-all duration-500 ease-in-out"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Sobre Mí</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Soy un desarrollador de software con un enfoque principal en el desarrollo backend, especializándome en la creación de APIs robustas, 
              arquitecturas de bases de datos eficientes y sistemas escalables. Mi experiencia en tecnologías como Laravel, Java y PHP me permite 
              diseñar soluciones backend que son tanto potentes como mantenibles.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Aunque mi fortaleza está en el backend, también tengo experiencia en desarrollo frontend, lo que me permite crear aplicaciones web completas 
              y entender el flujo de datos desde la base de datos hasta la interfaz de usuario. Esta visión integral me permite colaborar efectivamente 
              con equipos multidisciplinarios y aportar soluciones que consideran tanto la experiencia del usuario como la eficiencia del servidor.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Mi objetivo es crear soluciones que no solo sean funcionales y escalables, sino también seguras y optimizadas para el rendimiento, 
              priorizando siempre las mejores prácticas de desarrollo y los patrones de diseño establecidos.
            </p>
          </div>
        </div>
      </section>

      {/* Habilidades Section */}
      <section 
        id="habilidades" 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current["habilidades"] = el; }}
        className="py-16 px-4 transition-all duration-500 ease-in-out"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Mis Habilidades</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: "HTML/CSS", level: "90%" },
              { name: "JavaScript", level: "85%" },
              { name: "Angular", level: "80%" },
              { name: "Laravel", level: "75%" },
              { name: "Java", level: "70%" },
              { name: "PHP", level: "75%" },
              { name: "React", level: "65%" },
              { name: "Node.js", level: "60%" },
              { name: "TypeScript", level: "55%" },
              { name: "Next.js", level: "60%" },
              { name: "SQL", level: "65%" },
              { name: "Git", level: "80%" },
            ].map((skill) => (
              <div key={skill.name} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
                <h3 className="font-semibold mb-2">{skill.name}</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: skill.level }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proyectos Section */}
      <section 
        id="proyectos" 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current["proyectos"] = el; }}
        className="py-16 px-4 bg-gray-50 dark:bg-gray-800 transition-all duration-500 ease-in-out"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Mis Proyectos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((project) => (
              <div key={project} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105">
                <div className="h-48 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  {/* Aquí puedes agregar imágenes de tus proyectos */}
                  <span className="text-gray-500 dark:text-gray-400">Imagen del Proyecto</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Nombre del Proyecto {project}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Descripción breve del proyecto y las tecnologías utilizadas.
                  </p>
                  <div className="flex gap-2">
                    <a href="#" className="text-blue-600 hover:underline">Demo</a>
                    <a href="#" className="text-blue-600 hover:underline">Código</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section 
        id="contacto" 
        ref={(el: HTMLDivElement | null) => { sectionsRef.current["contacto"] = el; }}
        className="py-16 px-4 transition-all duration-500 ease-in-out"
      >
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Contáctame</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 transition-all duration-300"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Mensaje</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 transition-all duration-300"
              ></textarea>
            </div>
            
            {formStatus.isSuccess && (
              <div className="p-4 bg-green-100 text-green-700 rounded-lg transition-all duration-300">
                ¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.
              </div>
            )}
            
            {formStatus.isError && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg transition-all duration-300">
                {formStatus.errorMessage}
              </div>
            )}
            
            <button
              type="submit"
              disabled={formStatus.isSubmitting}
              className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300 ${
                formStatus.isSubmitting 
                  ? "opacity-70 cursor-not-allowed" 
                  : "hover:bg-blue-700 transform hover:scale-105"
              }`}
            >
              {formStatus.isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Enviar Mensaje"
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-100 dark:bg-gray-900 transition-all duration-500 ease-in-out">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Jose Vides. Todos los derechos reservados.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <a 
              href="https://github.com/JoseVides17" 
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/josevides17" 
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
            <a 
              href="https://x.com/videsbaron" 
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              <span>Twitter</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
