import { LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, Bar, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import useHttp from "../../hooks/useHttp";
import metricsForFilter from './metricsForFilter.json';

const Charts = ({ metricsData }) => {
	console.log("Charts Render!")
	const [data, setData] = useState();
	console.log(data)
	const loadData = async () => {
		console.log(metricsData)
		const { dateStart: startDate, dateEnd: endDate, metrics, entry_type } = metricsData;
		try {
			const data = await getMetrics(startDate, endDate, metrics, entry_type);

			setData([...data["personal"], ...data["event"]])
			return data;
		} catch (error) {
			throw error;
		}
	}
	const { getMetrics } = useHttp();

	useEffect(() => {
		loadData();
	}, [metricsData]);

	const Chart = metricsData.chart === "line" ? LineChart : BarChart;
	const CharElement = metricsData.chart === "line" ? Line : Bar;

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
						left: -41 // Чтобы центровать график, сдвигаем влево
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey={(data) => data.date.slice(8, 10) + "." + data.date.slice(5, 7)}
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
					{/* TODO: 1. Сделать надо будет универсальнее строчку снизу, чтобы был не wellbeing_score, а данные, которые придут */}
					<CharElement name={metricsData.metrics[0]} type="monotone" dataKey={(data) => data.metrics.wellbeing_score} />
				</Chart>
			</ResponsiveContainer>
		</Box>
	)

}

export default Charts;