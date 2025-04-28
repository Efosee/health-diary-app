import { useState } from "react";
import { Box, TextField, MenuItem, Button } from "@mui/material";

const metricOptions = [
  { value: "wellbeing_score", label: "Самочувствие" },
  { value: "blood_pressure_sys", label: "Систолическое давление" },
  { value: "blood_pressure_dia", label: "Диастолическое давление" },
  { value: "pulse", label: "Пульс" },
  { value: "temperature", label: "Температура" },
  { value: "weight", label: "Вес" },
  { value: "height", label: "Рост" },
  { value: "bmi", label: "ИМТ" },
  { value: "sleep_quality", label: "Качество сна" },
  { value: "sleep_hours", label: "Часы сна" },
  { value: "blood_sugar", label: "Уровень сахара в крови" },
];

const entryTypeOptions = [
  { value: "all", label: "Все" },
  { value: "personal", label: "Личные" },
  { value: "event", label: "События" },
];

const entryTimingOptions = [
  { value: "all", label: "Все" },
  { value: "before", label: "До тренировки" },
  { value: "after", label: "После тренировки" },
  { value: "rest", label: "День отдыха" },
];

const chartTypeOptions = [
  { value: "line", label: "Линейный" },
  { value: "bar", label: "Столбчатый" },
];

const AnalyticsFilters = ({ filters, setFilters, isAdmin }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    setLocalFilters({ ...localFilters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    setFilters(localFilters);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        mb: "20px",
        justifyContent: "center",
      }}
    >
      <TextField
        select
        label="Метрика"
        name="metric"
        value={localFilters.metric}
        onChange={handleChange}
        sx={{ minWidth: "200px" }}
      >
        {[
          ...metricOptions,
          ...(isAdmin ? [{ value: "injuries_count", label: "Количество травм" }] : []),
        ].map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Тип записи"
        name="entryType"
        value={localFilters.entryType}
        onChange={handleChange}
        sx={{ minWidth: "200px" }}
      >
        {entryTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      {!isAdmin && (
        <TextField
          select
          label="Период"
          name="entryTiming"
          value={localFilters.entryTiming}
          onChange={handleChange}
          sx={{ minWidth: "200px" }}
        >
          {entryTimingOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
      <TextField
        select
        label="Тип графика"
        name="chartType"
        value={localFilters.chartType}
        onChange={handleChange}
        sx={{ minWidth: "200px" }}
      >
        {chartTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Дата начала"
        type="date"
        name="startDate"
        value={localFilters.startDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: "200px" }}
      />
      <TextField
        label="Дата окончания"
        type="date"
        name="endDate"
        value={localFilters.endDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        sx={{ minWidth: "200px" }}
      />
      <Button variant="contained" onClick={handleApply} sx={{ height: "56px" }}>
        Применить
      </Button>
    </Box>
  );
};

export default AnalyticsFilters;