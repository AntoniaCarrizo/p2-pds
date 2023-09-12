import axios from 'axios'
export const getAllPreguntasAlternativas = () => {
    return axios.get('http://localhost:8000/api/v1/preguntas-alternativas/')
}