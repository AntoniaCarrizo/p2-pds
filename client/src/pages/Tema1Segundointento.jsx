
import { useEffect, useState } from "react";
import { getAllPreguntasAlternativas } from "../api/alternativas.api";
import { getAllPreguntasIndividuales } from "../api/individuales.api";
import { getAllAlternativas } from "../api/cada_alternativa.api";
import axios from 'axios'
import { Link } from 'react-router-dom';

export function Tema1SegundoIntento() {
  const [tareas, setTareas] = useState([]);
  const [individuales, setIndivuales] = useState([]);
  const [alternativas, setAlternativas] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAlternative, setSelectedAlternative] = useState("");
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(null);
  const [respuestasIncorrectas, setRespuestasIncorrectas] = useState([]);
  const [preguntasIncorrectas, setPreguntasIncorrectas] = useState([]);
  const [segundo, setSegundoIntento] = useState(false);
  useEffect(() => {
    async function loadPreguntasAlternativas() {
      const res = await getAllPreguntasAlternativas();
      const preguntasFiltradas = res.data.filter((pregunta) => {
        return pregunta.tema === 'Características de las Ondas (Rapidez, Longitud de Onda y Frecuencia)';
      });
      setTareas(preguntasFiltradas);

      console.log("tareas",preguntasFiltradas)

      const res2 = await getAllPreguntasIndividuales();
      console.log("leng",tareas.length)
      const individualesFiltrados = res2.data.filter((pregunta) => {
        if(preguntasFiltradas.length>0){
            console.log("pregunta",pregunta)
            return preguntasFiltradas[0].preguntas.includes(pregunta.id) && pregunta.esta_correcta === false;
        }
        else{
          return <div>cargando...</div>
        }
      });
      console.log("individuales filtradas",individualesFiltrados)
      setIndivuales(individualesFiltrados);
    }
    async function loadAlternativas() {
      const res = await getAllAlternativas();
      setAlternativas(res.data);
    }

    loadAlternativas();
    loadPreguntasAlternativas();

  }, []);
  

  function getPreguntaData(preguntaId) {
    const pregunta = individuales.find(pregunta => pregunta.id === preguntaId);
    return pregunta ? pregunta : null;
  }

  function getAlternativasDePregunta(pregunta) {
    if (pregunta && pregunta.alternativas) {
      return pregunta.alternativas.map(alternativaId => {
        const alternativa = alternativas.find(a => a.id === alternativaId);
        return alternativa ? alternativa : null;
      });
    }
    return [];
  }

  function handleNextQuestion() {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    setSelectedAlternative("");
    setRespuestaCorrecta(null);
  }

  async function handleEntregarRespuesta() {
    if (currentQuestionIndex < tareas[0]?.preguntas.length) {
      const currentQuestion = getPreguntaData(
        tareas[0].preguntas[currentQuestionIndex]
      );
      if (currentQuestion && selectedAlternative !== "") {
        if (currentQuestion.respuesta_correcta === selectedAlternative) {
          // Marcar la pregunta como correcta en el servidor
          try {
            await marcarPreguntaComoCorrecta(currentQuestion.id);

            // Actualizar el estado local si es necesario
            currentQuestion.esta_correcta = true;
            // ... otros cambios de estado ...
          } catch (error) {
            console.error(
              "Error al marcar la pregunta como correcta en el servidor:",
              error
            );
          }
        } else {
          try {
            await marcarPreguntaComoIncorrecta(currentQuestion.id);
            currentQuestion.esta_correcta = false;
          } catch (error) {
            console.error(
              "Error al marcar la pregunta como incorrecta en el servidor:",
              error
            );
          }

          // Registrar la respuesta incorrecta localmente
          const alternativaIncorrecta = getAlternativasDePregunta(
            currentQuestion
          )[selectedAlternative];
          setRespuestasIncorrectas((prevRespuestas) => [
            ...prevRespuestas,
            {
              texto: alternativaIncorrecta.texto,
              hint: alternativaIncorrecta.hint,
              enunciado: currentQuestion.enunciado,
              id: currentQuestion.id,
              respuesta_correcta: getAlternativasDePregunta(currentQuestion)[currentQuestion.respuesta_correcta].texto,
            },
          ]);
          setPreguntasIncorrectas((prevPreguntas) => [
            ...prevPreguntas,
            currentQuestion, // Agregar la pregunta incorrecta al registro
          ]);
        }
      }
    }
    handleNextQuestion();
  }


  async function marcarPreguntaComoCorrecta(id) {
    try {
      const url = `http://localhost:8000/api/v1/preguntas-individuales/${id}/`;
      const data = {
        esta_correcta: true
      };
  
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Agrega cualquier otro encabezado necesario, como el token CSRF si es necesario
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Elemento actualizado exitosamente:', responseData);
      } else {
        console.error('Error al actualizar el elemento:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error al marcar la pregunta como correcta:', error);
      throw error;
    }
  }
  
  async function marcarPreguntaComoIncorrecta(id) {
    try {
        const url = `http://localhost:8000/api/v1/preguntas-individuales/${id}/`;
        const data = {
          esta_correcta: false
        };
    
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Agrega cualquier otro encabezado necesario, como el token CSRF si es necesario
          },
          body: JSON.stringify(data)
        });
    
        if (response.ok) {
          const responseData = await response.json();
          console.log('Elemento actualizado exitosamente:', responseData);
        } else {
          console.error('Error al actualizar el elemento:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error al marcar la pregunta como incorrecta:', error);
        throw error;
      }
  }
  

  const currentQuestion =
  individuales.length > 0 && currentQuestionIndex < individuales.length
    ? getPreguntaData(individuales[currentQuestionIndex].id)
    : null;

    const currentAlternativas = currentQuestion !== undefined
    ? getAlternativasDePregunta(currentQuestion)
    : [];
    

  const todasLasPreguntasRespondidas = currentQuestionIndex >= individuales.length;
  const todasLasPreguntasCorrectas = respuestasIncorrectas.length === 0;

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4">✏️ Pregunta de alternativas ✏️</h1>
      {currentQuestion ? (
        <>
          <div className="text-lg mb-2">🔅 Cantidad de preguntas: {individuales.length}</div>

          <div className="flex items-center text-lg mb-4">
            <span>🔅 Pregunta actual: {currentQuestionIndex + 1}</span>
          </div>
          <div className="flex items-center text-lg mb-4">
            <span>🔅 Tema: {tareas.length > 0 ? tareas[0].tema : 'Cargando...'}</span>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg mb-4">
            <p>{currentQuestion.enunciado}</p>
            <form>
              <ul>
                {currentAlternativas.map((alternativa, aIndex) => (
                  <li key={aIndex}>
                    <label>
                      <input
                        type="radio"
                        name="alternativa"
                        value={aIndex}
                        checked={selectedAlternative === aIndex.toString()}
                        onChange={() => setSelectedAlternative(aIndex.toString())}
                      />
                      {alternativa.texto}
                    </label>
                  </li>
                ))}
              </ul>
            </form>
          </div>
          <button
            className={`bg-purple-200 rounded-full px-4 py-2 ${
              selectedAlternative === "" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleEntregarRespuesta}
            disabled={selectedAlternative === ""}
          >
            Entregar respuesta
          </button>
        </>
      ) : null}
        {console.log("respondidas",todasLasPreguntasRespondidas)}
        {console.log("correctas",todasLasPreguntasCorrectas)}
        {todasLasPreguntasRespondidas && todasLasPreguntasCorrectas ? (
      <div className="bg-green-200 p-4 rounded-lg mb-4" >
        <p>Todas las preguntas fueron respondidas de forma correcta!</p>
        <div className="text-lg font-semibold mt-2">Continua con la siguiente tarea:</div>
        <button className="bg-purple-200 rounded-full px-4 py-2 mt-2">
          <Link to="/tema1calculo">Siguiente tarea</Link>
        </button>
      </div>
    ) : todasLasPreguntasRespondidas && respuestasIncorrectas.length > 0 ? (
      <div>
        <div className="text-2xl font-semibold mt-4">Preguntas incorrectas:</div>
        {respuestasIncorrectas.map((respuesta, index) => (
          <div key={index} className="p-2 bg-red-200 rounded-md text-center my-2">
            <p>Pregunta: {respuesta.enunciado}</p>
            <br />
            <p>❌ Respuesta incorrecta: {respuesta.texto}</p>
            <p>✔️ Respuesta Correcta: {respuesta.respuesta_correcta}</p>          
        </div>   
        ))}
        <div className="text-lg font-semibold mt-2">Continua con la siguiente tarea:</div>
        <button className="bg-purple-200 rounded-full px-4 py-2 mt-2">
          <Link to="/tema1calculo">Siguiente tarea</Link>
        </button>
         </div>
    ) : null}
  </div>
  );
}
