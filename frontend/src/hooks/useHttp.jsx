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

	async function getMetrics(startDate, endDate, metrics, headers) {
		const params = new URLSearchParams({startDate, endDate, params});
		metrics.forEach(metric => {
			params.append("metrics", metric)
		});
		const endpoint = "/analystics/metrics?" + params.toString()
	}

	return {
		getUser, putUser,
		getPersonalTraining, getAllPersonalTraining, postPersonalTraining, putPersonalTraining,
		getAllEventTraining, getEventTraining, postEventTraining, putEventTraining,
		getSportUpcomingEvents, postSportEvent, getSportCurrentEvents, getSportPastEvents,

	}
}

export default useHttp;