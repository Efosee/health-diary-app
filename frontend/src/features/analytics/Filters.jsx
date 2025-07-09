import { memo, useReducer } from "react";
import { TextField, MenuItem, Box, Button } from "@mui/material";
import metrics from "./constants/metricsForFilter.json";
import entry_type from './constants/entryTypes.json';
import { Add, Remove } from "@mui/icons-material";
import { MAX_METRICS_FILTERS, CHART_OPTIONS } from "./constants/chartConstants";
import { useAnalyticsFilters } from "./hooks/useAnalyticsFilters";

// const reducer = (state, action) => {
// 	switch (action.type) {
// 		case "metrics":
// 			const newMetrics = [...state.metrics];
// 			newMetrics[action.payload.index] = action.payload.value;
// 			return { ...state, "metrics": newMetrics }
// 		case "entry_type":
// 			return { ...state, "entry_type": action.payload }
// 		case "chart":
// 			return { ...state, "chart": action.payload }
// 		case "dateStart":
// 			return { ...state, "dateStart": action.payload }
// 		case "dateEnd":
// 			return { ...state, "dateEnd": action.payload }
// 		case "addMetric":
// 			return { ...state, "metrics": [...state.metrics, "wellbeing_score"] }
// 		case "removeMetric":
// 			const metrics = [...state.metrics].filter((_, i) => i != action.payload.index);
// 			return { ...state, "metrics": metrics }
// 	}
// }

const Filters = memo(({ metricsData, setMetricsData }) => {
	const { state, action } = useAnalyticsFilters(metricsData);
	console.log('Filters Render!');

	//TODO: Сделать отдельным копонентом
	const renderMetricsFilter = (n) => {
		const arr = [];
		n = n > MAX_METRICS_FILTERS ? MAX_METRICS_FILTERS : n;

		for (let i = 0; i < n; i++) {
			let Icon;
			// Как вариант сделать делегирование событий на Box и убрать обработчики с каждой иконки
			if (i + 1 === n && i + 1 !== MAX_METRICS_FILTERS) {
				Icon = <Add color="success" fontSize="large" onClick={action.addMetric} />;
			} else {
				Icon = <Remove sx={{ color: "red" }} fontSize="large" onClick={() => action.removeMetric(i)} />;
			}

			arr.push(
				<Box sx={{
					display: "flex",
					alignItems: "center"
				}}
					key={i}
				>
					{Icon}
					<TextField
						select
						label="Метрики"
						value={state.metrics[i]}
						onChange={(e) => action.setMetric(i, e.target.value)}
						sx={{
							flexGrow: 0
						}}
					>
						{metrics.map((item) => {
							return (
								<MenuItem key={item.metric} value={item.metric}>
									{item.name}
								</MenuItem>)
						})}
					</TextField>
				</Box>
			)
		}

		return arr;
	}

	return (
		<Box sx={{
			display: 'grid',
			gridTemplateColumns: "auto minmax(90px, auto) auto auto auto",
			gridTemplateRows: "auto auto",
			gap: "15px 10px",
			marginTop: "30px",
			justifyContent: "center"
		}}>
			<Box sx={{
				display: "flex",
				flexDirection: "column",
				gap: "8px"
			}}>
				{renderMetricsFilter(state.metrics.length)}
			</Box>

			<TextField
				select
				label="Тип записи"
				value={state.entry_type}
				onChange={(e) => action.setEntryType(e.target.value)}
			>
				{entry_type.map((item) => {
					return (
						<MenuItem key={item.entry_type} value={item.entry_type}>
							{item.name}
						</MenuItem>)
				})}
			</TextField>

			<TextField
				select
				label="Тип диаграммы"
				value={state.chart}
				onChange={(e) => action.setChartType(e.target.value)}
			>
				{CHART_OPTIONS.map((item) => {
					return (
						<MenuItem key={item.value} value={item.value}>
							{item.label}
						</MenuItem>)
				})}
			</TextField>
			<TextField
				label="Начало"
				type="date"
				value={state.dateStart}
				onChange={(e) => action.setDateStart(e.target.value)}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
			/>

			<TextField
				label="Конец"
				type="date"
				value={state.dateEnd}
				onChange={(e) => action.setDateEnd(e.target.value)}
				slotProps={{
					inputLabel: {
						shrink: true,
					},
				}}
			/>
			<Button
				variant="contained"
				color="primary"
				onClick={() => setMetricsData(state)}
				sx={{
					justifySelf: "center",
					gridColumn: "1/6"
				}}
			>Применить</Button>
		</Box>
	);
});
export default Filters;