import { TextField } from "@mui/material";

import { useState, memo, useEffect } from "react";

const AvgBloodSugarField = memo(({ AvgbloodSugar, ...props }) => {
	const [bloodSugar, setBloodSugar] = useState(AvgbloodSugar || "");
	console.log("BloodSugarField -> Рендер");
	const [sugarError, setSugarError] = useState('');

	useEffect(() => {
		setBloodSugar(AvgbloodSugar || "");
	}, [AvgbloodSugar])

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
			name="avg_blood_sugar"
			label="Средний уровень сахара за месяц"
			variant="outlined"
			type="number"
			value={bloodSugar}
			onChange={(e) => validate(e.target.value)}
			error={!!sugarError}
			helperText={sugarError}
			slotProps={{
				inputLabel: {
					shrink: true
				},
				htmlInput: {
					min: 0,
					step: "0.1"
				}
			}}
			{...props}
		/>
	)
});

export default AvgBloodSugarField;