const BASE_API = "http://localhost:8000";

class HttpError extends Error {
	constructor(message, status) {
		super(message);
		this.status = status;
		this.name = "HttpError";
	}
}

class HttpClient {
	constructor(baseURL) {
		this.baseURL = baseURL;
	}

	async request(endpoint, method, body, requestHeaders = {}, bodyFormat = "json") {
		const headers = {
			"Content-Type": bodyFormat === "json"
				? "application/json"
				: "application/x-www-form-urlencoded",
			...requestHeaders
		};

		const options = {
			method,
			headers
		};

		if (body && method !== "GET") {
			if (bodyFormat === "json") {
				options.body = JSON.stringify(body);
			} else if (bodyFormat === "form") {
				options.body = new URLSearchParams(body);
			}
		}

		try {
			console.log(`Отправка запроса на URL ${this.baseURL + endpoint}`)
			const response = await fetch(this.baseURL + endpoint, options);

			// Пытаемся получить ответ как JSON, даже если статус ошибочный
			const responseData = await response.json().catch(() => response.text());

			if (!response.ok) {
				const errorMessage = responseData?.detail || `HTTP error! Status: ${response.status}`;
				throw new HttpError(errorMessage, response.status);
			}

			return responseData;
		} catch (error) {
			console.error(`Request failed (${method} ${endpoint}):`, error.message);
			throw error;
		}
	}

	get(endpoint, headers) {
		return this.request(endpoint, "GET", null, headers);
	}

	post(endpoint, body, headers) {
		return this.request(endpoint, "POST", body, headers);
	}

	put(endpoint, body, headers) {
		return this.request(endpoint, "PUT", body, headers);
	}

	apiRequest(endpoint, method, body, requestHeaders, bodyFormat){
		const token = localStorage.getItem("token");
		const headers = {
			...(token && {"Authorization":	`Bearer ${token}`}),
			...requestHeaders
		}
		return this.request(endpoint, method, body, headers, bodyFormat);
	}

	apiGet(endpoint, headers){
		return this.apiRequest(endpoint, "GET", null, headers);
	}
	
	apiPost(endpoint, body, headers){
		return this.apiRequest(endpoint, "POST", body, headers);
	}

	apiPut(endpoint, body, headers) {
		return this.apiRequest(endpoint, "PUT", body, headers);
	}

	login(endpoint, email, password) {
		return this.request(
			endpoint, 
			"POST",
			{ username: email, password },
			{},
			"form"
		);
	}
	logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("name");
	}
}

const http = new HttpClient(BASE_API);
export default http;