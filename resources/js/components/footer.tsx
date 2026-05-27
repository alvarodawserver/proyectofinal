import React from "react";
import { Link } from "@inertiajs/react";

const Footer = () => {
  return (
    <footer className="bg-[#004d4d] text-gray-200 py-16 px-6 border-t border-[#003333]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        
        <div className="md:col-span-1 flex flex-col gap-4">
          <h2 className="text-3xl font-serif text-[#e8e4db]">Refugio del Mar</h2>
          <p className="text-sm text-gray-300 leading-relaxed pr-4">
            Tu escapada perfecta al paraíso. Un rincón único diseñado para sorprender y gestionar tus estancias de la forma más cómoda.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[#e8e4db] font-bold text-sm tracking-widest uppercase mb-1">Contacto</h4>
          <p className="text-sm text-teal-400 font-medium">+34 644 638 741</p>
          <p className="text-sm text-teal-400 font-medium">contacto@refugiodelmar.com</p>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[#e8e4db] font-bold text-sm tracking-widest uppercase mb-1">¿Qué quieres hacer?</h4>
          <Link href="/contacto-propietario" className="text-sm text-gray-300 hover:text-white transition-colors">
            Contáctanos
          </Link>
          <a href="/mis-reservas" className="text-sm text-gray-300 hover:text-white transition-colors">
            Mis reservas
          </a>
          <a href="/busqueda?entrada=&lugar=&personas=1&salida=" className="text-sm text-gray-300 hover:text-white transition-colors">
            Ver hoteles
          </a>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[#e8e4db] font-bold text-sm tracking-widest uppercase mb-1">Síguenos</h4>
          <div className="flex gap-5 text-sm font-bold text-teal-400">
            <a href="#" className="hover:text-white transition-colors tracking-wide">Facebook</a>
            <a href="#" className="hover:text-white transition-colors tracking-wide">Instagram</a>
            <a href="#" className="hover:text-white transition-colors tracking-wide">Twitter</a>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-[#003333] text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Refugio del Mar. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;