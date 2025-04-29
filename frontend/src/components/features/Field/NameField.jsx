import { TextField } from "@mui/material";
import { memo, useState, useEffect } from "react";

const NameField = memo(({ name, ...props }) => {
	const [value, setValue] = useState(name || "");
	console.log("NameField -> Рендер");

	useEffect(() => {
		setValue(name || "");
	}, [name]);

	return (
		<TextField
			required
			label="ФИО"
			name="full_name"
			onChange={(e) => setValue(e.target.value)}
			value={value}
			{...props}
		/>
	);
});

export default NameField;
