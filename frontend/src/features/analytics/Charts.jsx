import { LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, Bar, CartesianGrid } from "recharts";
import { Box } from "@mui/material";
import metricsForFilter from './constants/metricsForFilter.json';
import { CHART_COLORS } from "./constants/chartConstants";

const Charts = ({ metricsData, data }) => {
	console.log("Charts Render!")

	const isLineChart = metricsData.chart === "line";
	const Chart = isLineChart ? LineChart : BarChart;
	const CharElement = isLineChart ? Line : Bar;

	const renderCharElements = (metricsData) => {
		const arr = [];
		const isLineChart = metricsData.chart === "line";
		let props;
		// Формирование props в зависимости от типа графика
		if (isLineChart) {
			props = {
				type: "monotone",
				connectNulls: true,
				activeDot: { r: 5, strokeWidth: 2 }
			}
		} else {
			props = {
				activeBar: { stroke: 'black', strokeWidth: 2 },
				maxBarSize: 150
			}
		}
		// Добавление элементов графика в массив
		let colorIndex = 0;
		for (const metric of metricsData.metrics) {
			const color = isLineChart ? { stroke: CHART_COLORS[colorIndex] } : { fill: CHART_COLORS[colorIndex] }
			arr.push(
				<CharElement {...props} name={metric}
					dataKey={(data) => data.metrics[metric]}
					{...color} />
			);
			colorIndex++;
		}
		return arr;
	}

	return (
		<Box sx={{
			height: "55vh"
		}}>
			<ResponsiveContainer width="100%" height="95%">
				<Chart
					data={data}
					margin={{
						bottom: 30, // Чтобы поднять график -> чтобы были видны нижние подписи
						top: 5, // Чтобы самая верхняя точка была полностью видна
						right: 3, // Чтобы самая крайняя правая точка была полностью видна
						left: -5 // Чтобы центровать график, сдвигаем влево
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey={(data) => data.date.slice(8, 10) + "." + data.date.slice(5, 7)}
						tickSize={30}
					/>
					<YAxis />
					<Tooltip
						formatter={(value, name) => {
							for (const item of metricsForFilter) {
								if (item.metric == name) {
									return [value, item.name]
								}
							}
						}}
					/>
					<Legend wrapperStyle={{
						position: "absolute",
						bottom: "0px",
						left: "2px"
					}}
						formatter={(value) => {
							for (const item of metricsForFilter) {
								if (item.metric == value) {
									return item.name
								}
							}
						}}
					/>
					{renderCharElements(metricsData)}
				</Chart>
			</ResponsiveContainer>
		</Box>
	)

}



export default Charts;