import { TextField } from "@mui/material";

import { memo } from "react";

const TrainingIntensityField = memo(({entryTiming, ...props}) => {
	console.log("TrainingIntensityField -> Рендер");

	return(
		entryTiming === "after" ? (
		<TextField
					required
					id="training-intensity"
					name="trainingIntensity"
					label="Оцените интенсивность тренировки (1–10)"
					variant="standard"
					type="number"
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
				/>) : null
	)
});

export default TrainingIntensityField;