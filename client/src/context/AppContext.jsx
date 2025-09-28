import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppcontextProvider = (props) => {
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);
    const getAuthState = async ()=>{
        try {
            const {data}= await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.messagee)
        }
    }

    useEffect(()=>{
        getAuthState();
    },[])
    const getUserData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.messagee)
        } catch (error) {
            toast.error(error.messagee)
        }
    }
    
    const value = {

        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData

    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}