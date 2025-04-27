import { TextField } from "@mui/material";

import { useState, memo } from "react";

const FoodScoreField = memo((props) => {
	console.log("FoodScoreField -> Рендер");
	const [error, setError] = useState('"0" - если не было');

	const validate = (value) => {
		console.log(value)
		if (value && (isNaN(value) || value > 10 || value < 0)){
			setError('Значения должны быть от 0 до 10. "0" - если не было')
		} else {
			setError('"0" - если не было');
		}
	}
	return(
		<TextField
					id="food-score"
					name="foodScore"
					label="Оцените прием пищи (0–10)"
					variant="outlined"
					type="number"
					onChange={(e) => validate(e.target.value)}
					error={error !== '"0" - если не было'}
					helperText={error}
					slotProps={{
						inputLabel: {
							shrink: true,
						},
						htmlInput: {
							min: 0,
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

export default FoodScoreField;