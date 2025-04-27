import { TextField } from "@mui/material";

import { useState, memo } from "react";

const TemperatureField = memo((props) => {
	console.log("TemperatureField -> Рендер");
	const [error, setError] = useState('');

	const validate = (value) => {
		if (value && (isNaN(value) || value > 42 || value < 34)){
			setError('Значения должны быть от 34 до 42.')
		} else {
			setError('');
		}
	}
	return(
		<TextField
					id="temperature"
					name="temperature"
					label="Введите температуру"
					variant="outlined"
					type="number"
					onChange={(e) => validate(e.target.value)}
					error={!!error}
					helperText={error}
					slotProps={{
						inputLabel: {
							shrink: true,
						},
						htmlInput: {
							step: "0.1",
							min: 34,
							max: 42,
						}
					}}
					sx={{
						flexGrow: "1"
					}}
					{...props}
				/>
	)
});

export default TemperatureField;
