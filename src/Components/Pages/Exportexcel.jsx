import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const AppointmentManagement = () => {
  // State management
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchDate, setSearchDate] = useState(null);
  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5038/api/LichKhamBenh/getAll",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch appointments");

      let data = await response.json();

      // Filter by date if searchDate is set
      if (searchDate) {
        const searchDateStr = dayjs(searchDate).format("YYYY-MM-DD");
        data = data.filter((appointment) => {
          const appointmentDate = dayjs(appointment.ngayTaoLich).format(
            "YYYY-MM-DD"
          );
          return appointmentDate === searchDateStr;
        });
      }
      setAppointments(data);
      setError("");
    } catch (err) {
      setError("Không có thông tin về cuộc hẹn ");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAppointments();
  }, []);
  // Export to Excel
  const handleExport = () => {
    const exportData = appointments.map((appointment, index) => ({
      ID: index + 1,
      "Tên bệnh nhân": appointment.hovaTenbenhnhan,
      "Ngày sinh": dayjs(appointment.ngaythangnamsinh).format("DD/MM/YYYY"),
      "Số điện thoại": appointment.sdtdangky,
      "Ngày khám bệnh": dayjs(appointment.ngayKhamBenh).format("DD/MM/YYYY"),
      "Giờ khám bệnh": appointment.gioKhamBenh,
      "Loại bệnh nhân": appointment.loaiBenhNhan,
      "Phòng khám": appointment.phong,
      "Bác sĩ khám": appointment.bacSi,
      "Trang thái": appointment.trangThai,
      "Yêu cầu đặc biệt": appointment.yeuCauDacBiet || "None",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Appointments");
    XLSX.writeFile(wb, `appointments_${dayjs().format("YYYY-MM-DD")}.xlsx`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          backgroundSize: "cover",
          height: "100%",
          p: "0 0 24px 0",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          borderRadius: "15px",
          backgroundImage: `url(src/assets/pexels-tomfisk-1770818.jpg)`,
        }}
      >
        {" "}
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            fontFamily: "rotobo",
            fontWeight: "bold",
            color: "#14AF55",
            bgcolor: "#ffffff",
            border: "1px solid #E9F7DD",
            borderRadius: "15px 15px 0  0",
            width: "100%",
          }}
        >
          Xuất file Excel
        </Typography>
        <Container maxWidth="xl">
          <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: "15px" }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
              <DatePicker
                label="Search by Date"
                value={searchDate}
                onChange={setSearchDate}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#00FFFF",
                  color: "#a4acb3",
                  "&:hover": { bgcolor: "white", color: "#00FFFF" },
                }}
                startIcon={<SearchIcon />}
                onClick={fetchAppointments}
              >
                Search
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#DDA0DD",
                  color: "#a4acb3",
                  "&:hover": { bgcolor: "white", color: "#DDA0DD" },
                }}
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setSearchDate(null);
                  fetchAppointments();
                }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#ADFF2F",
                  color: "#a4acb3",
                  "&:hover": { bgcolor: "white", color: "#ADFF2F" },
                }}
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
                disabled={appointments.length === 0}
              >
                Export Excel
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead
                    sx={{
                      bgcolor: "#ADFF2F",
                    }}
                  >
                    <TableRow>
                      <TableCell
                        sx={{
                          border: "2px solid  #E1EBEE",
                          textAlign: "center",
                          fontWeight: "bold",
                          p: "2px",
                        }}
                      >
                        ID
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid  #E1EBEE",
                          textAlign: "center",
                          fontWeight: "bold",
                          p: "2px",
                        }}
                      >
                        Tên bệnh nhân
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid  #E1EBEE",
                          textAlign: "center",
                          fontWeight: "bold",
                          p: "2px",
                        }}
                      >
                        Ngày sinh
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid  #E1EBEE",
                          textAlign: "center",
                          fontWeight: "bold",
                          p: "2px",
                        }}
                      >
                        Số điện thoại đăng ký
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid  #E1EBEE",
                          textAlign: "center",
                          fontWeight: "bold",
                          p: "2px",
                        }}
                      >
                        Ngày khám bệnh
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid  #E1EBEE",
                          textAlign: "center",
                          fontWeight: "bold",
                          p: "2px",
                        }}
                      >
                        Giờ khám bệnh
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid  #E1EBEE",
                          textAlign: "center",
                          fontWeight: "bold",
                          p: "2px",
                        }}
                      >
                        Loại bệnh nhân
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid  #E1EBEE",
                          textAlign: "center",
                          fontWeight: "bold",
                          p: "2px",
                        }}
                      >
                        Phòng khám
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid  #E1EBEE",
                          textAlign: "center",
                          fontWeight: "bold",
                          p: "2px",
                        }}
                      >
                        Bác sĩ khám
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid  #E1EBEE",
                          textAlign: "center",
                          fontWeight: "bold",
                          p: "2px",
                        }}
                      >
                        Trạng thái
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appointment, index) => (
                      <TableRow key={appointment.id}>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            p: "2px",
                          }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            p: "2px",
                          }}
                        >
                          {appointment.hovaTenbenhnhan}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            p: "2px",
                          }}
                        >
                          {dayjs(appointment.ngaythangnamsinh).format(
                            "DD/MM/YYYY"
                          )}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            p: "2px",
                          }}
                        >
                          {appointment.sdtdangky}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            p: "2px",
                          }}
                        >
                          {dayjs(appointment.ngayKhamBenh).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            p: "2px",
                          }}
                        >
                          {appointment.gioKhamBenh}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            p: "2px",
                          }}
                        >
                          {appointment.loaiBenhNhan}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            p: "2px",
                          }}
                        >
                          {appointment.phong}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            p: "2px",
                          }}
                        >
                          {appointment.bacSi}
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            p: "2px",
                          }}
                        >
                          {appointment.trangThai}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {appointments.length === 0 && !loading && (
              <Typography
                sx={{ textAlign: "center", my: 3, color: "text.secondary" }}
              >
                No appointments found
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentManagement;
