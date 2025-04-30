// HeightField.jsx
import { useState, forwardRef, useImperativeHandle, memo, useEffect } from 'react';
import TextField from '@mui/material/TextField';

// Оборачиваем компонент в forwardRef
const HeightField = memo(forwardRef(({setHeight, height, ...props}, ref) => {
	console.log("HeightField -> Рендер");
	const [value, setValue] = useState(height || '');
	const [error, setError] = useState('');

	useEffect(() => {
		setValue(height || "");
	}, [height])

	const validate = () => {
		if (value && (isNaN(value) || Number(value) < 100 || Number(value) > 230)) {
			setError('Рост должен быть больше от 100 до 230 см');
			return false;
		}
		setError('');
		return true;
	};

	// Передаём наружу нужные данные и функции
	useImperativeHandle(ref, () => ({
		value,
		error,
		validate
	}));

	return (
		<TextField
			id="height"
			name='height'
			onChange={(e) => {
				setValue(e.target.value);
				setHeight(e.target.value);
			}}
			label="Рост в см (опционально)"
			type="number"
			value={value}
			error={!!error}
			helperText={error}
			slotProps={{
				htmlInput: {
					step: "0.1",
					min: 100,
					max: 230,
				}
			}}
			{...props}
		/>
	);
}));

export default HeightField;
