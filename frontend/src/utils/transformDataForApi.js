const prepareDataForApi = (formData) => {
  const data = {};
  const mappings = {
    entryDate: "entry_date",
    entryTiming: "entry_timing",
    wellbeingScore: "wellbeing_score",
    trainingIntensity: "training_intensity",
    hasInjury: "has_injury",
    injuryLocation: "injury_location",
    bloodPressureSys: "blood_pressure_sys",
    bloodPressureDia: "blood_pressure_dia",
    foodScore: "food_score",
    temperature: "temperature",
    pulse: "pulse",
    height: "height",
    weight: "weight",
    sleepQuality: "sleep_quality",
    sleepHours: "sleep_hours",
    bloodSugar: "blood_sugar",
    medications: "medications",
    notes: "personal_notes",
    bmi: "bmi",
    eventId: "event_id",
		name: "full_name",
		birthDate: "birth_date",
		sex: "gender"
  };
  for (const [formKey, value] of formData.entries()) {
    const apiKey = mappings[formKey] || formKey;
    if (value !== "") {
      // Преобразование типов
      if (["hasInjury"].includes(formKey)) {
        data[apiKey] = value.toLowerCase() === "true";
      } else if (
        [
          "wellbeingScore",
          "trainingIntensity",
          "bloodPressureSys",
          "bloodPressureDia",
          "foodScore",
          "pulse",
          "sleepQuality",
          "eventId",
        ].includes(formKey)
      ) {
        data[apiKey] = parseInt(value);
      } else if (
        ["temperature", "height", "weight", "sleepHours", "bloodSugarField", "bmi"].includes(formKey)
      ) {
        data[apiKey] = parseFloat(value);
      } else if(
				["health_data_consent", "personal_data_consent"].includes(formKey) && value === "on"
			){
				data[apiKey] = true
			} else {
        data[apiKey] = value;
      }
    }
  }

  return data;
};

export default prepareDataForApi;