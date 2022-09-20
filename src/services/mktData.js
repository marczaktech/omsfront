import { useQuery } from "react-query";
import axios from "axios";

export default function fechAllMkt(){
    return useQuery(['mkts'], getAll)
}

const getAll = async () => {
    const response = await axios.get('/getMkt');
    return response.data
}

const fechMkt = async ({queryKey}) =>  {
    const mktId = queryKey[1]
    const result = await axios.get(`/getSingleMkt/${mktId}`);
    return result
}

export function MktData(mktId) {
    return useQuery(['mktOne', mktId], fechMkt)
}

export function mktHome(startDate, endDate) {

    return useQuery(['mktHome', startDate, endDate],
    async () => {
        const { data } = await axios.get(`/getMktHome/?&start=${startDate}&end=${endDate}`);
        
        return data
    })
}
