import { TextField } from "@mui/material";

import { memo } from "react";

const NotesField = memo((props) => {
	console.log("NotesField -> Рендер");
	return (
		<TextField
			multiline
			rows={3}
			id="notes"
			name="notes"
			label="Введите ваши личные записи"
			type="number"
			variant="outlined"
			{...props}
		/>
	)
});

export default NotesField;