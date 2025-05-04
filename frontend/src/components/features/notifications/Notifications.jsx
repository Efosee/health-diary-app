import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useHttp from "../../../hooks/useHttp";

const Notifications = () => {
  const { getSportCurrentEvents, getSportUpcomingEvents, getSportPastEvents } = useHttp();
  const [currentEvents, setCurrentEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState("current"); // По умолчанию раскрыта секция текущих событий

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const [current, upcoming, past] = await Promise.all([
          getSportCurrentEvents(),
          getSportUpcomingEvents(),
          getSportPastEvents(),
        ]);
        setCurrentEvents(current);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (err) {
        setError("Не удалось загрузить события. Попробуйте позже.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [getSportCurrentEvents, getSportUpcomingEvents, getSportPastEvents]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const EventSection = ({ title, events, panel, color }) => (
    <Accordion
      expanded={expanded === panel}
      onChange={() => setExpanded(expanded === panel ? false : panel)}
      sx={{
        mb: 2,
        borderRadius: 2,
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          bgcolor: color,
          color: "white",
          borderRadius: 2,
          "& .MuiAccordionSummary-content": { alignItems: "center" },
          "&:hover": { bgcolor: `${color}CC` }, // Немного затемняем при наведении
          transition: "background-color 0.3s ease",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Typography sx={{ ml: 2, opacity: 0.8 }}>
          ({events.length} событи{events.length === 1 ? "е" : "й"})
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: "white", borderRadius: "0 0 8px 8px" }}>
        {events.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 2 }}>
            Событий нет
          </Typography>
        ) : (
          events.map((event) => (
            <Paper
              key={event.id}
              elevation={1}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                borderLeft: `4px solid ${color}`,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "translateY(-2px)" },
              }}
            >
              <Typography variant="h6" sx={{ color: color }}>
                {event.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Описание: {event.description || "Нет описания"}
              </Typography>
              <Typography variant="body2">
                Дата проведения: {formatDate(event.event_date)}
              </Typography>
              <Typography variant="body2">
                Крайний срок регистрации: {formatDate(event.registration_deadline)}
              </Typography>
              <Typography variant="body2">
                Место: {event.location || "Не указано"}
              </Typography>
              <Typography variant="body2">
                Организатор: {event.organizer || "Не указано"}
              </Typography>
            </Paper>
          ))
        )}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Box sx={{ mt: "15px", p: { xs: "10px", sm: "30px" }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: "#1a237e", fontWeight: "bold" }}>
        Уведомления о спортивных событиях
      </Typography>
      {loading && (
        <Typography align="center" sx={{ my: 4 }}>
          Загрузка событий...
        </Typography>
      )}
      {error && (
        <Typography align="center" color="error" sx={{ my: 4 }}>
          {error}
        </Typography>
      )}
      {!loading && !error && (
        <>
          <EventSection
            title="Текущие события (на этой неделе)"
            events={currentEvents}
            panel="current"
            color="#1976d2" // Синий для текущих
          />
          <EventSection
            title="Будущие события"
            events={upcomingEvents}
            panel="upcoming"
            color="#388e3c" // Зелёный для будущих
          />
          <EventSection
            title="Прошедшие события"
            events={pastEvents}
            panel="past"
            color="#d32f2f" // Красный для прошедших
          />
        </>
      )}
    </Box>
  );
};

export default Notifications;