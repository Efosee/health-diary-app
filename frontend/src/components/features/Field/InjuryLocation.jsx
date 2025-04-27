import { TextField, MenuItem } from "@mui/material";

import { memo } from "react";

const InjuryLocation = memo(({ hasInjury, entryTiming, ...props }) => {
	console.log("InjuryLocation -> Рендер");

	return (
		entryTiming === "after" && hasInjury ? (
			<TextField
				select
				required
				id="injury-location"
				name="injuryLocation"
				label="Место травмы"
				variant="outlined"
				type="text"
				slotProps={{
					inputLabel: {
						shrink: true,
					}
				}}
				sx={{
					flexGrow: "1"
				}}
				helperText="Выберите из списка"
				{...props}>
				<MenuItem value={"leg"}>Нога</MenuItem>
				<MenuItem value={"arm"}>Рука</MenuItem>
				<MenuItem value={"torso"}>Торс</MenuItem>
				<MenuItem value={"head"}>Голова</MenuItem>
				<MenuItem value={"other"}>Другое</MenuItem>
			</TextField>) : null
	)
});

export default InjuryLocation;