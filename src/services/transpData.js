import { useQuery } from "react-query";
import axios from "axios";

export default function fechAllTr() {
    return useQuery(['transp'], getAll)
}

const getAll = async () => {
    const response = await axios.get('/getTransp');
    return response.data
}

const fechTransp = async ({ queryKey }) => {
    const trId = queryKey[1]
    const result = await axios.get(`/getSingleTransp/${trId}`);
    return result
}

export function transpData(trId) {
    return useQuery(['transpOne', trId], fechTransp)
}

export function fetchAllTrHome(startDate, endDate) {

    return useQuery(['transpHome', startDate, endDate],
        async () => {

            const { data } = await axios.get(`/getTranspHome/?&start=${startDate}&end=${endDate}`);
            return data
        }, {refetchOnWindowFocus: false})
}