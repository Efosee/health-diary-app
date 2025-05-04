import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';



const Auth = () => {
	const [page, setPage] = useState('login')

	return (
		<Box sx={{
			width: {
				xs: "100vw",
				sm: "500px",
				md: "650px",
			},
			height: {
				xs: "100vmin",
				sm: "min(650px, 95vmin)"
			}
		}}>
			<Paper elevation={3} sx={{
				minHeight: "100%",
				display: "flex",
				justifyContent: "start",
				alignItems: "center",
				flexDirection: "column",
				padding: 2,
				gap: "10px",
				"& > :first-child": {
					marginBottom: "15px"
				},
				margin: {
					xs: "0px 15px",
					sm: "0 60px"
				},
				padding: {
					xs: "40px 15px",
					sm: "25px 30px"
				}
			}}>
				<ButtonGroup variant="outlined" aria-label="Basic button group">
					<Button variant={page === "login" ? "contained" : undefined}
						onClick={() => setPage("login")}
					>Вход
					</Button>
					<Button variant={page === "registration" ? "contained" : undefined}
						onClick={() => setPage("registration")}
					>Регистрация
					</Button>
				</ButtonGroup>
				{page === "login" ? <LoginForm/> : <RegistrationForm />}
			</Paper>
		</Box>

	)
}





export default Auth;