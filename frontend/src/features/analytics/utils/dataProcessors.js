export const processInjuriesData = (response) => {
	return Object.entries(response).map(([date, value]) => ({
		date,
		metrics: { "has_injury": value }
	})
	);
}

export const processAdminsMetrics = (response) => {
	return Object.entries(response).map(([date, metrics]) => ({
		date,
		metrics
	})
	);
}

/**
	 * Объединяет объекты (в массиве) с одинаковой датой в один объект,
	 * объединяя их метрики 
	 * @param {Array<{ date: string, metrics: Object}>} data - Массив объектов с полями `date` и `metrics`
	 * @returns {Array<{ date: string, metrics: Object}>} 
*/
export const mergeDataOnDate = (data) => {
	const merged = {};
	data.forEach(item => {
		merged[item.date] = merged[item.date] ?
			{ date: item.date, metrics: { ...item.metrics, ...merged[item.date].metrics } }
			: { ...item }
	});
	return Object.values(merged);
}

export const filterAndSortData = (data) => {
  return data
    .filter(item => Object.keys(item.metrics).length > 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};