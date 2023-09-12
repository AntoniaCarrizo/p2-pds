import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function Tema2Calculo() {
        const [answer1, setAnswer1] = useState('');
        const [answer2, setAnswer2] = useState('');
        const [showFeedback, setShowFeedback] = useState('');
        const [showHint, setShowHint] = useState(false);
        const [cuerdaLongitud, setCuerdaLongitud] = useState(0);
        const [velocidadOnda, setVelocidadOnda] = useState(0);
      
        useEffect(() => {
          generateRandomValues();
        }, []);
      
        const generateRandomValues = () => {
          const minLongitud = 0.5;
          const maxLongitud = 5.0;
          const minVelocidad = 5;
          const maxVelocidad = 15;
      
          const randomLongitud = minLongitud + Math.random() * (maxLongitud - minLongitud);
          const randomVelocidad = minVelocidad + Math.random() * (maxVelocidad - minLongitud);
      
          setCuerdaLongitud(randomLongitud.toFixed(2));
          setVelocidadOnda(randomVelocidad.toFixed(2));
        };
      
        const handleSubmitAnswers = () => {
          const correctAnswer1 = cuerdaLongitud / 2;
          const correctAnswer2 = velocidadOnda / (cuerdaLongitud / 2);
      
          const userAnswer1 = parseFloat(answer1);
          const userAnswer2 = parseFloat(answer2);
      
          const isCorrect1 = Math.abs(userAnswer1 - correctAnswer1) < 0.05;
          const isCorrect2 = Math.abs(userAnswer2 - correctAnswer2) < 0.05;
        console.log(correctAnswer1)
        console.log(correctAnswer2)
          if (isCorrect1 && isCorrect2) {
            setShowFeedback('ambas');
          } else if (isCorrect1) {
            setShowFeedback('pregunta1');
          } else if (isCorrect2) {
            setShowFeedback('pregunta2');
          } else {
            setShowFeedback('ninguna');
          }
      
          setShowHint(showFeedback !== 'ambas');
        };
      
        const chartRef = useRef(null);
        const chartInstance = useRef(null);
      
        useEffect(() => {
            if (chartInstance.current) {
              chartInstance.current.destroy();
            }
          
            if (chartRef.current) {
              const ctx = chartRef.current.getContext('2d');
          
              const longitudOnda = cuerdaLongitud;
              const frecuencia = velocidadOnda / longitudOnda;
          
              const numNodos = 10;
              const data = [];
              const labels = [];
          
              for (let i = 0; i <= numNodos; i++) {
                const x = (i / numNodos) * longitudOnda;
                const y = Math.sin((2 * Math.PI * frecuencia * x) / velocidadOnda);
                data.push(y);
                labels.push(x.toFixed(2)); 
              }

              const referencia = [];
              for (let i = 0; i <= numNodos; i++) {
                const x = (i / numNodos) * longitudOnda;
                const y = Math.sin((2 * Math.PI * 1 * x) / velocidadOnda);
                referencia.push(y);
              }
          
              chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [
                    {
                      label: 'Onda Estacionaria',
                      data: data,
                      fill: false,
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 2,
                    },
                    {
                      label: 'Velocidad de Referencia',
                      data: referencia,
                      fill: false,
                      borderColor: 'rgba(255, 0, 0, 1)', 
                      borderWidth: 2,
                      borderDash: [5, 5], 
                    },
                  ],
                },
                options: {
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Posición a lo largo de la cuerda (m)',
                      },
                    },
                  },
                },
              });
            }
          }, [cuerdaLongitud, velocidadOnda]);
      
  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-semibold mb-4">✏️ Pregunta de cálculo ✏️</h1>
      <div className="flex items-center text-lg mb-4">
        <span>🔅 Tema: Ondas estacionarias y viajeras</span>
      </div>
      <p className="text-lg text-center">
        🔅 Enunciado: Se tiene una cuerda de {cuerdaLongitud} metros de longitud que está sujeta en ambos extremos.
        Se le aplica una perturbación inicial que genera una onda estacionaria.
        La velocidad de propagación de la onda en la cuerda es de {velocidadOnda} m/s.
      </p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Gráfico de la onda:</h2>
        <canvas ref={chartRef} width={400} height={200}></canvas>
      </div>
      <div className="mt-4">
        <div>
          <h2 className="text-xl font-semibold">Pregunta 1:</h2>
          <p className="text-lg">¿Cuál es la longitud de onda de la onda estacionaria? (m)</p>
          <input
            type="number"
            className="bg-purple-100 rounded p-2"
            value={answer1}
            onChange={(e) => setAnswer1(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Pregunta 2:</h2>
          <p className="text-lg">¿Cuál es la frecuencia de la onda estacionaria? (Hz)</p>
          <input
            type="number"
            className="bg-purple-100 rounded p-2"
            value={answer2}
            onChange={(e) => setAnswer2(e.target.value)}
          />
        </div>
      </div>
      {showFeedback && (
        <div className="mt-4">
          {(showFeedback === 'ambas') ? (
            <div>
              <p className="text-green-500 text-lg">Todas las respuestas son correctas. ¡Felicidades!</p>
            </div>
          ) : (
            <div>
              <p className="text-red-500 text-lg">Algunas respuestas son incorrectas, inténtalo de nuevo.</p>
              {showHint && (
                <div className="bg-yellow-200 rounded p-2 mt-2">
                  <p className="text-yellow-800">
                    {showFeedback === 'pregunta1'
                      ? '¡Pregunta 2 respondida incorrectamente! - Recuerda que: La frecuencia de una onda estacionaria tiene que ver con la velocidad de propagación y la longitud de onda.'
                      : (showFeedback === 'ninguna'
                        ? '¡Preguntas 1 y 2 respondidas incorrectamente! - Recuerda que: La frecuencia de una onda estacionaria tiene que ver con la velocidad de propagación y la longitud de onda, y la longitud de onda de una onda estacionaria es igual a la distancia entre dos nodos consecutivos.'
                        : '¡Pregunta 1 respondida incorrectamente! - Recuerda que: La longitud de onda de una onda estacionaria es igual a la distancia entre dos nodos consecutivos.')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {showFeedback !== 'ambas' && (
        <button
          className="bg-purple-200 rounded-full px-4 py-2 mt-4"
          onClick={handleSubmitAnswers}
        >
          Entregar Respuestas
        </button>
      )}

    </div>
  );
}
