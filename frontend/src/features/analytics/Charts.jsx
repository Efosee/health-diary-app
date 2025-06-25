import { LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, Bar, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import useHttp from "../../hooks/useHttp";
import metricsForFilter from './metricsForFilter.json';

const Charts = ({ metricsData }) => {
	console.log("Charts Render!")
	const [data, setData] = useState();
	console.log("Данные для отрисовки\n", data);
	const loadData = async () => {
		console.log(metricsData)
		const { dateStart: startDate, dateEnd: endDate, metrics, entry_type } = metricsData;
		try {
			let data = await getMetrics(startDate, endDate, metrics, entry_type);
			// TODO изменить данные с нечисловых в 1

			/* Если Object.keys(item.metrics).length === 0 то удалить элемент массива:
			Удаляет объект из массива data если в объекте поле metrics пустое - {}
			так как объект в массиве не имеет статистической значимости без какой-либо метрики*/
			data = [...data["personal"], ...data["event"]].filter((item) => Object.keys(item.metrics).length !== 0);

			setData(data);
			return data;
		} catch (error) {
			throw error;
		}
	}
	const { getMetrics } = useHttp();

	useEffect(() => {
		loadData();
	}, [metricsData]);

	const isLineChart = metricsData.chart === "line";
	const Chart = isLineChart ? LineChart : BarChart;
	const CharElement = isLineChart ? Line : Bar;

	// TODO Сделать отдельный компонент
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
				activeBar: { stroke: 'red', strokeWidth: 2 }
			}
		}
		// Добавление элементов графика в массив
		for (const metric of metricsData.metrics) {
			arr.push(
				<CharElement {...props} name={metric} dataKey={(data) => data.metrics[metric]} />
			);
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