import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useHttp from "../../../hooks/useHttp";
import { processAdminsMetrics, processInjuriesData, mergeDataOnDate, filterAndSortData } from "../utils/dataProcessors"

const useChartsData = (metricsData) => {

	const [data, setData] = useState();
	const { isAdmin } = useAuth();
	const { getMetrics, getAdminAggregatedMetrics, getAdminInjuriesByDay } = useHttp();
	const { dateStart: startDate, dateEnd: endDate, metrics, entry_type } = metricsData;

	const loadAdminData = async () => {
		const data = [];
		if (metrics.includes("has_injury")) {
			const response = await getAdminInjuriesByDay(startDate, endDate, entry_type);
			const injuriesData = processInjuriesData(response);
			data.push(injuriesData);
		}

		const othersMetrics = metrics.filter(metric => metric !== "has_injury");
		if (othersMetrics.length > 0) {
			const response = await getAdminAggregatedMetrics(startDate, endDate, othersMetrics, entry_type);
			const adminData = processAdminsMetrics(response);
			data.push(adminData);
		}

		const isNeedMerge = data.length > 1;
		return isNeedMerge ? mergeDataOnDate(data.flat()) : data[0] || [];
	}

	const loadUserData = async () => {
		const response = await getMetrics(startDate, endDate, metrics, entry_type);
		return [...(response["personal"] || []), ...(response["event"] || [])];
	}

	const loadData = async () => {

		try {
			let rawData;
			if (isAdmin) {
				rawData = await loadAdminData();
			} else {
				rawData = await loadUserData();
			}
			const processedData = filterAndSortData(rawData);
			setData(processedData);

		} catch (err) {
			// setError(err.message || "Ошибка при загрузке данных");
			setData([]);
		} finally {
			// setIsLoading(false);
		}
	} 

	// const processedInjuries = async (startDate, endDate, entry_type) => {
	// 	const response = await getAdminInjuriesByDay(startDate, endDate, entry_type);
	// 	return Object.entries(response).map(([date, value]) => ({
	// 		date,
	// 		metrics: { "has_injury": value }
	// 	})
	// 	);
	// }

	// const processedAdminMetrics = async (startDate, endDate, metrics, entry_type) => {
	// 	const response = await getAdminAggregatedMetrics(startDate, endDate, metrics, entry_type);
	// 	return Object.entries(response).map(([date, metrics]) => ({
	// 		date,
	// 		metrics
	// 	})
	// 	);
	// }
	// const mergeDataOnDate = (data) => {
	// 	const merged = {};
	// 	data.forEach(item => {
	// 		merged[item.date] = merged[item.date] ?
	// 			{ date: item.date, metrics: { ...item.metrics, ...merged[item.date].metrics } }
	// 			: { ...item }
	// 	});
	// 	return Object.values(merged);
	// }

	// const loadData = async () => {
	// 	const { dateStart: startDate, dateEnd: endDate, metrics: originalMetrics, entry_type } = metricsData;
	// 	let metrics = [...originalMetrics];
	// 	let data;
	// 	let injuriesData;


	// 	if (isAdmin && metrics.includes("has_injury")) {
	// 		injuriesData = await processedInjuries(startDate, endDate, entry_type);
	// 		metrics = metrics.filter(value => value !== "has_injury")
	// 	}
	// 	if (isAdmin) {
	// 		if (metrics.length === 0) {
	// 			data = injuriesData;
	// 		} else {
	// 			data = await processedAdminMetrics(startDate, endDate, metrics, entry_type);

	// 			if (injuriesData && injuriesData.length !== 0) {
	// 				data = mergeDataOnDate([...(injuriesData || []), ...(data || [])])
	// 			}
	// 		}
	// 	} else {
	// 		data = await getMetrics(startDate, endDate, metrics, entry_type);
	// 		data = [...(data["personal"] || []), ...(data["event"] || [])];
	// 	}

	// 	/* Если Object.keys(item.metrics).length === 0 то удалить элемент массива:
	// 	Удаляет объект из массива data если в объекте поле metrics пустое - {}
	// 	так как объект в массиве не имеет статистической значимости без какой-либо метрики*/
	// 	data = data.filter((item) => Object.keys(item.metrics).length !== 0)
	// 		.sort((a, b) => new Date(a.date) - new Date(b.date));

	// 	setData(data);
	// 	return data;
	// }


	useEffect(() => {
		loadData();
	}, [metricsData]);

	return { data }
}

export default useChartsData;


/*
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

			//Если Object.keys(item.metrics).length === 0 то удалить элемент массива:
			//Удаляет объект из массива data если в объекте поле metrics пустое - {}
			//так как объект в массиве не имеет статистической значимости без какой-либо метрики
			//data = data.filter((item) => Object.keys(item.metrics).length !== 0)
			//	.sort((a, b) => new Date(a.date) - new Date(b.date));

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
 */