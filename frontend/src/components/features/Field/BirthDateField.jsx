import { TextField } from "@mui/material";
import { memo, useState, useEffect } from "react";

const BirthDateField = memo(({ date, ...props }) => {
	//value or date format -> "YYYY-MM-DD", example: "2003-05-28"
	const [value, setValue] = useState(date || "");
	console.log("BirthDateField -> Рендер");

	useEffect(() => {
			setValue(date || "");
		}, [date]);

	return (
		<TextField
			required
			id="registration-date"
			label="Дата рождения"
			type="date"
			name="birthDate"
			variant="standard"
			slotProps={{
				inputLabel: {
					shrink: true
				}
			}}
			onChange={(e) => setValue(e.target.value)}
			value={value}
			{...props}
		/>
	);
});

export default BirthDateField;
