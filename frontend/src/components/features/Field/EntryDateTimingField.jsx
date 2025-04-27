import { Box, TextField, MenuItem } from "@mui/material";

import {memo} from "react";
import { getMoscowDateTimeISO } from "../../../utils/moscowTime";

const EntryDateTimingField = memo(({setEntryTiming, entryDate, entryTiming, ...props}) => {
	console.log("EntryDateTimingField -> Рендер");
	const dateTimeString = getMoscowDateTimeISO()

	return (
		<Box sx={{
			display: "flex",
			justifyContent: "space-between",
			gap: "20%"
		}}
		>

			<TextField
				required
				defaultValue={entryDate ? entryDate : dateTimeString}
				id="entry-date"
				name={"entryDate"}
				label="Дата записи"
				variant="outlined"
				type="datetime-local"
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				sx={{
					flexGrow: "1",
					
				}}
				{...props}
			/>
			<TextField
				required
				variant="outlined"
				id="entry-timing"
				name="entryTiming"
				select
				label="Период"
				onChange={(e) => setEntryTiming(e.target.value)}
				helperText="Выберите из списка"
				defaultValue={entryTiming ? entryTiming : "before"}
				sx={{
					flexGrow: "1",
					width: "220px"
				}}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				{...props}
			>
				<MenuItem value={"before"}>
					До тренировки
				</MenuItem>
				<MenuItem value={"after"}>
					После тренировки
				</MenuItem>
				<MenuItem value={"rest"}>
					День отдыха
				</MenuItem>
			</TextField>
		</Box>
	)
});

export default EntryDateTimingField;