import { useQuery } from "react-query";
import axios from "axios";

export default function fechAllOcorrencias(id){
    return useQuery(['ocorrencias', id], getAll)
}

const getAll = async ({queryKey}) => {
    const ordId = queryKey[1]
    const response = await axios.get(`/getOcorrencia/${ordId}`);
    return response.data
}

// const fechOrd = async ({queryKey}) =>  {
//     const ordId = queryKey[1]
//     const result = await axios.get(`/getSingleOrder/${ordId}`);
//     console.log(result)
//     return result
// }

// export function OrderData(ordId) {
//     return useQuery(['ordOne', ordId], fechOrd)
// }


