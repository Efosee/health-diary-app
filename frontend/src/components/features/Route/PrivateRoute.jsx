import { useAuth } from "../../../contexts/AuthContext";
import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
	const { token } = useAuth();

	return token ? <Outlet /> : <Navigate to="/auth" replace/>;
}

export default PrivateRoute;