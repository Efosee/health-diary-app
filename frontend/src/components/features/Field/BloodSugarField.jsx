import { TextField } from "@mui/material";

import { useState, memo } from "react";

const BloodSugarField = memo((props) => {
	console.log("BloodSugarField -> Рендер");
	const [sugarError, setSugarError] = useState('');

	function validate(value) {
		if (value && (isNaN(value) || value < 0)) {
			setSugarError("Число должно быть положительным");
		} else {
			setSugarError('');
		}
	}
	return (
		<TextField
			id="blood-sugar"
			name="bloodSugar"
			label="Введите уровень сахара в крови"
			variant="outlined"
			type="number"
			onChange={(e) => validate(e.target.value)}
			error={!!sugarError}
			helperText={sugarError}
			slotProps={{
				htmlInput: {
					min: 0
				}
			}}
			{...props}
		/>
	)
});

export default BloodSugarField;