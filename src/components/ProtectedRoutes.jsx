import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
const ProtectedRoutes = ({ checkAuth }) => {
    // const [auth, setAuth] = useState(false)
    const { currentUser } = useAuth()

    useEffect(() => {
        if (currentUser) {
            checkAuth(true)
        }
        else checkAuth(false)
        // console.log(auth)
        console.log(currentUser)
    }, [])
}
export default ProtectedRoutes;
