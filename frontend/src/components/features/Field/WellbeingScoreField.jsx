import { TextField } from "@mui/material";

import { useState, memo } from "react";

const WellbeingScoreField = memo((props) => {
	console.log("WellbeingScoreField -> Рендер");
	const [error, setError] = useState('');

	const validate = (value) => {
		if (value && (isNaN(value) || value < 1 || value > 10)){
			setError("Введите число от 1 до 10");
		} else {
			setError('');
		}
	}
	return(
		<TextField
							required
							id="wellbeing-score"
							name="wellbeingScore"
							label="Оцените самочувствие (1–10)"
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
									min: 1,
									max: 10,
								}
							}}
							sx={{
								flexGrow: "1"
							}}
							{...props}
						/>
	)
});

export default WellbeingScoreField;