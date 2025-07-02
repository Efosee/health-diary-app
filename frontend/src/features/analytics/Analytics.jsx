import { memo, useMemo, useState } from "react";
import { getMoscowDateTimeISO, updateDateTime } from "../../utils/moscowTime";
import useChartsData from "./useChartsData";

import Filters from "./Filters";
import Charts from "./Charts";
import { Box } from "@mui/material";
import Container from "../../components/ui/Container/Container";

const Analytics = memo(() => {
	const dateEnd = useMemo(() => getMoscowDateTimeISO().slice(0, 10), []);
	const dateStart = useMemo(() => updateDateTime(new Date(dateEnd), -30).slice(0, 10), []);
	const [metricsData, setMetricsData] = useState({
		metrics: ["wellbeing_score"],
		entry_type: "all",
		chart: "line",
		dateStart: dateStart,
		dateEnd: dateEnd,
		numOfMetrics: 1
	});
	const {data} = useChartsData(metricsData);

	return (
		<Container>
			<Box sx={{
				display: "flex",
				flexDirection: "column",
				textAlign: "center",
				gap: "40px",
				width: "100%"
			}}>
				<Filters metricsData={metricsData} setMetricsData={setMetricsData} />
				<Charts metricsData={metricsData} data={data}/>
			</Box>
		</Container>
	)
});

export default Analytics;