import Chart from 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export function Tema1Calculo() {
  const [property, setProperty] = useState(0);
  const [variable1, setVariable1] = useState(0);
  const [variable2, setVariable2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const epsilon = 0.05;
const location = useLocation();
  const propertyOptions = ['Velocidad', 'Longitud de Onda', 'Frecuencia'];
  const variableLabels = [
    ['Longitud de Onda (m)', 'Frecuencia (Hz)'],
    ['Frecuencia (Hz)', 'Velocidad (m/s)'],
    ['Longitud de Onda (m)', 'Velocidad (m/s)'],
  ];

  const navigate = useNavigate();


  const handleSiguienteTarea = () => {

    navigate('/inicio?tema1=true&tema2=false&tema3=true&tema4=true');
  };
  const [showNextTaskButton, setShowNextTaskButton] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(true);

  const [chartData, setChartData] = useState({
    datasets: [
      {
        label: 'Intersección valores',
        data: [{ x: 0, y: 0 }],
        backgroundColor: 'blue',
        borderColor: 'blue',
        borderWidth: 2,
      },
      {
        label: 'Recta',
        data: [],
        type: 'line',
        backgroundColor: 'rgba(255, 0, 0, 1)',
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 1, 
        fill: false,
      },
    ],
  });

  useEffect(() => {

    Modal.setAppElement('#root');
  }, []); 



  const generateRandomProperty = () => {
    const randomProperty = Math.floor(Math.random() * 3);
    setProperty(randomProperty);
  };

  const generateRandomValues = () => {
    const randomVariable1 = Math.random() * 100;
    const randomVariable2 = Math.random() * 100;

    setVariable1(randomVariable1);
    setVariable2(randomVariable2);

    setChartData({
      datasets: [
        {
          ...chartData.datasets[0],
          data: [{ x: randomVariable1, y: randomVariable2 }],
        },
        {
          ...chartData.datasets[1],
          data: [
            { x: 0, y: 0 }, 
            { x: randomVariable1, y: randomVariable2 }, 
          ],
        },
      ],
    });

    setUserAnswer('');
    setIsCorrect(null);
    setShowSubmitButton(true);
    setShowNextTaskButton(false);
  };

  const checkAnswer = () => {
    let correct = false;

    switch (property) {
      case 0:
        setCorrectAnswer(variable2 * variable1);
        console.log(correctAnswer)
        break;
      case 1:
        setCorrectAnswer(variable2 / variable1);
        console.log(correctAnswer)
        break;
      case 2:
        setCorrectAnswer(variable1 / variable2);
        console.log(correctAnswer)
        break;
      default:
        break;
    }


    const userAnswerFloat = parseFloat(userAnswer);
    const correctAnswerFloat = parseFloat(correctAnswer);


    if (Math.abs(userAnswerFloat - correctAnswerFloat) < epsilon) {
      correct = true;
      setShowSubmitButton(false);
      setShowNextTaskButton(true);
    }

    setIsCorrect(correct);
  };

  useEffect(() => {
    generateRandomProperty();
    generateRandomValues();
  }, []);

  let xAxisLabel, yAxisLabel;

  switch (property) {
    case 0:
      xAxisLabel = 'Longitud de Onda (m)';
      yAxisLabel = 'Frecuencia (Hz)';
      break;
    case 1:
      xAxisLabel = 'Frecuencia (Hz)';
      yAxisLabel = 'Velocidad (m/s)';
      break;
    case 2:
      xAxisLabel = 'Longitud de Onda (m)';
      yAxisLabel = 'Velocidad (m/s)';
      break;
    default:
      break;
  }

  const renderHint = () => {
    let hint = '';

    if (isCorrect === false) {
      switch (property) {
        case 0:
          hint = "Puedes calcular la velocidad utilizando la fórmula de una onda, que relaciona la velocidad, la longitud de onda y la frecuencia.";
          break;
        case 1:
          hint = "Puedes calcular la longitud de onda utilizando la fórmula de una onda, que relaciona la velocidad, la longitud de onda y la frecuencia.";
          break;
        case 2:
          hint = "Puedes calcular la frecuencia utilizando la fórmula de una onda, que relaciona la velocidad, la longitud de onda y la frecuencia.";
          break;
        default:
          break;
      }
    }

    return hint && (
      <div className="bg-yellow-100 rounded p-4 mt-2">
        <div className="text-red-500">
          {hint}
        </div>
      </div>
    );
  };

  // Función para abrir la modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar la modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4">✏️ Pregunta de cálculo ✏️</h1>
      <div className="flex items-center text-lg mb-4">
        <span>🔅 Tema: Características de las Ondas (Rapidez, Longitud de Onda y Frecuencia)</span>
      </div>
      <div className="mt-4">
        <Scatter
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: xAxisLabel,
                },
              },
              y: {
                type: 'linear',
                position: 'left',
                title: {
                  display: true,
                  text: yAxisLabel,
                },
              },
            },
          }}
        />
      </div>
      <div className="bg-blue-200 rounded p-4 w-2/3 text-center">
        <div className="text-lg">
          Datos:
          <p>{xAxisLabel}: {variable1.toFixed(2)}</p>
          <p>{yAxisLabel}: {variable2.toFixed(2)}</p>
        </div>
      </div>
      <br />
      <div className="text-lg">
        Se pide calcular la siguiente propiedad según los datos entregados en el enunciado: {propertyOptions[property]}
      </div>
      <br />
      <div className="text-lg">
        Introduce tu respuesta ({property === 0 ? 'm/s' : property === 1 ? 'm' : 'Hz'}):
        <div className="flex items-center">
          <input
            className="bg-purple-100 rounded p-2"
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(parseFloat(e.target.value))}
          />
          <span className="ml-2">{property === 0 ? 'm/s' : property === 1 ? 'm' : 'Hz'}</span>
        </div>
      </div>
      {showSubmitButton && (
        <button className="bg-purple-200 rounded-full px-4 py-2 mt-4" onClick={checkAnswer}>
          Entregar respuesta
        </button>
      )}
      {isCorrect !== null && (
        <div>
          <p className={`text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            Tu respuesta es {isCorrect ? 'correcta' : 'incorrecta'}
          </p>
          {renderHint()}
          {showNextTaskButton && (
        <button
          className={'bg-purple-200 rounded-full px-4 py-2 mt-4'}
          onClick={handleSiguienteTarea}
        >
          Siguiente tarea
        </button>
          )}
        </div>
      )}
    </div>
  );
}
