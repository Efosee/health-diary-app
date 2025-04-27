import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import useHttp from "../../../hooks/useHttp";
import Calendar from "./Calendar";
import RecordsList from "./RecordsList";
import EditRecordForm from "./EditRecordForm";

const History = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const { getAllPersonalTraining, getAllEventTraining } = useHttp();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const personalRecords = await getAllPersonalTraining(0, 1000);
        const eventRecords = await getAllEventTraining(0, 1000);
        const allRecords = [
          ...personalRecords.map((r) => ({ ...r, type: "personal" })),
          ...eventRecords.map((r) => ({ ...r, type: "event" })),
        ];
        const recordsFor8th = allRecords.filter(
          (record) => record.entry_date.split("T")[0] === "2025-04-08"
        );
        setRecords(allRecords);
      } catch (error) {
      }
    };
    fetchRecords();
  }, [getAllPersonalTraining, getAllEventTraining]);

  useEffect(() => {
  }, [selectedDate]);

  return (
    <Box sx={{ mt: "15px", p: { xs: "10px", sm: "30px" } }}>
      <Typography variant="h4" align="center" gutterBottom>
        История записей
      </Typography>
      {!selectedDate && !selectedRecord && (
        <Calendar records={records} setSelectedDate={setSelectedDate} />
      )}
      {selectedDate && !selectedRecord && (
        <RecordsList
          key={selectedDate}
          records={records}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setSelectedRecord={setSelectedRecord}
        />
      )}
      {selectedRecord && (
        <EditRecordForm
          record={selectedRecord}
          setSelectedRecord={setSelectedRecord}
        />
      )}
    </Box>
  );
};

export default History;