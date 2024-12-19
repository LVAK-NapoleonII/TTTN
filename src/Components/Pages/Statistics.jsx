import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AppointmentStats = ({ appointments = [] }) => {
  const dailyStats = useMemo(() => {
    if (!appointments || appointments.length === 0) {
      const currentDate = new Date();
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();

      return Array.from({ length: daysInMonth }, (_, index) => ({
        date: index + 1,
        appointments: 0,
      }));
    }

    const countsByDate = appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.NgayKhamBenh).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const currentDate = new Date();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dateStr = date.toLocaleDateString();

      return {
        date: day,
        appointments: countsByDate[dateStr] || 0,
      };
    });
  }, [appointments]);

  const totalAppointments = useMemo(() => {
    return dailyStats.reduce((sum, day) => sum + day.appointments, 0);
  }, [dailyStats]);

  const peakDay = useMemo(() => {
    return dailyStats.reduce(
      (max, day) => (day.appointments > max.appointments ? day : max),
      dailyStats[0]
    );
  }, [dailyStats]);

  const averageAppointments = useMemo(() => {
    return dailyStats.length > 0
      ? (totalAppointments / dailyStats.length).toFixed(1)
      : "0.0";
  }, [totalAppointments, dailyStats]);

  if (!appointments) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" align="center" color="text.secondary">
            Không có dữ liệu lịch khám
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ boxShadow: 2, p: 1 }}>
          <Typography variant="subtitle2">Ngày {label}</Typography>
          <Typography variant="body2" color="primary">
            Số lịch khám: {payload[0].value}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardHeader
              title={<Typography variant="h6">Tổng số lịch khám</Typography>}
            />
            <CardContent>
              <Typography variant="h4">{totalAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardHeader
              title={
                <Typography variant="h6">Ngày có nhiều lịch nhất</Typography>
              }
            />
            <CardContent>
              <Typography variant="h4">Ngày {peakDay.date}</Typography>
              <Typography variant="body2" color="text.secondary">
                {peakDay.appointments} lịch khám
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardHeader
              title={<Typography variant="h6">Trung bình mỗi ngày</Typography>}
            />
            <CardContent>
              <Typography variant="h4">{averageAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardHeader
          title={
            <Typography variant="h6">Biểu đồ lịch khám theo ngày</Typography>
          }
        />
        <CardContent>
          <Box sx={{ height: 400, width: "100%" }}>
            <ResponsiveContainer>
              <BarChart
                data={dailyStats}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  label={{
                    value: "Ngày trong tháng",
                    position: "bottom",
                  }}
                />
                <YAxis
                  label={{
                    value: "Số lượng lịch khám",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="appointments"
                  name="Số lượng lịch khám"
                  fill="#1976d2"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AppointmentStats;
