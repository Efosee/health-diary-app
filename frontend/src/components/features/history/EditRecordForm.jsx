import { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useHttp from "../../../hooks/useHttp";
import diaryValidate from "../../../utils/diaryValidate";
import prepareDataForApi from "../../../utils/transformDataForApi";

// Reused field components
import EntryDateTimingField from "../Field/EntryDateTimingField";
import WellbeingScoreField from "../Field/WellbeingScoreField";
import TrainingIntensityField from "../Field/TrainingIntensityField";
import HasInjuryField from "../Field/HasInjuryField";
import InjuryLocation from "../Field/InjuryLocation";
import PressureField from "../Field/PressureField";
import FoodScoreField from "../Field/FoodScoreField";
import TemperatureField from "../Field/TemperatureField";
import PulseField from "../Field/PulseField";
import HeightField from "../Field/HeightField";
import WeightField from "../Field/WeightField";
import SleepField from "../Field/SleepField";
import BloodSugarField from "../Field/BloodSugarField";
import MedicationsField from "../Field/MedicationsField";
import NotesField from "../Field/NotesField";
import BMIField from "../Field/BMIField";
import EventIdField from "../Field/EventIdField";

const EditRecordForm = ({ record, setSelectedRecord }) => {
  const [entryTiming, setEntryTiming] = useState(record.entry_timing);
  const [hasInjury, setHasInjury] = useState(record.has_injury);
  const [weight, setWeight] = useState(record.weight);
  const [height, setHeight] = useState(record.height);
  const { putPersonalTraining, putEventTraining } = useHttp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const errors = diaryValidate(formData, record.type);

    if (Object.keys(errors).length) {
      console.log("Validation errors:", errors);
      alert("Пожалуйста, исправьте ошибки в форме");
    } else {
      try {
        if (record.type === "personal") {
          await putPersonalTraining(record.id, formData);
        } else {
          await putEventTraining(record.id, formData);
        }
        alert("Запись успешно обновлена");
        setSelectedRecord(null);
      } catch (error) {
        console.error("Failed to update record:", error);
        alert("Ошибка при обновлении записи");
      }
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", mt: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => setSelectedRecord(null)}
        sx={{ mb: 2 }}
      >
        Назад к списку
      </Button>
      <Typography variant="h5" gutterBottom>
        Редактирование записи
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: "10px", sm: "30px", md: "45px" },
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <EntryDateTimingField
            setEntryTiming={setEntryTiming}
						entryTiming={entryTiming}
						entryDate={record.entry_date.slice(0, 16)}
          />
          {record.type === "event" && (
            <EventIdField defaultValue={record.event_id} />
          )}
          <WellbeingScoreField defaultValue={record.wellbeing_score} />
          <TrainingIntensityField
            entryTiming={entryTiming}
            defaultValue={record.training_intensity}
            variant="outlined"
          />
          <HasInjuryField
            entryTiming={entryTiming}
            setHasInjury={setHasInjury}
            defaultValue={record?.has_injury?.toString()}
          />
          <InjuryLocation
            entryTiming={entryTiming}
            hasInjury={hasInjury}
            defaultValue={record.injury_location}
          />
          <Box sx={{ mt: "15px", textAlign: "center" }}>
            Опциональные поля:
          </Box>
          <PressureField
            bloodPressureSys={record.blood_pressure_sys}
            bloodPressureDia={record.blood_pressure_dia}
          />
          <FoodScoreField defaultValue={record.food_score} />
          <TemperatureField defaultValue={record.temperature} />
          <PulseField defaultValue={record.pulse} />
          <HeightField
            setHeight={setHeight}
            height={record.height}
          />
          <WeightField
            setWeight={setWeight}
            weight={record.weight}
          />
          <SleepField
            defaultValueQuality={record.sleep_quality}
            defaultValueHours={record.sleep_hours}
            variant="outlined"
          />
          <BloodSugarField defaultValue={record.blood_sugar} />
          <MedicationsField defaultValue={record.medications} />
          <NotesField defaultValue={record.personal_notes} />
          <BMIField height={height} weight={weight} defaultValue={record.bmi} />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, height: "45px" }}
          >
            Сохранить изменения
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default EditRecordForm;