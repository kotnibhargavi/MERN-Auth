    import { createContext, useState, useEffect } from "react";
    import axios from "axios";
    import { toast } from "react-toastify";

    export const AppContext = createContext();

    export const AppContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = async () => {
        axios.defaults.withCredentials = true
        try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`);
        data.success ? setUserData(data.userData) : toast.error(data.message);
        
        } catch (error) {
        toast.error(error.response.data.message); 
        }
    };


    const getAuthState = async()=>{
        axios.defaults.withCredentials = true
        try {
            const {data} = await axios.get(`${backendUrl}/api/auth/is-auth`)
            if (data.success) {
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.response.data.message)
            
        }
    }
    useEffect(()=>{
        getAuthState()
    },[])
    
    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>
    );
    };
