import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";


export default function fetchAllStatus(){
    return useQuery(['status'], getAll)
 }

const getAll = async () => {
    const response = await axios.get('/getStatus');
    return response.data
}

export function statusHome(startDate, endDate) {

    return useQuery(['statusHome', startDate, endDate],
    async () => {
        const { data } = await axios.get(`/getStatusHome/?&start=${startDate}&end=${endDate}`);
        return data
    }, {refetchOnWindowFocus: false})
}
const fechStatus = async ({queryKey}) =>  {
    const stsId = queryKey[1]
    const result = await axios.get(`/getSingleStatus/${stsId}`);
    return result
}

export function sttData(stsId) {
    return useQuery(['statusOne', stsId], fechStatus)
}

