import { useQuery } from "react-query";
import axios from "axios";
export default function fetchUsers(){
    
    return useQuery(['users',],
    async () => {
       
        const {data} = await axios.get('/getUsers');

        return data
    })
}

const fetchUser = async ({ queryKey }) => {
    const uId = queryKey[1]
    const result = await axios.get(`/getSingleUser/${uId}`);
    return result
}

export function userData(uId) {
    return useQuery(['getUser', uId], fetchUser)
}

export function checkUser(email){
    return useQuery(['checkU', email],
    async () => {
       
        const {data} = await axios.get(`/checkEmailuser/?email=${email}`);

        return data
    })
}