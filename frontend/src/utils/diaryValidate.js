const diaryValidate = (data, diaryType) => {
  const errors = {};

  // Вспомогательные функции для проверки чисел
  const isValidNumber = (value, min, max) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  };

  const isValidInteger = (value, min, max) => {
    const num = parseInt(value);
    return !isNaN(num) && Number.isInteger(num) && num >= min && num <= max;
  };

  // 1. entryTiming
  const entryTiming = data.get("entryTiming")?.trim();
  if (!["after", "before", "rest"].includes(entryTiming)) {
    errors["entryTiming"] = "Необходимо выбрать 'after', 'before' или 'rest'";
  }

  // 2. wellbeingScore
  const wellbeingScore = data.get("wellbeingScore")?.trim();
  if (!wellbeingScore) {
    errors["wellbeingScore"] = "Оценка самочувствия обязательна";
  } else if (!isValidInteger(wellbeingScore, 1, 10)) {
    errors["wellbeingScore"] = "Оценка самочувствия должна быть целым числом от 1 до 10";
  }

  // 3. entryDate
  const entryDate = data.get("entryDate")?.trim();
  if (entryDate && isNaN(Date.parse(entryDate))) {
    errors["entryDate"] = "Дата должна быть в формате ISO (например, '2025-04-16T02:01')";
  }

  // 4. trainingIntensity
  const trainingIntensity = data.get("trainingIntensity")?.trim();
  if (entryTiming === "after") {
    if (!trainingIntensity) {
      errors["trainingIntensity"] = "Интенсивность тренировки обязательна для 'after'";
    } else if (!isValidInteger(trainingIntensity, 1, 10)) {
      errors["trainingIntensity"] = "Интенсивность должна быть целым числом от 1 до 10";
    }
  } else if (trainingIntensity && trainingIntensity !== "") {
    errors["trainingIntensity"] = "Интенсивность должна быть пустой для 'before' или 'rest'";
  }

  // 5. hasInjury
  const hasInjury = data.get("hasInjury")?.trim().toLowerCase();
  if (entryTiming === "after") {
    if (!["true", "false"].includes(hasInjury)) {
      errors["hasInjury"] = "Наличие травмы должно быть 'true' или 'false' для 'after'";
    }
  } else if (hasInjury && hasInjury !== "") {
    errors["hasInjury"] = "Наличие травмы должно быть пустым для 'before' или 'rest'";
  }

  // 6. injuryLocation
  const injuryLocation = data.get("injuryLocation")?.trim();
  if (entryTiming === "after" && hasInjury === "true") {
    if (!["leg", "arm", "torso", "head", "other"].includes(injuryLocation)) {
      errors["injuryLocation"] = "Место травмы должно быть: 'leg', 'arm', 'torso', 'head', 'other'";
    }
  } else if (injuryLocation && injuryLocation !== "") {
    errors["injuryLocation"] = "Место травмы должно быть пустым, если травмы нет или не 'after'";
  }

  // 7. bloodPressureSys
  const bloodPressureSys = data.get("bloodPressureSys")?.trim();
  if (bloodPressureSys && !isValidInteger(bloodPressureSys, 0, 300)) {
    errors["bloodPressureSys"] = "Систолическое давление должно быть целым числом от 0 до 300";
  }

  // 8. bloodPressureDia
  const bloodPressureDia = data.get("bloodPressureDia")?.trim();
  if (bloodPressureDia && !isValidInteger(bloodPressureDia, 0, 200)) {
    errors["bloodPressureDia"] = "Диастолическое давление должно быть целым числом от 0 до 200";
  }

  // 9. foodScore
  const foodScore = data.get("foodScore")?.trim();
  if (foodScore && !isValidInteger(foodScore, 0, 10)) {
    errors["foodScore"] = "Оценка питания должна быть целым числом от 0 до 10";
  }

  // 10. temperature
  const temperature = data.get("temperature")?.trim();
  if (temperature && !isValidNumber(temperature, 34, 42)) {
    errors["temperature"] = "Температура должна быть числом от 34 до 42";
  }

  // 11. pulse
  const pulse = data.get("pulse")?.trim();
  if (pulse && !isValidInteger(pulse, 30, 250)) {
    errors["pulse"] = "Пульс должен быть целым числом от 30 до 250";
  }

  // 12. height
  const height = data.get("height")?.trim();
  if (height && !isValidNumber(height, 0, 300)) {
    errors["height"] = "Рост должен быть положительным числом (до 300 см)";
  }

  // 13. weight
  const weight = data.get("weight")?.trim();
  if (weight && !isValidNumber(weight, 0, 500)) {
    errors["weight"] = "Вес должен быть положительным числом (до 500 кг)";
  }

  // 14. sleepQuality
  const sleepQuality = data.get("sleepQuality")?.trim();
  if (sleepQuality && !isValidInteger(sleepQuality, 1, 10)) {
    errors["sleepQuality"] = "Качество сна должно быть целым числом от 1 до 10";
  }

  // 15. sleepHours
  const sleepHours = data.get("sleepHours")?.trim();
  if (sleepHours && !isValidNumber(sleepHours, 0, 24)) {
    errors["sleepHours"] = "Часы сна должны быть числом от 0 до 24";
  }

  // 16. bloodSugarField
  const bloodSugar = data.get("bloodSugarField")?.trim();
  if (bloodSugar && !isValidNumber(bloodSugar, 0, 50)) {
    errors["bloodSugarField"] = "Уровень сахара в крови должен быть положительным числом (до 50)";
  }

  // 17. medications
  const medications = data.get("medications")?.trim();
  if (medications && medications.length > 1000) {
    errors["medications"] = "Список медикаментов не должен превышать 1000 символов";
  }

  // 18. notes
  const notes = data.get("notes")?.trim();
  if (notes && notes.length > 1000) {
    errors["notes"] = "Заметки не должны превышать 1000 символов";
  }

  // 19. bmi
  const bmi = data.get("bmi")?.trim();
  if (bmi && !isValidNumber(bmi, 0, 100)) {
    errors["bmi"] = "BMI должен быть положительным числом (до 100)";
  }

  // 20. eventId (только для дневника мероприятий)
  const eventId = data.get("eventId")?.trim();
  if (diaryType === "event") {
    if (!eventId) {
      errors["eventId"] = "Выбор мероприятия обязателен";
    } else if (!isValidInteger(eventId, 1, Infinity)) {
      errors["eventId"] = "ID мероприятия должно быть положительным целым числом";
    }
  } else if (eventId && eventId !== "") {
    errors["eventId"] = "ID мероприятия не должно указываться для личного дневника";
  }

  return errors;
};

export default diaryValidate;