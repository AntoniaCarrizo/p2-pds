import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Inicio() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Obtener el estado de los temas desde los parámetros de consulta en la URL
  const [temasBloqueados, setTemasBloqueados] = useState({
    tema1: queryParams.get('tema1') === 'true' || false, 
    tema2: true, // Inicialmente bloqueado
    tema3: queryParams.get('tema3') === 'true' || true, 
    tema4: queryParams.get('tema4') === 'true' || true, 
  });

  // Si recibes tema2=false como parámetro de consulta, cambia tema2 a false
  if (queryParams.get('tema2') === 'false') {
    temasBloqueados.tema2 = false;
  }

  // Función para manejar el clic en un tema
  const handleTemaClick = (tema) => {
    if (temasBloqueados[tema]) {
      // El tema está bloqueado, no hacemos nada
      return;
    }

    // Redirigir al usuario a la página del tema
    window.location.href = `/${tema}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          Bienvenido a Intelligent Tutoring System
        </h1>
        <p className="text-blue-500 mb-8">
          📚 Temas por aprender 📚
        </p>
        <div className="flex flex-col items-center">
          <div
            onClick={() => handleTemaClick('tema1')}
            className={`bg-${temasBloqueados.tema1 ? 'gray-300' : 'yellow-100'} p-4 rounded-b-lg cursor-${temasBloqueados.tema1 ? 'not-allowed' : 'pointer'}  w-[48rem] mb-4`}
          >
            <h2 className="text-xl font-semibold mb-2">
              Características de las Ondas (Rapidez, Longitud de Onda y Frecuencia)
            </h2>
            <p>{temasBloqueados.tema1 ? '🔒 Bloqueado' : '¡Haz clic aquí!'}</p>
          </div>
          <div
            onClick={() => handleTemaClick('tema2')}
            className={`bg-${temasBloqueados.tema2 ? 'gray-300' : 'yellow-100'} p-4 rounded-b-lg cursor-${temasBloqueados.tema2 ? 'not-allowed' : 'pointer'}  w-[48rem] mb-4`}
          >
            <h2 className="text-xl font-semibold mb-2">
              Ondas estacionarias y viajeras
            </h2>
            <p>{temasBloqueados.tema2 ? '🔒 Bloqueado' : '¡Haz clic aquí!'}</p>
          </div>
          <div
            onClick={() => handleTemaClick('tema3')}
            className={`bg-${temasBloqueados.tema3 ? 'gray-300' : 'yellow-100'} p-4 rounded-b-lg cursor-${temasBloqueados.tema3 ? 'not-allowed' : 'pointer'}  w-[48rem] mb-4`}
          >
            <h2 className="text-xl font-semibold mb-2">
              Ondas Sonoras
            </h2>
            <p>{temasBloqueados.tema3 ? '🔒 Bloqueado' : '¡Haz clic aquí!'}</p>
          </div>
          <div
            onClick={() => handleTemaClick('tema4')}
            className={`bg-${temasBloqueados.tema4 ? 'gray-300' : 'yellow-100'} p-4 rounded-b-lg cursor-${temasBloqueados.tema4 ? 'not-allowed' : 'pointer'}  w-[48rem] mb-4`}
          >
            <h2 className="text-xl font-semibold mb-2">
              Efecto Doppler
            </h2>
            <p>{temasBloqueados.tema4 ? '🔒 Bloqueado' : '¡Haz clic aquí!'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
