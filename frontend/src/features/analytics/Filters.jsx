import { memo, useReducer } from "react";
import { TextField, MenuItem, Box, Button } from "@mui/material";
import metrics from "./metricsForFilter.json";
import entry_type from './entryTypes.json';
import { Add, Remove } from "@mui/icons-material";

const charts = [
	{
		chart: "line",
		name: "Линейный"
	},
	{
		chart: "bar",
		name: "Столбчатый"
	}
]

const reducer = (state, action) => {
	switch (action.type) {
		case "metrics":
			const newMetrics = [...state.metrics];
			newMetrics[action.payload.index] = [action.payload.value];
			return { ...state, "metrics": newMetrics }
		case "entry_type":
			return { ...state, "entry_type": action.payload }
		case "chart":
			return { ...state, "chart": action.payload }
		case "dateStart":
			return { ...state, "dateStart": action.payload }
		case "dateEnd":
			return { ...state, "dateEnd": action.payload }
		case "numOfMetrics":
			return { 
				...state, "numOfMetrics": state.numOfMetrics + action.payload.change, "metrics": [...state.metrics, "wellbeing_score"]
			}
	}
}

const Filters = memo(({ metricsData, setMetricsData }) => {
	const [state, dispatch] = useReducer(reducer, metricsData);
	console.log('Filters Render!');

	//TODO: 2. Сделать так, чтобы при плюсе добавлялось в массив metrics еще одно значение последним по умолчанию самочувствие
	// А если минус, то удалялось по индексу 
	const renderMetricsFilter = (n) => {
		const arr = [];
		for (let i = 0; i < n; i++) {
			const Icon = i + 1 === n ?
			// Как вариант сделать делегирование событий на Box и убрать обработчики с каждой иконки
				<Add color="success" fontSize="large" onClick={() => dispatch({ type: "numOfMetrics", payload: {change: 1, index: i} })} /> :
				<Remove sx={{ color: "red" }} fontSize="large" onClick={() => dispatch({ type: "numOfMetrics", payload: {change: -1, index: i} })} />;
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
						onChange={(e) => dispatch({ type: "metrics", payload: {value: e.target.value, index: i} })}
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

	// TODO: 3. Разобраться и пофиксить, почему надпись в 0 значении исчезла
	return (
		<Box sx={{
			display: 'grid',
			gridTemplateColumns: "auto 90px auto auto auto",
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
				{renderMetricsFilter(state.numOfMetrics)}
			</Box>

			<TextField
				select
				label="Тип записи"
				value={state.entry_type}
				onChange={(e) => dispatch({ type: "entry_type", payload: e.target.value })}
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
				onChange={(e) => dispatch({ type: "chart", payload: e.target.value })}
			>
				{charts.map((item) => {
					return (
						<MenuItem key={item.chart} value={item.chart}>
							{item.name}
						</MenuItem>)
				})}
			</TextField>
			<TextField
				label="Начало"
				type="date"
				value={state.dateStart}
				onChange={(e) => dispatch({ type: "dateStart", payload: e.target.value })}
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
				onChange={(e) => dispatch({ type: "dateEnd", payload: e.target.value })}
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