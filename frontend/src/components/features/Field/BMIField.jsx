import { TextField } from "@mui/material";

import { useMemo, memo } from "react";

const BMIField = memo(({ height, weight, ...props }) => {
	console.log("BMIField -> Рендер");
	const bmi = useMemo(() => {
    if (height && weight && !isNaN(height) && !isNaN(weight) && height > 0) {
      return (weight / ((height * height) / 10000)).toFixed(2);
    }
    return '';
  }, [height, weight]);

	return (
		<TextField
			id="bmi"
			name="bmi"
			label="ИМТ"
			variant="outlined"
			type="number"
			value={bmi}
			helperText={"Ваш ИМТ рассчитывается автоматически после ввода веса и роста"}
			slotProps={{
				inputLabel: {
					shrink: true,
				},
				htmlInput: {
					readOnly: true,
				}
			}}
			sx={{
				flexGrow: "1"
			}}
			{...props}
		/>
	)
});

export default BMIField;