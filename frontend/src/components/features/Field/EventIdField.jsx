import { TextField, MenuItem } from "@mui/material";

import { useState, memo, useEffect } from "react";
import useHttp from "../../../hooks/useHttp";

//Пример данных
const data = [
	{
		id: 1,
		name: "Marafon #1",
		event_date: "2025-05-20T15:00:00+03:00"
	},
	{
		id: 2,
		name: "Marafon #2",
		event_date: "2025-05-21T15:00:00+03:00"
	},
	{
		id: 3,
		name: "Marafon #3",
		event_date: "2025-05-22T15:00:00+03:00"
	}
]

const EventIdField = memo((props) => {
	const [value, setValue] = useState();
	const [data, setData] = useState();
	const {getSportUpcomingEvents} = useHttp();
	
	useEffect(() => {
		getSportUpcomingEvents()
			.then((data) => setData(data))
			.catch((err) => console.log(err));
	}, [])

	return (
		<TextField
			required
			value={value}
			onChange={(e) => setValue(e.target.value)}
			variant="outlined"
			id="event-id"
			name="eventId"
			select
			label="Спортивное событие"
			helperText="Выберите из списка"
			sx={{
				flexGrow: "1"
			}}
			slotProps={{
				inputLabel: {
					shrink: true,
				},
			}}
			{...props}
		>
			{data?.map((item) => {
				return (
					<MenuItem key={item.id} value={item.id}>
						{item.name} {item.event_date}
					</MenuItem>
				)
			})}
		</TextField>
	)
});

export default EventIdField;