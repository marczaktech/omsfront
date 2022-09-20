import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";


export default function fechAllNvAtr(){
    return useQuery(['nvatr'], getAll)
 }

const getAll = async () => {
    const response = await axios.get('/getNivelAtraso');
    return response.data
}

const fechNvAtr = async ({queryKey}) =>  {
    const nvId = queryKey[1]
    const result = await axios.get(`/getSingleNvAtr/${nvId}`);
    return result
}

export function nvatrData(nvId) {
    return useQuery(['nvatrOne', nvId], fechNvAtr)
}

