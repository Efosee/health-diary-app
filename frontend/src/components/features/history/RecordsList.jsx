import { Box, Button, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const RecordsList = ({
  records,
  setSelectedDate,
  selectedDate,
  setSelectedRecord,
}) => {

  const filteredRecords = records.filter((record) => {
    const recordDate = record.entry_date.split("T")[0];
    const matches = recordDate === selectedDate;
    return matches;
  });

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", mt: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button onClick={() => setSelectedDate(null)}>
          <ArrowBackIosIcon />
        </Button>
        <Typography variant="h6">
          Записи за{" "}
          {new Date(selectedDate).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </Typography>
      </Box>
      {filteredRecords.length === 0 ? (
        <Typography>Нет записей за этот день</Typography>
      ) : (
        filteredRecords.map((record, index) => (
          <Box
            key={`${record.id}-${index}`}
            sx={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              p: 2,
              mb: 2,
              cursor: "pointer",
            }}
            onClick={() => setSelectedRecord(record)}
          >
            <Typography variant="subtitle1">
              {record.type === "personal" ? "Личная тренировка" : "Мероприятие"}
            </Typography>
            <Typography>
              Время:{" "}
              {new Date(record.entry_date).toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </Typography>
            <Typography>Самочувствие: {record.wellbeing_score}/10</Typography>
            {record.type === "event" && (
              <Typography>Мероприятие ID: {record.event_id}</Typography>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default RecordsList;