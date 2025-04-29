import { TextField, MenuItem } from "@mui/material";
import { memo, useState, useEffect } from "react";

const GenderField = memo(({ gender, ...props }) => {
	const [value, setValue] = useState(gender || "");
	console.log("GenderField -> Рендер");

	useEffect(() => {
			setValue(gender || "");
		}, [gender]);

	return (
		<TextField
			required
			select
			id="gender"
			label="Пол"
			name="gender"
			variant="standard"
			slotProps={{
				inputLabel: {
					shrink: true
				}
			}}
			onChange={(e) => setValue(e.target.value)}
			value={value}
			{...props}
		>
			<MenuItem value="male" key="male">
				Мужской
			</MenuItem>
			<MenuItem value="female" key="female">
				Женский
			</MenuItem>
		</TextField>
	);
});

export default GenderField;
