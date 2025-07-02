import { useEffect, useCallback, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useHttp from "../../hooks/useHttp";

const useChartsData = (metricsData) => {

	const [data, setData] = useState();
	const { isAdmin } = useAuth();
	const { getMetrics, getAdminAggregatedMetrics, getAdminInjuriesByDay } = useHttp();

	const loadData = async () => {
		const { dateStart: startDate, dateEnd: endDate, metrics: originalMetrics, entry_type } = metricsData;

		try {
			const metrics = [...originalMetrics];
			let data;
			let injuriesData;
			if (isAdmin && metrics.includes("has_injury")) {
				injuriesData = await getAdminInjuriesByDay(startDate, endDate, entry_type);
				const newData = [];
				for (const [key, value] of Object.entries(injuriesData)) {
					newData.push({ date: key, metrics: { "has_injury": value } });
				}
				injuriesData = newData;
				metrics.forEach((value, index) => {
					if (value === "has_injury") {
						metrics.splice(index, 1);
					}
				});
				console.log(injuriesData)
			}
			if (isAdmin) {
				if (metrics.length === 0) {
					data = injuriesData;
				} else {
					data = await getAdminAggregatedMetrics(startDate, endDate, metrics, entry_type);
					const newData = [];
					for (const [key, value] of Object.entries(data)) {
						newData.push({ date: key, metrics: value });
					}
					data = newData;
					console.log(data)
					if (injuriesData && injuriesData.length !== 0) {
						const mergeObj = {};
						[...data, ...injuriesData].forEach((item) => {
							if (mergeObj[item.date]) {
								mergeObj[item.date] = {
									date: item.date,
									metrics: { ...item.metrics, ...mergeObj[item.date].metrics }
								}
							} else {
								mergeObj[item.date] = { ...item }
							}
						});
						console.log(mergeObj)
						data = Object.values(mergeObj);
						console.log(data)
					}
				}
			} else {
				data = await getMetrics(startDate, endDate, metrics, entry_type);
				data = [...(data["personal"] || []), ...(data["event"] || [])];
			}

			/* Если Object.keys(item.metrics).length === 0 то удалить элемент массива:
			Удаляет объект из массива data если в объекте поле metrics пустое - {}
			так как объект в массиве не имеет статистической значимости без какой-либо метрики*/
			data = data.filter((item) => Object.keys(item.metrics).length !== 0)
				.sort((a, b) => new Date(a.date) - new Date(b.date));

			setData(data);
			return data;
		} catch (error) {
			throw error;
		}
	}


	useEffect(() => {
		loadData();
	}, [metricsData]);

	return {data}
}

export default useChartsData;