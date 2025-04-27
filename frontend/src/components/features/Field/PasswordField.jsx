import TextField from '@mui/material/TextField';
import { useState, forwardRef, useImperativeHandle, memo } from 'react';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordField = memo(forwardRef(({ label, ...props }, ref) => {
	const [showPassword, setShowPassword] = useState(false);
	const [value, setValue] = useState('');
	const [error, setError] = useState('');
	const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

	const validate = () => {
		if (!regex.test(value)) {
			setError('Пароль должен быть не менее 8 символов и содержать хотя бы одну цифру и бувку латинского');
			return false;
		}
		setError('');
		return true;
	};

	const handleTogglePassword = () => {
		setShowPassword((showPassword) => !showPassword);
	}

	useImperativeHandle(ref, () => ({
		validate,
		value,
		setValue,
		error
	}))
	return (
		<Box sx={{
			display: 'flex',
			position: 'relative'
		}}>
			<TextField
				id="password"
				name="password"
				onChange={(e) => setValue(e.target.value)}
				label={label}
				type={showPassword ? 'text' : 'password'}
				variant="standard"
				autoComplete="new-password"
				sx={{
					flexGrow: "1"
				}}
				value={value}
				error={!!error}
				helperText={error}
				{...props}
			/>

			<IconButton sx={{
				position: 'absolute',
				right: "0",
				bottom: "-10%"
			}}
				onClick={handleTogglePassword}
			>
				{showPassword ? <VisibilityOff /> : <Visibility />}
			</IconButton>
		</Box>
	)
}));
export default PasswordField;