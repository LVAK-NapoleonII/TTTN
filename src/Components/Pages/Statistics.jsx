import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  useTheme,
  Paper,
  CircularProgress,
  Alert,
  Skeleton,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import { styled } from "@mui/material/styles";

const StatsCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "& .MuiCardHeader-root": {
    paddingBottom: 0,
  },
  "& .MuiCardContent-root": {
    paddingTop: theme.spacing(1),
  },
}));

const StatsValue = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.primary.main,
}));

const AppointmentStatistics = () => {
  const theme = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5038/api/LichKhamBenh/getAll",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (Array.isArray(response.data)) {
        const transformedData = response.data.map((appointment) => ({
          ...appointment,
          ngayKhamBenh: new Date(appointment.ngayKhamBenh),
          ngayTaoLich: new Date(appointment.ngayTaoLich),
          trangThai: mapStatus(appointment.trangThai),
        }));
        setAppointments(transformedData);
        setError(null);
      } else {
        throw new Error("Dữ liệu không đúng định dạng");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Không thể tải dữ liệu lịch khám. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (status) => {
    const statusMap = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      completed: "Đã hoàn thành",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const dailyStats = useMemo(() => {
    const currentDate = new Date();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    // Đếm theo ngày khám
    const countsByAppointmentDate = appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.ngayKhamBenh).getDate();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Đếm theo ngày tạo lịch
    const countsByCreationDate = appointments.reduce((acc, appointment) => {
      const date = new Date(appointment.ngayTaoLich).getDate();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Array.from({ length: daysInMonth }, (_, index) => ({
      date: index + 1,
      appointmentCount: countsByAppointmentDate[index + 1] || 0,
      creationCount: countsByCreationDate[index + 1] || 0,
    }));
  }, [appointments]);

  const statusStats = useMemo(() => {
    const statusCounts = appointments.reduce((acc, appointment) => {
      const status = appointment.trangThai || "Chưa xác định";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [appointments]);

  const stats = useMemo(
    () => ({
      total: appointments.length,
      average: appointments.length
        ? (appointments.length / dailyStats.length).toFixed(1)
        : 0,
      peak: dailyStats.reduce(
        (max, day) => Math.max(max, day.appointmentCount),
        0
      ),
      completed: appointments.filter((a) => a.trangThai === "Đã xác nhận")
        .length,
    }),
    [appointments, dailyStats]
  );

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1 }}>
          <Typography variant="subtitle2">Ngày {label}</Typography>
          {payload.map((item, index) => (
            <Typography key={index} variant="body2" color={item.color}>
              {item.name}: {item.value}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              title={<Typography variant="h6">Tổng số lịch khám</Typography>}
            />
            <CardContent>
              {loading ? (
                <Skeleton variant="text" width="50%" height={40} />
              ) : (
                <StatsValue variant="h4">{stats.total}</StatsValue>
              )}
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              title={<Typography variant="h6">Trung bình mỗi ngày</Typography>}
            />
            <CardContent>
              {loading ? (
                <Skeleton variant="text" width="50%" height={40} />
              ) : (
                <StatsValue variant="h4">{stats.average}</StatsValue>
              )}
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              title={<Typography variant="h6">Cao điểm trong ngày</Typography>}
            />
            <CardContent>
              {loading ? (
                <Skeleton variant="text" width="50%" height={40} />
              ) : (
                <StatsValue variant="h4">{stats.peak}</StatsValue>
              )}
            </CardContent>
          </StatsCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <StatsCard>
            <CardHeader
              title={<Typography variant="h6">Đã hoàn thành</Typography>}
            />
            <CardContent>
              {loading ? (
                <Skeleton variant="text" width="50%" height={40} />
              ) : (
                <StatsValue variant="h4">{stats.completed}</StatsValue>
              )}
            </CardContent>
          </StatsCard>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h6">Biểu đồ thống kê lịch khám</Typography>
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
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      label={{
                        value: "Ngày trong tháng",
                        position: "bottom",
                        offset: 0,
                      }}
                    />
                    <YAxis
                      label={{
                        value: "Số lượng",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="appointmentCount"
                      name="Số lịch khám"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="creationCount"
                      name="Số lịch tạo mới"
                      fill={theme.palette.secondary.main}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h6">Thống kê theo trạng thái</Typography>
              }
            />
            <CardContent>
              <Box sx={{ height: 400, width: "100%" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {statusStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentStatistics;
