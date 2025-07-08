import { useReducer, useCallback } from "react";
import { DEFAULT_METRIC } from "../constants/chartConstants";

const filtersReducer = (state, action) => {
	switch (action.type) {
		case "SET_METRIC":
			const newMetrics = [...state.metrics];
			newMetrics[action.payload.index] = action.payload.value;
			return { ...state, "metrics": newMetrics };

		case "SET_ENTRY_TYPE":
			return { ...state, "entry_type": action.payload };

		case "SET_CHART_TYPE":
			return { ...state, "chart": action.payload };

		case "SET_DATE_START":
			return { ...state, "dateStart": action.payload };

		case "SET_DATE_START_END":
			return { ...state, "dateEnd": action.payload };

		case "ADD_METRIC":
			return { ...state, "metrics": [...state.metrics, DEFAULT_METRIC] }

		case "REMOVE_METRIC":
			const metrics = [...state.metrics].filter((_, i) => i != action.payload.index);
			return { ...state, "metrics": metrics };

		default:
			return state;
	}
}

export const useAnalyticsFilters = (initialData) => {
	const [state, dispatch] = useReducer(filtersReducer, initialData);

	const setMetric = useCallback((index, value) => {
		dispatch({ type: "SET_METRIC", payload: { index, value } });
	}, []);

	const setEntryType = (value) => {
		dispatch({ type: "SET_ENTRY_TYPE", payload: value });
	}

	const setChartType = (value) => {
		dispatch({ type: "SET_CHART_TYPE", payload: value });
	}

	const setDateStart = (value) => {
		dispatch({ type: "SET_DATE_START", payload: value });
	}

	const setDateEnd = (value) => {
		dispatch({ type: "SET_DATE_END", payload: value });
	}

	const addMetric = () => {
		dispatch({ type: "ADD_METRIC", payload: value });
	}

	const removeMetric = useCallback((index) => {
		dispatch({ type: "REMOVE_METRIC", payload: { index } });
	}, []);

	return {
		state,
		setMetric,
		setEntryType,
		setChartType,
		setDateStart,
		setDateEnd,
		addMetric,
		removeMetric
	}

}