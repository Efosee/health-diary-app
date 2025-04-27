import { TextField } from "@mui/material";

import { memo } from "react";

const MedicationsField = memo((props) => {
	console.log("MedicationsField -> Рендер");

	return (
		<TextField
			multiline
			rows={3}
			id="medications"
			name="medications"
			label="Введите принятые медикаменты"
			type="number"
			variant="outlined"
			{...props}
		/>
	)
});

export default MedicationsField;