import { useEffect, useState } from "react";
import { getAllPreguntasAlternativas } from "../api/alternativas.api";
import { getAllPreguntasIndividuales } from "../api/individuales.api";
import { getAllAlternativas } from "../api/cada_alternativa.api";
import axios from 'axios'
import { Link } from 'react-router-dom';

export function Tema2() {
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
    setTareas(res.data);
    }

    async function loadPreguntasIndividuales() {
      const res = await getAllPreguntasIndividuales();
      setIndivuales(res.data);
    }

    async function loadAlternativas() {
      const res = await getAllAlternativas();
      setAlternativas(res.data);
    }

    loadAlternativas();
    loadPreguntasAlternativas();
    loadPreguntasIndividuales();
  }, []);


  async function segundoIntento() {
    try {
      const preguntasResponse = await getAllPreguntasIndividuales();
      if (preguntasResponse.data) {
        const preguntasData = preguntasResponse.data;
  

        const preguntasIncorrectasData = preguntasData.filter(pregunta => !pregunta.esta_correcta);
  
        if (preguntasIncorrectasData.length > 0) {
          setPreguntasIncorrectas(preguntasIncorrectasData);
  
          const primeraPreguntaIncorrecta = preguntasIncorrectasData[0];
          setCurrentQuestionIndex(0);
          setSelectedAlternative(""); 
          setRespuestaCorrecta(null); 
          console.log(preguntasIncorrectasData)
          setTareas(preguntasIncorrectasData)
          setSegundoIntento(true)
  
        } else {
          console.error("No se encontraron preguntas incorrectas en la API.");
        }
      } else {
        console.error("No se pudieron obtener datos desde la API.");
      }
    } catch (error) {
      console.error("Error al obtener las preguntas desde la API:", error);
    }
  }
  

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
    if (currentQuestionIndex < tareas[1]?.preguntas.length) {
      const currentQuestion = getPreguntaData(
        tareas[1].preguntas[currentQuestionIndex]
      );
      if (currentQuestion && selectedAlternative !== "") {
        if (currentQuestion.respuesta_correcta === selectedAlternative) {
          try {
            await marcarPreguntaComoCorrecta(currentQuestion.id);
            currentQuestion.esta_correcta = true;
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

          const alternativaIncorrecta = getAlternativasDePregunta(
            currentQuestion
          )[selectedAlternative];
          setRespuestasIncorrectas((prevRespuestas) => [
            ...prevRespuestas,
            {
              texto: alternativaIncorrecta.texto,
              hint: alternativaIncorrecta.hint,
              enunciado: currentQuestion.enunciado,
            },
          ]);
          setPreguntasIncorrectas((prevPreguntas) => [
            ...prevPreguntas,
            currentQuestion, 
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
  tareas.length > 0 && currentQuestionIndex < tareas[1]?.preguntas.length
    ? getPreguntaData(tareas[1].preguntas[currentQuestionIndex])
    : null;

    const currentAlternativas = currentQuestion !== undefined
    ? getAlternativasDePregunta(currentQuestion)
    : [];
    

  const todasLasPreguntasRespondidas = currentQuestionIndex >= tareas[1]?.preguntas.length;
  const todasLasPreguntasCorrectas = respuestasIncorrectas.length === 0;

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4">✏️ Pregunta de alternativas ✏️</h1>
      {currentQuestion ? (
        <>
          <div className="text-lg mb-2">🔅 Cantidad de preguntas: {tareas.length > 0 ? tareas[1].cantidad_preguntas : 'Cargando...'}</div>
          <div className="flex items-center text-lg mb-4">
            <span>🔅 Pregunta actual: {currentQuestionIndex + 1}</span>
          </div>
          <div className="flex items-center text-lg mb-4">
            <span>🔅 Tema: {tareas.length > 0 ? tareas[1].tema : 'Cargando...'}</span>
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

{todasLasPreguntasRespondidas && todasLasPreguntasCorrectas ? (
        <div className="bg-green-200 p-4 rounded-lg mb-4">
          <p>Todas las preguntas fueron respondidas de forma correcta!</p>
          <div className="text-lg font-semibold mt-2">Continua con la siguiente tarea:</div>
          <button className="bg-purple-200 rounded-full px-4 py-2 mt-2">
            <Link to="/tema2calculo">Siguiente tarea</Link>
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
              <p>💡 Hint: {respuesta.hint}</p>
            </div>
          ))}
          <button className="bg-purple-200 rounded-full px-4 py-2 mt-4">
            <Link to="/tema2segundointento">Volver a intentar</Link>
          </button>
        </div>
      ) : null}
    </div>
  );
}
