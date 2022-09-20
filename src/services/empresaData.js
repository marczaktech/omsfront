import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";


const addEmpresa =  (data) => {
    return axios.post('/newEmpresa', data)     
}

export const addNewempresa = () => {
    return useMutation(addEmpresa)
}

export default function fechAllEmp(){
    return useQuery(['empr'], getAll)
 }

const getAll = async () => {
    const response = await axios.get('/getEmpresas');
    return response.data
}

const fechEmpre = async ({queryKey}) =>  {
    const empId = queryKey[1]
    const result = await axios.get(`/getSingleEmpre/${empId}`);
    return result
}

export function empreData(empId) {
    return useQuery(['empreeOne', empId], fechEmpre)
}

