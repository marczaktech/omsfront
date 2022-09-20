import { useQuery } from "react-query";
import axios from "axios";

export default function fechAllOrders(activePage, startDate, endDate, searchName, filterEmpresa, filterMKt, status, filterTr){
    
    return useQuery(['orders', activePage, startDate, endDate, searchName, filterEmpresa, filterMKt, status, filterTr], 
    async () => {
       
        const {data} = await axios.get(`/getOrders/?page=${activePage}&start=${startDate}&end=${endDate}&name=${searchName}&status=${status}&mkt=${filterMKt}&empr=${filterEmpresa}&transp=${filterTr}`);

        return data
    },{ keepPreviousData: true, refetchOnWindowFocus: false })
}

export function fechAllHomeOrders(){
    return useQuery(['ordersHome'], getAll)
}

const getAll = async () => {
    const response = await axios.get('/getHomeOrders');
    return response.data
}
const fechOrd = async ({queryKey}) =>  {
    const ordId = queryKey[1]
    const result = await axios.get(`/getSingleOrder/${ordId}`);
    return result
}

export function OrderData(ordId) {
    return useQuery(['ordOne', ordId], fechOrd,  {refetchOnWindowFocus: false})
}

const fechOrder = async ({queryKey}) => {
    const trId = queryKey[1]
    const response = await axios.get(`/getdayorder/${trId}`);
    return response.data
}

export function FechDayOrders(trId) {
    return useQuery(['dayorders', trId], fechOrder)
}

export function FetchBikeList(){
    return useQuery(['bikelist'], fetchBike)
}

const fetchBike = async () => {
    const response = await axios.get('/getBikeList')
    return response.data
}



const trackOrder = async ({queryKey}) =>  {
    const id = queryKey[1]
    const result = await axios.get(`/searchOrder/?cpf=${id}`)
    return result
}

export function getOrderTrack(cpf) {
   
    return useQuery(['trackOrd', cpf], trackOrder)
}