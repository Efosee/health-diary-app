import { Box, TextField, Typography } from "@mui/material";
import { useState, memo } from "react";

const PressureField = memo(({bloodPressureSys, bloodPressureDia, ...props}) => {
	console.log("PressureField -> Рендер");
	const [sys, setSys] = useState(bloodPressureSys || "");
	const [dia, setDia] = useState(bloodPressureDia || "");
	const [sysError, setSysError] = useState("");
	const [diaError, setDiaError] = useState("");

	const validateSys = (value) => {
		const num = Number(value);
		if (value && (isNaN(num) || num < 70 || num > 250)) {
			setSysError("70–250 мм рт. ст.");
		} else {
			setSysError("");
		}
		setSys(value);
	};

	const validateDia = (value) => {
		const num = Number(value);
		if (value && (isNaN(num) || num < 50 || num > 150)) {
			setDiaError("50–150 мм рт. ст.");
		} else {
			setDiaError("");
		}
		setDia(value);
	};

	return (
		<Box
			sx={{
				display: "flex",
				gap: "10px",
				alignItems: "center",
				justifyContent: "center",
				position: "relative",
				border: "solid 1px rgba(0, 0, 0, 0.23)",
				borderRadius: "4px",
				p: "20px",
				flexWrap: "wrap",
			}}
		>
			<Typography
				sx={{
					position: "absolute",
					top: 0,
					left: 12,
					transform: "translateY(-50%)",
					backgroundColor: "white",
					px: "4px",
					color: "rgba(0, 0, 0, 0.6)",
					fontSize: "0.75rem",
				}}
			>
				Давление
			</Typography>

			<TextField
				id="blood-pressure-sys"
				name="bloodPressureSys"
				variant="standard"
				label="Систолическое"
				type="number"
				value={sys}
				onChange={(e) => validateSys(e.target.value)}
				error={!!sysError}
				helperText={sysError}
				slotProps={{
					htmlInput: {
						min: 70,
						max: 250
					}

				}}
				sx={{ width: "140px" }}
			/>

			<Typography sx={{
				fontSize: {
					xs: "1.2em",
					sm: "1.5em",
					md: "2em"
				},
				alignSelf: {
					xs: "flex-end",
					sm: "flex-end",
					md: "center"
				}
			}}>/</Typography>

			<TextField
				id="blood-pressure-dia"
				name="bloodPressureDia"
				variant="standard"
				label="Диастолическое"
				type="number"
				value={dia}
				onChange={(e) => validateDia(e.target.value)}
				error={!!diaError}
				helperText={diaError}
				slotProps={{
					htmlInput: {
						min: 50,
						max: 150
					}

				}}

				sx={{ width: "140px" }}
			/>
		</Box>
	);
});

export default PressureField;
