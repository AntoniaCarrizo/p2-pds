import axios from 'axios'
export const getAllAlternativas = () => {
    return axios.get('http://localhost:8000/api/v1/alternativas/')
}