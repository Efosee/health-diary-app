import { useContext, createContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import http from "../api/http";
const AuthContext = createContext();

const ENDPOINT_TOKEN = "/auth/token";
const ENDPOINT_REFISTER = "/auth/register"

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(localStorage.getItem("token") || undefined);
	const navigate = useNavigate();

	const handleLogin = useCallback(async (email, password) => {
		try {
			const token = (await http.login(ENDPOINT_TOKEN, email, password)).access_token;
			setToken(token);
			localStorage.setItem("token", token)
			if (token) {
				navigate("/");
			}
		} catch(error){
			console.log(error.status);
			if (error.status === 401){
				logout();
			}
			throw error;
		}
	}, []);

	const logout = useCallback(() => {
		http.logout();
		setToken(null);
		navigate("/auth");
	}, [])

	const register = useCallback(async (responseData) => {
		try {
			const userData = await http.post(ENDPOINT_REFISTER, responseData);
			localStorage.setItem("name", userData.full_name);
			await handleLogin(responseData.email, responseData.password)
		} catch(error){
			console.log(error.status);
			if (error.status === 400){
				logout();
			}
			throw error;
		}
	}, []);


	return (
		<AuthContext.Provider value={{ token, login: handleLogin, logout, register }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext);