import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { MessageSquare } from "lucide-react";

// SMS Service
const API_BASE_URL = "http://localhost:5038/api";

const smsService = {
  async sendSMS(appointmentIds, customMessage) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/Sms/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lichKhamIds: appointmentIds,
          customMessage: customMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi gửi SMS");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Lỗi kết nối server");
    }
  },
  async getAppointments(searchDate) {
    try {
      const token = localStorage.getItem("token");
      const formattedDate = searchDate
        ? new Date(searchDate).toISOString().split("T")[0]
        : "";
      const response = await fetch(
        `${API_BASE_URL}/Sms/appointments?searchDate=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu lịch khám");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Lỗi kết nối server");
    }
  },
  async getSMSHistory(appointmentId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/Sms/history/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi lấy lịch sử SMS");
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || "Lỗi kết nối server");
    }
  },
};

const NotificationPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [customMessage, setCustomMessage] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [messageType, setMessageType] = useState("default");

  useEffect(() => {
    if (searchDate) {
      fetchAppointments();
    }
  }, [searchDate]);

  const getDefaultMessagePreview = (appointment) => {
    if (!appointment) return "";
    return `Xin chào ${appointment.hovaTenbenhnhan}, 
Nhắc nhở: Quý khách có lịch khám vào lúc ${appointment.gioKhamBenh} 
ngày ${new Date(appointment.ngayKhamBenh).toLocaleDateString()} 
tại phòng ${appointment.phong} 
với bác sĩ ${appointment.bacSi}. 
Xin vui lòng đến trước 15 phút giờ đặt. Xin cảm ơn!`;
  };

  const fetchAppointments = async () => {
    setLoading(true);
    setAppointments([]);
    const token = localStorage.getItem("token");

    try {
      console.log("Fetching appointments with date:", searchDate);

      const formattedDate = searchDate
        ? new Date(searchDate).toISOString().split("T")[0]
        : "";

      const response = await fetch(
        `${API_BASE_URL}/Sms/appointments?searchDate=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);

      // Kiểm tra response text trước
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        throw new Error(responseText || "Không thể tải dữ liệu lịch khám");
      }

      // Parse JSON chỉ khi có data
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : [];
      } catch (error) {
        console.error("JSON parse error:", error);
        throw new Error("Dữ liệu không hợp lệ từ server");
      }

      if (Array.isArray(data)) {
        if (data.length === 0) {
          showNotification("Không có lịch khám nào trong ngày này", "info");
        }
        setAppointments(data);
      } else {
        setAppointments([]);
        showNotification("Dữ liệu không đúng định dạng", "error");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
      showNotification(
        error.message || "Lỗi khi tải danh sách lịch khám",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedAppointments(appointments.map((app) => app.id));
    } else {
      setSelectedAppointments([]);
    }
  };

  const handleSelectAppointment = (appointmentId) => {
    setSelectedAppointments((prev) => {
      if (prev.includes(appointmentId)) {
        return prev.filter((id) => id !== appointmentId);
      } else {
        return [...prev, appointmentId];
      }
    });
  };

  const handleDateChange = (event) => {
    setSearchDate(event.target.value);
    setSelectedAppointments([]);
  };

  const handleSendNotifications = async () => {
    if (selectedAppointments.length === 0) {
      showNotification("Vui lòng chọn ít nhất một lịch khám", "warning");
      return;
    }

    setLoading(true);
    try {
      const messageToSend = messageType === "custom" ? customMessage : "";
      await smsService.sendSMS(selectedAppointments, messageToSend);
      showNotification("Đã gửi thông báo SMS thành công", "success");
      await fetchAppointments(); // Refresh the list to update status
      setSelectedAppointments([]);
      setCustomMessage("");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        borderRadius: "15px",
        backgroundImage: `url(src/assets/pexels-tomfisk-1770818.jpg)`,
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        sx={{
          fontFamily: "rotobo",
          fontWeight: "bold",
          color: "#14AF55",
          bgcolor: "#ffffff",
          border: "1px solid #E9F7DD",
          borderRadius: "15px",
          marginBottom: 4,
          width: "100%",
          boxShadow: 1,
        }}
      >
        Quản lý thông báo lịch khám
      </Typography>

      <Grid container spacing={1}>
        {/* Form input section */}
        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            border: "2px solid #E9F7DD",
            padding: 1,
            margin: 5,
            borderRadius: "15px",
            boxShadow: 1,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(3px)",
          }}
        >
          <Box
            sx={{
              padding: 2,
              border: "1px solid #90caf9",
              borderRadius: "15px",
              bgcolor: "rgba(255, 255, 255)",
              height: "438px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <TextField
              fullWidth
              label="Tìm kiếm theo ngày tạo lịch"
              type="date"
              value={searchDate}
              onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={messageType === "custom"}
                  onChange={(e) =>
                    setMessageType(e.target.checked ? "custom" : "default")
                  }
                />
              }
              label="Sử dụng tin nhắn tùy chỉnh"
            />{" "}
            {messageType === "custom" ? (
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Tin nhắn tùy chỉnh"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Nhập nội dung tin nhắn tùy chỉnh"
                margin="normal"
              />
            ) : (
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Tin nhắn mặc định (xem trước)"
                value={
                  selectedAppointments.length === 1
                    ? getDefaultMessagePreview(
                        appointments.find(
                          (a) => a.id === selectedAppointments[0]
                        )
                      )
                    : "Chọn một lịch khám để xem tin nhắn mặc định"
                }
                disabled
                margin="normal"
              />
            )}
            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <Button
                variant="outlined"
                startIcon={<MessageSquare />}
                onClick={handleSendNotifications}
                disabled={loading || appointments.length === 0}
                sx={{
                  borderWidth: "2px",
                  backgroundColor: "blue",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "blue",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Gửi qua SMS"}
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Table section */}
        <Grid
          item
          xs={12}
          sm={7.5}
          sx={{
            border: "2px solid #E9F7DD",
            borderRadius: "15px",
            padding: 2,
            margin: 5,
            boxShadow: 1,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(3px)",
            height: "500px",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{ height: "470px", overflowY: "auto" }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#ADFF2F" }}>
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    sx={{
                      border: "2px solid #E1EBEE",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            selectedAppointments.length === appointments.length
                          }
                          onChange={handleSelectAll}
                          disabled={appointments.length === 0}
                        />
                      }
                      label="Chọn tất cả"
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "2px solid #E1EBEE",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Tên bệnh nhân
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "2px solid #E1EBEE",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Số điện thoại
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "2px solid #E1EBEE",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Ngày khám
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "2px solid #E1EBEE",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Giờ khám
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "2px solid #E1EBEE",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Phòng khám
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "2px solid #E1EBEE",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Bác sĩ
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "2px solid #E1EBEE",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    Trạng thái
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Không có lịch khám nào trong ngày này
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map(
                    (appointment) => (
                      console.log(appointment),
                      (
                        <TableRow key={appointment.id}>
                          <TableCell
                            padding="checkbox"
                            sx={{
                              border: "2px solid #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            <Checkbox
                              checked={selectedAppointments.includes(
                                appointment.id
                              )}
                              onChange={() =>
                                handleSelectAppointment(appointment.id)
                              }
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.hovaTenbenhnhan}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.sdtdangky}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {new Date(
                              appointment.ngayKhamBenh
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.gioKhamBenh}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.phong}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.bacSi}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            <span
                              style={{
                                color: appointment.smsNotified
                                  ? "#14AF55"
                                  : "#666",
                              }}
                            >
                              {appointment.smsNotified ? "Đã gửi" : "Chưa gửi"}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotificationPage;
