import { TextField } from "@mui/material";

import { useState, memo } from "react";

const PulseField = memo((props) => {
	console.log("PulseField -> Рендер");
	const [error, setError] = useState('');

	const validate = (value) => {
		if (value && (isNaN(value) || value > 250 || value < 30)){
			setError('Значения должны быть от 30 до 250.')
		} else {
			setError('');
		}
	}
	return(
		<TextField
					id="pulse"
					name="pulse"
					label="Введите пульс"
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
							min: 30,
							max: 250,
						}
					}}
					sx={{
						flexGrow: "1"
					}}
					{...props}
				/>
	)
});

export default PulseField;