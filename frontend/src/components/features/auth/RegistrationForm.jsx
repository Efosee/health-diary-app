import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox'

import { useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import PasswordField from '../Field/PasswordField';
import HeightField from '../Field/HeightField';
import WeightField from '../Field/WeightField';

import prepareDataForApi from "../../../utils/transformDataForApi";


const RegistrationForm = () => {
	const heightRef = useRef();
	const weightRef = useRef();
	const passwordRef = useRef();
	const {register} = useAuth();

	const handleSubmit = (e) => {
		e.preventDefault();

		if (heightRef.current?.validate() && weightRef.current?.validate() && passwordRef.current?.validate()) {
			const formData = new FormData(e.target);
			const requestData = prepareDataForApi(formData);
			register(requestData)
				.catch(
					(error) => {
						if (error.status === 400){
							// Можно сделать модальное окно
							alert(error.message);
						}
					}
				);
		}
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
			onSubmit={handleSubmit}
		>
			<FormControl required variant="standard">
				<InputLabel htmFor="registration-name" >ФИО</InputLabel>
				<Input id="registration-name" name="name" />
			</FormControl>
			<TextField
				required
				id="registration-date"
				label="Дата рождения"
				type="date"
				name="birthDate"
				variant="standard"
				InputLabelProps={{
					shrink: true
				}}
			/>
			<FormControl required variant="standard">
				<InputLabel htmlFor="registration-sex">Пол</InputLabel>
				<Select
					name="sex"
					labelId="registration-sex"
					id="registration-sex"
				>
					<MenuItem value={"male"}>Мужской</MenuItem>
					<MenuItem value={"female"}>Женский</MenuItem>
				</Select>
			</FormControl>
			<FormControl variant="standard" required>
				<InputLabel htmlFor="registration-email" >Email</InputLabel>
				<Input id="registration-email" type="email" name='email' />
			</FormControl>
			<PasswordField required label={"Пароль"} ref={passwordRef} name="password" />
			<HeightField ref={heightRef} variant="standard" name="height" />
			<WeightField ref={weightRef} variant="standard" name="weight" />
			<FormGroup sx={{
				fontSize: "10px"
			}}>
				<FormControlLabel required control={<Checkbox name="personal_data_consent"/>} label={<span>Подтверждение на обработку <a href='/docs/personal-data'>персональных данных</a></span>} />
				<FormControlLabel required control={<Checkbox name="health_data_consent"/>} label={<span>Подтверждение на обработку и хранение <a href='/docs/health-data'>данных о здоровье</a></span>} />
			</FormGroup>
			<Button
				type="submit"
				variant="contained"
				color="primary"
				sx={{ mt: 2 }}
			>
				Зарегистрироваться
			</Button>
		</Box>
	)
}

export default RegistrationForm;