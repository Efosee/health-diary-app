import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styles from "./calendar.module.scss";

const Calendar = ({ records, setSelectedDate }) => {
  const today = new Date();
const [currentMonth, setCurrentMonth] = useState(
  new Date(today.getFullYear(), today.getMonth(), 1)
);

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Пн = 0, Вт = 1, ..., Вс = 6
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const weeks = [];
    let week = Array(firstDay).fill(null);

    for (let day = 1; day <= days; day++) {
      const dateStr = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day + 1
      )
        .toISOString()
        .split("T")[0];
      const hasRecords = records.some((record) => {
        const recordDate = record.entry_date.split("T")[0];
        const matches = recordDate === dateStr;
        return matches;
      });


      week.push({ day, hasRecords, dateStr });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
    }

    return weeks.map((week, i) => (
      <div key={i} className={styles.week}>
        {week.map((dayObj, j) => (
          <div
            key={j}
            className={`${styles.day} ${
              dayObj && dayObj.hasRecords === true ? styles.hasRecords : ""
            } ${dayObj ? styles.clickable : ""}`}
            onClick={() =>
              dayObj && setSelectedDate(dayObj.dateStr)
            }
          >
            {dayObj ? dayObj.day : ""}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Button onClick={prevMonth}>
          <ArrowBackIosIcon />
        </Button>
        <Typography variant="h6">
          {currentMonth.toLocaleString("ru-RU", {
            month: "long",
            year: "numeric",
          })}
        </Typography>
        <Button onClick={nextMonth}>
          <ArrowForwardIosIcon />
        </Button>
      </Box>
      <div className={styles.calendar}>
        <div className={styles.week}>
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
            <div key={day} className={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>
        {renderCalendar()}
      </div>
    </Box>
  );
};

export default Calendar;