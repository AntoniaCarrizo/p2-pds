import axios from 'axios'

const tasksApi = axios.create({
    baseURL: "http://localhost:8000/api/v1/preguntas-individuales/",
});

export const getAllPreguntasIndividuales = () => tasksApi.get("/")
export const updatePreguntaIndividual = (id,paramaetros) => tasksApi.put(`/${id}`,paramaetros)