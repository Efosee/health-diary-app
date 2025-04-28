import http from "../api/http";
import { useAuth } from "../contexts/AuthContext";
import prepareDataForApi from "../utils/transformDataForApi";
import { useParams } from "react-router";
import { useCallback } from "react";
const useHttp = () => {
	const { logout } = useAuth();
	const { trainingId } = useParams();

	async function getUser(headers) {
		try {
			const userData = await http.apiGet("/users/me", headers);
			return userData;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function putUser(body, headers) {
		body = prepareDataForApi(body);

		try {
			const userData = await http.apiPut("/users/me", body, headers);
			return userData;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function getHealth(headers) {
		try {
			const healthData = await http.apiGet("/health/me", headers)
			return healthData;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function postHealth(body, headers) {
		body = prepareDataForApi(body);

		try {
			const userData = await http.apiPost("/health/me", body, headers);
			return userData;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function putHealth(body, headers) {
		body = prepareDataForApi(body);

		try {
			const userData = await http.apiPut("/health/me", body, headers);
			return userData;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	const getAllPersonalTraining = useCallback(async (skip = 0, limit = 100, headers) => {
		const endpoin = "/personal_training/?" + new URLSearchParams({ skip, limit }).toString();
		console.log(endpoin);
		try {
			const personalTrainingList = await http.apiGet(endpoin, headers);
			return personalTrainingList;
		} catch (error) {
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}, []);

	async function getPersonalTraining(id = trainingId, headers) {
		const endpoin = `/personal_training/${id}`;
		try {
			const personalTraining = await http.apiGet(endpoin, headers);
			return personalTraining;
		} catch (error) {
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function putPersonalTraining(id = trainingId, body, headers) {
		body = prepareDataForApi(body);

		try {
			const personalTraining = await http.apiPut(`/personal_training/${id}`, body, headers);
			return personalTraining;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function postPersonalTraining(body, headers) {
		body = prepareDataForApi(body);

		try {
			const personalTraining = await http.apiPost("/personal_training/", body, headers);
			return personalTraining;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	//EventTraining
	const getAllEventTraining = useCallback(async (skip = 0, limit = 100, headers) => {
		const endpoin = "/event_training/?" + new URLSearchParams({ skip, limit }).toString();
		try {
			const eventTrainingList = await http.apiGet(endpoin, headers);
			return eventTrainingList
		} catch (error) {
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}, []);

	async function getEventTraining(id = trainingId, headers) {
		const endpoin = `/event_training/${id}`;
		try {
			const eventTraining = await http.apiGet(endpoin, headers);
			return eventTraining
		} catch (error) {
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function putEventTraining(id = trainingId, body, headers) {
		body = prepareDataForApi(body);

		try {
			const eventTraining = await http.apiPut(`/event_training/${id}`, body, headers);
			return eventTraining;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function postEventTraining(body, headers) {
		body = prepareDataForApi(body);

		try {
			const eventTraining = await http.apiPost("/event_training/", body, headers);
			return eventTraining;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function postSportEvent(body, headers) {
		body = prepareDataForApi(body);

		try {
			const sportEvent = await http.apiPost("/sport_events/", body, headers);
			return sportEvent;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function getSportUpcomingEvents(headers) {
		try {
			const upcomingEvents = await http.apiGet("/sport_events/upcoming", headers);
			return upcomingEvents;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function getSportCurrentEvents(headers) {
		try {
			const upcomingEvents = await http.apiGet("/sport_events/current_week", headers);
			return upcomingEvents;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	async function getSportPastEvents(headers) {
		try {
			const upcomingEvents = await http.apiGet("/sport_events/past", headers);
			return upcomingEvents;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}

	/* 
	ВОЗМОЖНЫЕ МЕТРИКИ (metrics - array): 
	wellbeing_score, training_intensity, has_injury, injury_location, weight, height, 
	bmi, blood_pressure_sys, blood_pressure_dia, food_score, temperature, pulse, 
	sleep_quality, sleep_hours, blood_sugar, personal_notes, medications.

	(НО для getAdminAggregatedMetrics нельзя использовать: injury_location, personal_notes, medications,
	а также не рекомендуется has_injury)

	ФОРМАТ ДАТЫ YYYY-MM-DD пример:
	startDate = "2025-04-01", endDate = "2025-04-30"

	ВОЗМОЖНЫЕ ВАРИАНТЫ entry_type: "all", "personal", "event"

	ФОРМАТ ОТВЕТА ДЛЯ getMetrics:
	{
	"personal": [
		{
			"date": "2025-04-27T21:46:00",
			"entry_timing": "after",
			"event_id": null,
			"metrics": {
				"wellbeing_score": 5,
				"training_intensity": 5,
				"personal_notes": null
			}
		}
	],
	"event": [
		{
			"date": "2025-04-22T23:32:00",
			"entry_timing": "before",
			"event_id": 1,
			"metrics": {
				"wellbeing_score": 6,
				"personal_notes": null
			}
		},
		{
			"date": "2025-04-07T17:18:05.088000",
			"entry_timing": "rest",
			"event_id": 1,
			"metrics": {
				"wellbeing_score": 5,
				"personal_notes": "string"
			}
		}
	]
}
	ФОРМАТ ОТВЕТА ДЛЯ getAdminAggregatedMetrics (медианные знаения по дням для всех пользователей):
	{
		"2025-04-27": {
		"wellbeing_score": 5,
		"weight": 67,
		"sleep_hours": 7
		},
		"2025-04-26": {
		"wellbeing_score": 5.5,
		"weight": 67,
		"sleep_hours": 7
		} и так далее...
	}
	ФОРМАТ ОТВЕТА ДЛЯ getAdminInjuriesByDay (сколько было среди всех пользователей по дням):
	{
	"2025-04-27": 1,
	"2025-04-07": 2
	}
	*/
	const getMetrics = useCallback(async (startDate, endDate, metrics, entry_type = "all", headers) => {
		const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
		metrics.forEach(metric => {
			params.append("metrics", metric)
		});
		params.append("entry_type", entry_type);
		const endpoint = "/analytics/metrics?" + params.toString()
		try {
			const userMetrics = await http.apiGet(endpoint, headers);
			return userMetrics;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}, []);

	const getAdminAggregatedMetrics = useCallback(async (startDate, endDate, metrics, entry_type = "all", headers) => {
		const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
		metrics.forEach(metric => {
			params.append("metrics", metric)
		});
		params.append("entry_type", entry_type);
		const endpoint = "/analytics/admin_daily_aggregated?" + params.toString();
		try {
			const allUsersAggregatedMetrics = await http.apiGet(endpoint, headers);
			return allUsersAggregatedMetrics;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}, []);

	const getAdminInjuriesByDay = useCallback(async (startDate, endDate, entry_type = "all", headers) => {
		const params = new URLSearchParams({ start_date: startDate, end_date: endDate, entry_type });
		const endpoint = "/analytics/admin_injuries_by_day?" + params.toString();
		try {
			const allUsersAggregatedMetrics = await http.apiGet(endpoint, headers);
			return allUsersAggregatedMetrics;
		} catch (error) {
			console.log(error.message);
			if (error.status === 401) {
				logout();
			}
			throw error;
		}
	}, []);

	return {
		getUser, putUser,
		getPersonalTraining, getAllPersonalTraining, postPersonalTraining, putPersonalTraining,
		getAllEventTraining, getEventTraining, postEventTraining, putEventTraining,
		getSportUpcomingEvents, postSportEvent, getSportCurrentEvents, getSportPastEvents,
		getMetrics, getAdminAggregatedMetrics, getAdminInjuriesByDay
	}
}

export default useHttp;