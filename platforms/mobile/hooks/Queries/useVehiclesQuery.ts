import { tokenStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useEffect, useState } from "react";

const useVehicleQuery = () => {
    const { token } = useStore(tokenStore); // Get token safely

    // ✅ Use state to prevent immediate re-render issues
    const [currentToken, setCurrentToken] = useState(token);

    // ✅ Use effect to update token without triggering re-renders
    useEffect(() => {
        setCurrentToken(token);
    }, [token]);

    return useQuery({ queryKey: ['vehicles'], queryFn: async () => {

        const { token } = useStore(tokenStore)
        

        if (!token) {
            return
        }
    
        const response  = await fetch(`${process.env.EXPO_BASE_URL}/kendaraan`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        return response.json()
    }})
}

export default useVehicleQuery