import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";

const metricLabels = {
	wellbeing_score: { label: "Самочувствие", unit: "", min: 1, max: 10 },
	blood_pressure_sys: { label: "Систолическое давление", unit: "мм рт. ст.", min: 70, max: 250 },
	blood_pressure_dia: { label: "Диастолическое давление", unit: "мм рт. ст.", min: 50, max: 150 },
	pulse: { label: "Пульс", unit: "уд/мин", min: 30, max: 250 },
	temperature: { label: "Температура", unit: "°C", min: 34, max: 42 },
	weight: { label: "Вес", unit: "кг", min: 35, max: 300 },
	height: { label: "Рост", unit: "см", min: 100, max: 230 },
	bmi: { label: "ИМТ", unit: "", min: 0, max: 100 },
	sleep_quality: { label: "Качество сна", unit: "", min: 1, max: 10 },
	sleep_hours: { label: "Часы сна", unit: "ч", min: 0, max: 24 },
	blood_sugar: { label: "Уровень сахара", unit: "ммоль/л", min: 0, max: 50 },
	injuries_count: { label: "Количество травм", unit: "", min: 0, max: 100 },
};

const AnalyticsChart = ({ data, metric, chartType }) => {
	if (!data || data.length === 0) {
		return (
			<Box sx={{ textAlign: "center", mt: 4 }}>
				<Typography>Нет данных для отображения</Typography>
			</Box>
		);
	}

	if (metric === "injuries_count") {
		let max = 0;
		data.forEach(obj => {
			max = obj.value > max ? obj.value : max
		});

		metricLabels.injuries_count.max = max + 10
	}

	const { label, unit, min, max } = metricLabels[metric] || {
		label: metric,
		unit: "",
		min: 0,
		max: 100,
	};

	// Вычисляем ширину графика: 100px на точку, минимум 300px, максимум 100%
	const chartWidth = data.length < 10 ? Math.max(300, data.length * 100) : "100%";

	const ChartComponent = chartType === "bar" ? BarChart : LineChart;
	const DataElement = chartType === "bar" ? Bar : Line;

	return (
		<Box sx={{ mt: 4 }}>
			<Typography variant="h6" align="center" gutterBottom>
				{label} ({unit})
			</Typography>
			<Box sx={{ width: chartWidth, margin: "0 auto" }}>
				<ResponsiveContainer width="100%" height={400}>
					<ChartComponent
						data={data}
						margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickFormatter={(date) => {
								const d = new Date(date);
								const day = d.getDate().toString().padStart(2, "0");
								const month = (d.getMonth() + 1).toString().padStart(2, "0");
								return `${day}.${month}`;
							}}
						/>
						<YAxis domain={[min, max]} />
						<Tooltip formatter={(value) => `${value} ${unit}`} />
						<DataElement
							type={chartType === "line" ? "monotone" : undefined}
							dataKey="value"
							stroke="#1976d2"
							fill="#1976d2"
							activeDot={chartType === "line" ? { r: 8 } : undefined}
						/>
					</ChartComponent>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
};

export default AnalyticsChart;