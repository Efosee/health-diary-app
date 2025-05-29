import { TextField, Box, Button, Typography } from "@mui/material";
import useHttp from "../../../hooks/useHttp";

const SportEvent = () => {
	const { postSportEvent } = useHttp();

	const sendData = async (e) => {
		e.preventDefault();

		try {
			const formData = new FormData(e.target);
			const data = await postSportEvent(formData);
			alert("Данные отправлены!");
		} catch (error) {
			console.log(error)
			alert("Ошибка!");
		}

		e.target.reset()
	}
	return (
		<Box component="form" onSubmit={sendData}
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
				Создать запись на спортивное мероприятие
			</Typography>

			<TextField
				required
				name="name"
				label="Наименование"
				variant="outlined"
				slotProps={{
					inputLabel: {
						shrink: true
					}
				}}
			/>
			<TextField
				name="description"
				label="Описание"
				variant="outlined"
				slotProps={{
					inputLabel: {
						shrink: true
					}
				}}
			/>
			<TextField
				required
				type="datetime-local"
				name="event_date"
				label="Дата проведения"
				variant="outlined"
				slotProps={{
					inputLabel: {
						shrink: true
					}
				}}
			/>
			<TextField
				type="datetime-local"
				name="registration_deadline"
				label="Крайний срок регистрации"
				variant="outlined"
				slotProps={{
					inputLabel: {
						shrink: true
					}
				}}
			/>
			<TextField
				name="location"
				label="Место проведения"
				variant="outlined"
				slotProps={{
					inputLabel: {
						shrink: true
					}
				}}
			/>
			<TextField
				name="organizer"
				label="Организатор"
				variant="outlined"
				slotProps={{
					inputLabel: {
						shrink: true
					}
				}}
			/>

			<Button
				type="submit"
				variant="contained"
			>
				Создать мероприятие
			</Button>
		</Box>
	)
}

export default SportEvent;