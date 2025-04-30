import { TextField } from "@mui/material";
import { memo, useState, useEffect } from "react";

const DiseasesField = memo(({ diseases, ...props }) => {
	const [value, setValue] = useState(diseases || "");
	console.log("DiseasesField -> Рендер");

	useEffect(() => {
			setValue(diseases || "");
		}, [diseases]);

	return (
		<TextField
			multiline
			rows={3}
			label="Хронические заболевания"
			name="chronic_diseases"
			variant="outlined"
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

export default DiseasesField;
