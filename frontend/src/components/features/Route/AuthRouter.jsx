import { Outlet } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";

const AuthRouter = ({onlyAdmin = false}) => {
	const { isAdmin } = useAuth();
	
	return onlyAdmin === isAdmin ? <Outlet /> : <div>404: Not found</div> 
}
export default AuthRouter;