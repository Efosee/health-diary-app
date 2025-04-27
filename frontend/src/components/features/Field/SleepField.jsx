import { TextField, Box } from "@mui/material";
import { useState, memo } from "react";

const SleepField = memo(({defaultValueQuality, defaultValueHours, ...props}) => {
	console.log("SleepField -> Рендер");
	const [sleepQualityErr, setSleepQualityErr] = useState('');
	const [sleepHoursErr, setSleepHoursErr] = useState('');

	const validateQuality = (value) => {
		if (value && (isNaN(value) || value < 1 || value > 10)){
			setSleepQualityErr("Введите число от 1 до 10")
		} else {
			setSleepQualityErr('')
		}
	}

	const validateHours = (value) => {
		if (value && (isNaN(value) || value < 0 || value > 24)){
			setSleepHoursErr("Число может быть в диапозоне от 0 до 24")
		} else {
			setSleepHoursErr('')
		}
	}
	

	return (
		<Box sx={{
			flexGrow: "1",
			display: "flex",
			justifyContent: "space-between"
		}}>
			<TextField
				id="sleep-quality"
				name="sleepQuality"
				label="Оцените качество сна (1–10)"
				variant="standard"
				type="number"
				onChange={(e) => validateQuality(e.target.value)}
				error={!!sleepQualityErr}
				helperText={sleepQualityErr}
				slotProps={{
					
					htmlInput: {
						min: 1,
						max: 10,
					}
				}}
				sx={{
					flexGrow: "0",
					width: "45%"
				}}
				defaultValue={defaultValueQuality}
			/>
			<TextField
				id="sleepHours"
				name="sleepHours"
				label="Введите количество сна в часах"
				variant="standard"
				type="number"
				onChange={(e) => validateHours(e.target.value)}
				error={!!sleepHoursErr}
				helperText={sleepHoursErr}
				slotProps={{
					
					htmlInput: {
						min: 0,
						max: 24,
					}
				}}
				sx={{
					flexGrow: "0",
					width: "45%"
				}}
				defaultValue={defaultValueHours}
				{...props}
			/>
		</Box>
	)
});

export default SleepField;