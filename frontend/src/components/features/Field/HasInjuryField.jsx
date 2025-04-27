import { TextField, MenuItem } from "@mui/material";

import { memo, useEffect } from "react";

const HasInjuryField = memo(({ entryTiming, setHasInjury, ...props }) => {
	console.log("HasInjuryField -> Рендер");

	useEffect(() => {
		if (entryTiming !== "after") {
			setHasInjury('');
		}
	}, [entryTiming, setHasInjury]);
	return (
		entryTiming === "after" && (
			<TextField
				select
				required
				variant="outlined"
				id="has-injury"
				name="hasInjury"
				label="Была ли травма ?"
				onChange={(e) => setHasInjury(e.target.value)}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
				helperText="Выберите из списка"
				{...props}	>
				<MenuItem value={true}>Да</MenuItem>
				<MenuItem value={false}>Нет</MenuItem>
			</TextField >)
	)
})

export default HasInjuryField;