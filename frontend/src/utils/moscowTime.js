
function getMoscowDateTimeISO(){
	// UTC+3 -> Московское время в миллисекундах
	const mskNow = new Date().getTime() + 3 * 60 * 60 * 1000;
	//ISO формат -> тип данных string 
	return new Date(mskNow).toISOString().slice(0, 16);
}

export {getMoscowDateTimeISO};