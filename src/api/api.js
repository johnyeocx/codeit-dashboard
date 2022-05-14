import axios from 'axios'

let API_URL = process.env.REACT_APP_STAGE === "development"
    ? "https://codeit-autograder.herokuapp.com"
    : "https://codeit-autograder.herokuapp.com"
export const getStudentResults = async (course) => axios.get(`${API_URL}/grades/${course}`)
export const getReport = async (resultId) => axios.get(`${API_URL}/grades/report/${resultId}`)
export const getStudentInfoRequest = async (course) => axios.get(`${API_URL}/info/${course}`)
