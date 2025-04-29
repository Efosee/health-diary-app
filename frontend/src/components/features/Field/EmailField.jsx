import { TextField } from "@mui/material";
import { memo, useState, useEffect } from "react";

const EmailField = memo(({ email, ...props }) => {
	const [value, setValue] = useState(email || "");
	console.log("EmailField -> Рендер");

	useEffect(() => {
		setValue(email || "");
	}, [email]);

	return (
		<TextField
			required
			type="email"
			label="Email"
			name="email"
			onChange={(e) => setValue(e.target.value)}
			value={value}
			{...props}
		/>
	);
});

export default EmailField;
