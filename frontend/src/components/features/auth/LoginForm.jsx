import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Link } from 'react-router';
import PasswordField from '../Field/PasswordField';
import { useRef } from 'react';

import { useAuth } from '../../../contexts/AuthContext';


const LoginForm = (props) => {
	const passwordRef = useRef();
	const { login, checkAdmin } = useAuth();

	const handleLogin = (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const email = formData.get("email");
		const password = formData.get("password");
		login(email, password).then(
			response => console.log(response)
		).then(() => checkAdmin())
		.catch(
			(error) => {
				if (error.status === 401){
					// Можно сделать модальное окно
					alert("Данные введены не верно")
				}
			}
		);


		e.target.reset();
		passwordRef.current?.setValue("");
	}

	return (
		<Box component="form" sx={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: "center",
			width: "100%",
			gap: 3,
			"& > *": {
				width: "600px",
				maxWidth: "100%",
				margin: "0 5px"
			}
		}}
		onSubmit={handleLogin}>
			<FormControl required variant="standard">
				<InputLabel htmlFor="login-id" >Email</InputLabel>
				<Input id="login-id" name="email" type='email'/>
			</FormControl>
			<PasswordField label="Пароль" required ref={passwordRef}/>
			{/* <FormControl required variant="standard">
				<InputLabel htmFor="login-pass" >Пароль</InputLabel>
				<Input id="login-pass" name="password"/>
			</FormControl> */}
			<Button
				type="submit"
				variant="contained"
				color="primary"
				sx={{ mt: 2 }}
			>
				Войти
			</Button>
			<Box sx={{ textAlign: 'center', mt: 2 }}>
				<Link
					to="/forgot-password"
					style={{
						fontSize: '0.9rem',
						color: '#1976d2',
						textDecoration: 'none',
					}}
				>
					Забыли пароль?
				</Link>
			</Box>
		</Box>
	)
}
export default LoginForm;