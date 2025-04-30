import { Box, Typography, Button } from "@mui/material";
import { memo, useState, useEffect } from "react";
import useHttp from "../../../hooks/useHttp";

import DiseasesField from "../Field/DiseasesField";
import HeightField from "../Field/HeightField";
import WeightField from "../Field/WeightField";
import AvgPressureField from "../Field/AvgPressureField";
import AvgBloodSugarField from "../Field/AvgBloodSugarField";
import BMIField from "../Field/BMIField";

const Health = memo(({ ...props }) => {
	const [health, setHealth] = useState({});
	const [changeFlag, setChangeFlag] = useState(false);
	const [avgData, setAvgData] = useState({
		"avg_blood_pressure_sys": health?.avg_blood_pressure_sys,
		"avg_blood_pressure_dia": health?.avg_blood_pressure_dia,
		"avg_blood_sugar": health?.avg_blood_sugar
	});
	const { getHealth, putHealth, getAllPersonalTraining, getAllEventTraining } = useHttp();

	useEffect(() => {
		getHealth().then(healthData => setHealth(healthData));
	}, [getHealth]);

	useEffect(() => {
		setAvgData({
			avg_blood_pressure_sys: health?.avg_blood_pressure_sys,
			avg_blood_pressure_dia: health?.avg_blood_pressure_dia,
			avg_blood_sugar: health?.avg_blood_sugar
		})
	}, [health])

	const changeHealthData = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData(e.target);
			const healthData = await putHealth(formData);
			setHealth(healthData);
			setChangeFlag((flag) => !flag)
		} catch (error) {
			console.log(error)
		}
	}

	const calculateAvg = async () => {
		const personalData = await getAllPersonalTraining();
		const eventData = await getAllEventTraining();
		const data = [...personalData, ...eventData]

		const accBloodSugar = data.reduce((acc, curr) => {
			if (curr?.blood_sugar !== null) {
				acc.value += curr?.blood_sugar;
				acc.count++
			}
			return acc;
		},
			{ value: 0, count: 0 });
		const accBloodPressureDia = data.reduce((acc, curr) => {
			if (curr?.blood_pressure_dia !== null && curr?.blood_pressure_dia !== 0) {
				acc.value += curr?.blood_pressure_dia;
				acc.count++
			}
			return acc;
		},
			{ value: 0, count: 0 });
		const accBloodPressureSys = data.reduce((acc, curr) => {
			if (curr?.blood_pressure_sys !== null && curr?.blood_pressure_sys !== 0) {
				acc.value += curr?.blood_pressure_sys;
				acc.count++
			}
			return acc;
		},
			{ value: 0, count: 0 });

			

		const avgBloodSugar = accBloodSugar.count > 0 ? accBloodSugar.value / accBloodSugar.count: "",
			avgBloodPressureSys = accBloodPressureSys.count > 0 ? accBloodPressureSys.value / accBloodPressureSys.count : "",
			avgBloodPressureDia = accBloodPressureDia.count > 0 ? accBloodPressureDia.value / accBloodPressureDia.count : "";
		setAvgData({
			avg_blood_pressure_sys: Math.floor(avgBloodPressureSys),
			avg_blood_pressure_dia: Math.floor(avgBloodPressureDia),
			avg_blood_sugar: avgBloodSugar
		});
	}



	return (
		<Box component="form" onSubmit={changeHealthData}
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "35px"
			}}>
			<Typography sx={{
				textAlign: "center",
				display: "block",
				mb: "30px",
				pt: "20px"
			}}>
				Профиль здоровья
			</Typography>

			<DiseasesField diseases={health?.chronic_diseases} {...(!changeFlag && { disabled: true })} />
			<HeightField height={health?.height} {...(!changeFlag && { disabled: true })} />
			<WeightField weight={health?.weight} {...(!changeFlag && { disabled: true })} />
			<BMIField weight={health?.weight} height={health?.height} disabled />
			<AvgPressureField
				bloodPressureSys={avgData.avg_blood_pressure_sys}
				bloodPressureDia={avgData.avg_blood_pressure_dia}
				{...(!changeFlag && { disabled: true })} />
			<AvgBloodSugarField AvgbloodSugar={avgData.avg_blood_sugar} {...(!changeFlag && { disabled: true })} />

			{!changeFlag ?
				(<Box sx={{
					display: "flex",
					justifyContent: "center",
					gap: "20px"
				}}>
					<Button
						onClick={() => setChangeFlag((flag) => !flag)}
						variant="contained">
						Изменить
					</Button>
					<Button
						onClick={calculateAvg}
						variant="contained">
						Рассчитать средние показатели
					</Button>
				</Box>) :
				(
					<Box sx={{
						display: "flex",
						justifyContent: "center",
						gap: "20px"
					}}>
						<Button
							onClick={() => setChangeFlag((flag) => !flag)}
							variant="contained">
							Отмена
						</Button>
						<Button
							type="submit"
							variant="contained">
							Сохранить изменнения
						</Button>
					</Box>
				)
			}
		</Box >
	);
});

export default Health;
