import { useQuery } from "react-query";
import axios from "axios";


export default function getOrders(startDate, endDate) {
    
    return useQuery(['blingOrders', startDate, endDate],
        async () => {
            
            const { data } = await axios.get(`/importOrders/?&start=${startDate}&end=${endDate}`);
              
            
            return data
        },
        {refetchInterval: 20000, enabled: false, refetchOnWindowFocus: false,}
    )
}


