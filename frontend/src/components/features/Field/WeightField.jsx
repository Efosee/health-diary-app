// HeightField.jsx
import { useState, forwardRef, useImperativeHandle, memo, useEffect } from 'react';
import TextField from '@mui/material/TextField';

// Оборачиваем компонент в forwardRef
const WeightField = memo(forwardRef(({setWeight, weight, ...props}, ref) => {
	console.log("WeightField -> Рендер");
	const [value, setValue] = useState(weight || '');
	const [error, setError] = useState('');

	useEffect(() => {
			setValue(weight || "");
		}, [weight])

	const validate = () => {
		if (value && (isNaN(value) || Number(value) < 35 || Number(value) > 300)) {
			setError('Вес должен быть от 35 до 300 кг');
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
			id="weight"
			name='weight'
			onChange={(e) => {
				setValue(e.target.value);
				setWeight(e.target.value);
			}}
			label="Вес в кг (опционально)"
			type="number"
			value={value}
			error={!!error}
			helperText={error}
			slotProps={{
				htmlInput: {
					step: "0.1",
					min: 35,
					max: 300,
				}
			}}
			{...props}
		/>
	);
}));

export default WeightField;
