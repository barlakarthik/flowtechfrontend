import {useState, useEffect} from 'react';
import axios from 'axios';
import {getUser} from '../helper/helper';
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;
export default function useFetch(query){
   const [data, setData] = useState({
    isLoading:false,
    apiData:undefined,
    status:null,
    serverError:null
   })   
   useEffect(()=>{
     if(!query) return;
     const fetchData = async ()=>{
        try{
           setData((prev)=>({...prev, isLoading:true}));
           const {email} = !query? await getUser():"";
           const {data, status} = !query?await axios.get(`/api/email/${email}`): await axios.get(`/api/${query}`)
           console.log(data, "useruser")
           if(status === 201){
            setData((prev)=>({...prev, isLoading:false}))
            setData((prev)=>({...prev, apiData:data, status:status}))  
           }
           setData((prev)=>({...prev, isLoading:false}))
        }catch(error){
          setData((prev)=>({...prev, isLoading:false, serverError:error}))
        }
     }
     fetchData()
   }, [query])
   return [data, setData]
}