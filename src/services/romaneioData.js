import { useQuery } from "react-query";
import axios from "axios";

export default function fechAllRom(){
    return useQuery(['romaneios'], getAll)
}

const getAll = async () => {
    const response = await axios.get('/getRom');
    return response.data
}

const fechRom = async ({queryKey}) =>  {
    const romId = queryKey[1]
    const result = await axios.get(`/getSingleRom/${romId}`);
    return result
}

export function RomData(romId) {
    return useQuery(['romOne', romId], fechRom)
}


