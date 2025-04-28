import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import AnalyticsFilters from "../components/features/analytics/AnalyticsFilter";
import AnalyticsChart from "../components/features/analytics/AnalyticChart";
import useHttp from "../hooks/useHttp";

const AnalyticsPage = () => {
  const { getMetrics, getAdminAggregatedMetrics, getAdminInjuriesByDay, getUser } = useHttp();
  const today = new Date().toISOString().split("T")[0];
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const twoWeeksAgoStr = twoWeeksAgo.toISOString().split("T")[0];

  const [metricsData, setMetricsData] = useState([]);
  const [filters, setFilters] = useState({
    metric: "wellbeing_score",
    entryType: "all",
    entryTiming: "all",
    startDate: twoWeeksAgoStr,
    endDate: today,
    chartType: "line",
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setIsAdmin(userData.is_admin || false);
      } catch (error) {
        console.error("Ошибка при загрузке данных пользователя:", error);
      }
    };
    fetchUser();
  }, [getUser]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        let data;
        if (isAdmin) {
          if (filters.metric === "injuries_count") {
            data = await getAdminInjuriesByDay(
              filters.startDate,
              filters.endDate,
              filters.entryType
            );
            const formattedData = Object.entries(data)
              .map(([date, count]) => ({
                date,
                value: count,
              }))
              .sort((a, b) => new Date(a.date) - new Date(b.date));
            setMetricsData(formattedData);
          } else {
            data = await getAdminAggregatedMetrics(
              filters.startDate,
              filters.endDate,
              [filters.metric],
              filters.entryType
            );
            const formattedData = Object.entries(data)
              .map(([date, metrics]) => ({
                date,
                value: metrics[filters.metric],
              }))
              .sort((a, b) => new Date(a.date) - new Date(b.date));
            setMetricsData(formattedData);
          }
        } else {
          data = await getMetrics(
            filters.startDate,
            filters.endDate,
            [filters.metric],
            filters.entryType
          );
          const formattedData = [
            ...(data.personal || []).map((entry) => ({
              date: entry.date.split("T")[0],
              value: entry.metrics[filters.metric],
              timing: entry.entry_timing,
            })),
            ...(data.event || []).map((entry) => ({
              date: entry.date.split("T")[0],
              value: entry.metrics[filters.metric],
              timing: entry.entry_timing,
            })),
          ]
            .filter(
              (entry) =>
                filters.entryTiming === "all" || entry.timing === filters.entryTiming
            )
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          setMetricsData(formattedData);
        }
      } catch (error) {
        console.error("Ошибка при загрузке метрик:", error);
      }
    };
    fetchMetrics();
  }, [filters, getMetrics, getAdminAggregatedMetrics, getAdminInjuriesByDay, isAdmin]);

  return (
    <Box sx={{ mt: "15px", p: { xs: "10px", sm: "30px" } }}>
      <Typography variant="h4" align="center" gutterBottom>
        Аналитика
      </Typography>
      <AnalyticsFilters filters={filters} setFilters={setFilters} isAdmin={isAdmin} />
      <AnalyticsChart
        data={metricsData}
        metric={filters.metric}
        chartType={filters.chartType}
      />
    </Box>
  );
};

export default AnalyticsPage;