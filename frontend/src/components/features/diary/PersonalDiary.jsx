import { useState } from "react";

import { Box, Paper, Button } from "@mui/material";

import TrainingIntensityField from "../Field/TrainingIntensityField";
import HasInjuryField from "../Field/HasInjuryField";
import InjuryLocation from "../Field/InjuryLocation";
import PressureField from "../Field/PressureField";
import FoodScoreField from "../Field/FoodScoreField";
import TemperatureField from "../Field/TemperatureField";
import PulseField from "../Field/PulseField";
import HeightField from "../Field/HeightField";
import WeightField from "../Field/WeightField";
import SleepField from "../Field/SleepField";
import BloodSugarField from "../Field/BloodSugarField";
import MedicationsField from "../Field/MedicationsField";
import NotesField from "../Field/NotesField";
import WellbeingScoreField from "../Field/WellbeingScoreField";
import EntryDateTimingField from "../Field/EntryDateTimingField";
import BMIField from "../Field/BMIField";

import diaryValidate from "../../../utils/diaryValidate";
import useHttp from "../../../hooks/useHttp";

const PersonalDiary = () => {
	const [entryTiming, setEntryTiming] = useState('');
	const [hasInjury, setHasInjury] = useState(false);
	const [weight, setWeight] = useState();
	const [height, setHeight] = useState();
	const { postPersonalTraining } = useHttp();


	const handler = (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const errors = diaryValidate(formData);

		if (Object.keys(errors).length) {
			console.log(errors);
		} else {
			postPersonalTraining(formData)
				.then(res => console.log(res))
				.catch(err => console.log(err.message));
		}
	}

	return (
		<Box sx={{
			mt: "15px",
			display: "flex",
			justifyContent: "center",
		}}
			component="form"
			onSubmit={handler}
		>
			<Paper elevation={3} sx={{
				maxWidth: "800px",
				width: {
					xs: "100%",
					sm: "550px",
					md: "800px"
				},
				display: "flex",
				flexDirection: "column",
				gap: "20px",
				p: {
					xs: "10px",
					sm: "30px",
					md: "45px"
				}
			}}>
				<EntryDateTimingField setEntryTiming={setEntryTiming} />
				<WellbeingScoreField />
				<TrainingIntensityField entryTiming={entryTiming} variant="outlined" />
				<HasInjuryField entryTiming={entryTiming} setHasInjury={setHasInjury} />
				<InjuryLocation entryTiming={entryTiming} hasInjury={hasInjury} />

				<Box sx={{
					mt: "15px",
					textAlign: "center"
				}}>
					Опциональные поля:
				</Box>

				<PressureField />
				<FoodScoreField />
				<TemperatureField />
				<PulseField />
				<HeightField setHeight={setHeight} />
				<WeightField setWeight={setWeight} />
				<SleepField variant="outlined" />
				<BloodSugarField />
				<MedicationsField />
				<NotesField />
				<BMIField height={height} weight={weight} />

				<Button
					type="submit"
					variant="contained"
					color="primary"
					sx={{
						mt: 2,
						height: "45px"
					}}
				>
					Сделать запись
				</Button>
			</Paper>
		</Box>
	)
}

export default PersonalDiary;