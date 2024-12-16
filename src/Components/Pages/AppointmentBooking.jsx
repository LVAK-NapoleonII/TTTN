import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Grid,
  Autocomplete,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateField } from "@mui/x-date-pickers/DateField";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import enGB from "date-fns/locale/en-GB";
import axios from "axios";

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    id: 0,
    tenbenhnhan: "",
    ngaythangnamsinh: new Date(),
    sdtdangky: "",
    sdtgoiden: "",
    yeuCauDacBiet: "",
    ngayKhamBenh: new Date(),
    gioKhamBenh: new Date(),
    loaiBenhNhan: "",
    trangThai: "",
    ngayTaoLich: "",
    lichLamViecBacSi: {
      id: 0,
      tenphong: "",
      tenBacsi: "",
      calam: "",
      ngayLam: new Date(),
    },
  });

  const [dateError, setDateError] = useState("");
  const [dobError, setDobError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [shift, setShift] = useState("");
  const [appointmentList, setAppointmentList] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [errors, setErrors] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [patientType, setPatientType] = useState("");

  useEffect(() => {
    fetchDoctorSchedules();
    fetchAppointments();
  }, []);

  const fetchDoctorSchedules = async (
    currentShift = shift,
    currentRoom = selectedRoom,
    currentDoctor = selectedDoctor
  ) => {
    try {
      const response = await axios.get(
        "http://localhost:5038/api/Lichlamviecbacsi/getFilteredSchedules",
        {
          params: {
            roomName: currentRoom,
            doctorName: currentDoctor,
            shiftName: currentShift,
          },
        }
      );
      if (response.data.status === "success") {
        const data = response.data.data;
        const rooms = [...new Set(data.map((item) => item.tenphong))];
        const shifts = [...new Set(data.map((item) => item.calam))];
        const doctors = [...new Set(data.map((item) => item.tenBacsi))];
        console.log("Processed Data:", { rooms, shifts, doctors });
        setRooms(rooms);
        setShifts(shifts);
        setDoctors(doctors);
      }
    } catch (error) {
      console.error("Error fetching doctor schedules:", error);
      setErrors(error.message || "An error occurred");
    }
  };
  const token = localStorage.getItem("token");
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5038/api/LichKhamBenh/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointmentList(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  const handleDateChange = (newValue) => {
    const today = new Date();
    const selectedDay = new Date(newValue).setHours(0, 0, 0, 0);
    const todayMidnight = today.setHours(0, 0, 0, 0);
    if (selectedDay < todayMidnight) {
      setDateError("Ngày khám bệnh không được nhỏ hơn thời điểm hiện tại");
    } else {
      setDateError("");
      setSelectedDate(newValue);
      setFormData((prev) => ({
        ...prev,
        ngayKhamBenh: newValue,
      }));
      setTimeError("");
    }
  };
  const handleDobChange = (newValue) => {
    const today = new Date();
    if (newValue > today) {
      setDobError("Ngày sinh không được lớn hơn thời điểm hiện tại");
    } else {
      setDobError("");
      setFormData((prev) => ({
        ...prev,
        ngaythangnamsinh: newValue,
      }));
    }
  };
  const handlePhoneNumberChange = (e, fieldName) => {
    const value = e.target.value;
    const phoneRegex = /^[0-9]*$/; // Chỉ cho phép số

    let phoneError = "";
    if (!phoneRegex.test(value)) {
      phoneError = "Số điện thoại chỉ được chứa ký tự số";
    } else if (value.length > 12) {
      phoneError = "Số điện thoại không được quá 12 ký tự";
    }

    // Cập nhật state cho formData
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Cập nhật state cho errors
    setErrors((prev) => ({
      ...prev,
      [`${fieldName}Error`]: phoneError,
    }));
  };

  const handleTimeChange = (newValue) => {
    const today = new Date();
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(newValue.getHours(), newValue.getMinutes(), 0, 0);
    const currentTime = new Date();
    currentTime.setSeconds(0, 0);

    if (
      selectedDate.toDateString() === today.toDateString() &&
      selectedDay.getTime() < currentTime.getTime()
    ) {
      setTimeError("Giờ khám không được nhỏ hơn giờ hiện tại");
    } else {
      setTimeError("");
      setSelectedTime(newValue);
      setFormData((prev) => ({
        ...prev,
        gioKhamBenh: newValue,
      }));

      const hours = newValue.getHours();
      const minutes = newValue.getMinutes();
      if ((hours === 5 && minutes >= 30) || (hours >= 6 && hours < 7)) {
        setShift("Ca 0");
      } else if (hours >= 7 && hours < 11) {
        setShift("Ca 1");
      } else if (hours >= 11 && hours < 13) {
        setShift("Ca 2");
      } else if (hours >= 13 && hours < 16) {
        setShift("Ca 3");
      } else if (
        (hours >= 16 && hours < 19) ||
        (hours === 19 && minutes <= 30)
      ) {
        setShift("Ca 4");
      } else {
        setShift("");
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomChange = (newValue) => {
    setSelectedRoom(newValue);
    fetchDoctorSchedules(shift, newValue, selectedDoctor);
  };

  const handleDoctorChange = (newValue) => {
    setSelectedDoctor(newValue);
    fetchDoctorSchedules(shift, selectedRoom, newValue);
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenbenhnhan)
      newErrors.tenbenhnhan = "Tên bệnh nhân không được trống";

    if (!formData.sdtdangky)
      newErrors.sdtdangky = "Số điện thoại không được trống";

    if (!selectedRoom) newErrors.room = "Vui lòng chọn phòng khám";

    if (!selectedDoctor) newErrors.doctor = "Vui lòng chọn bác sĩ";

    if (!shift) newErrors.shift = "Vui lòng chọn ca làm";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit appointment
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const matchingScheduleResponse = await axios.get(
        "http://localhost:5038/api/Lichlamviecbacsi/getFilteredSchedules",
        {
          params: {
            roomName: selectedRoom,
            doctorName: selectedDoctor,
            shiftName: shift,
            ngayLam: formData.ngayKhamBenh.toISOString().split("T")[0],
          },
        }
      );

      if (
        !matchingScheduleResponse.data.data ||
        matchingScheduleResponse.data.data.length === 0
      ) {
        showSnackbar("Không tìm thấy lịch làm việc phù hợp", "error");
        return;
      }

      const matchingSchedule = matchingScheduleResponse.data.data[0];

      // Ensure consistent data formatting
      const submitData = {
        id: matchingSchedule.id,
        tenbenhnhan: formData.tenbenhnhan,
        ngaythangnamsinh:
          formData.ngaythangnamsinh instanceof Date
            ? formData.ngaythangnamsinh.toISOString().split("T")[0]
            : formData.ngaythangnamsinh,
        sdtdangky: formData.sdtdangky,
        sdtgoiden: formData.sdtgoiden,
        yeuCauDacBiet: formData.yeuCauDacBiet,
        ngayKhamBenh:
          formData.ngayKhamBenh instanceof Date
            ? formData.ngayKhamBenh.toISOString().split("T")[0]
            : formData.ngayKhamBenh,
        gioKhamBenh:
          formData.gioKhamBenh instanceof Date
            ? formData.gioKhamBenh.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : formData.gioKhamBenh,
        loaiBenhNhan: formData.loaiBenhNhan || "Loại 1",
        trangThai: "Chưa xác nhận",
        lichLamViecBacSi: {
          id: matchingSchedule.id,
          tenphong: matchingSchedule.tenphong,
          tenBacsi: matchingSchedule.tenBacsi,
          calam: matchingSchedule.calam,
          ngayLam: matchingSchedule.ngayLam,
        },
      };

      const response = await axios.post(
        "http://localhost:5038/api/LichKhamBenh/createBooking",
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      fetchAppointments();
      resetForm();
      showSnackbar("Đặt lịch khám thành công", "success");
    } catch (error) {
      console.error("Full error details:", error.response?.data || error);
      const errorMessage = error.response?.data?.Errors
        ? error.response.data.Errors.map((e) => e.ErrorMessage).join(", ")
        : error.response?.data?.Message || "Có lỗi xảy ra khi tạo lịch khám";

      showSnackbar(errorMessage, "error");
    }
  };
  // Delete appointment
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5038/api/LichKhamBenh/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSnackbar("Xóa lịch khám thành công", "success");
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      showSnackbar("Xóa lịch khám thất bại", "error");
    }
  };

  // Helper function to show snackbar notifications
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Reset form after submission
  const resetForm = () => {
    setFormData({
      id: 0,
      tenbenhnhan: "",
      ngaythangnamsinh: new Date(),
      sdtdangky: "",
      sdtgoiden: "",
      yeuCauDacBiet: "",
      ngayKhamBenh: new Date(),
      gioKhamBenh: new Date(),
      loaiBenhNhan: "",
      trangThai: "",
      ngayTaoLich: new Date(),
      lichLamViecBacSi: {
        id: 0,
        tenphong: "",
        tenBacsi: "",
        calam: "",
        ngayLam: new Date(),
      },
    });
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setShift("");
    setSelectedRoom("");
    setSelectedDoctor("");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
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
          }}
        >
          Đặt lịch khám sức khỏe
        </Typography>
        <Grid container>
          {/* Thông tin cơ bản */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              border: "2px solid #E9F7DD",
              borderRadius: 2,
              padding: 2,
              marginTop: 1,
              width: "max-width",
              boxShadow: 1,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(3px)",
            }}
          >
            <Grid
              container
              spacing={1}
              sx={{
                border: "2px solid #E9F7DD",
                borderRadius: 2,
                color: "#14AF55",
                bgcolor: "#ffffff",
                width: "max-width",
                boxShadow: 1,
              }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    marginLeft: "250px",
                    color: "#14AF55",
                    fontWeight: "bold",
                    fontSize: "25px",
                  }}
                >
                  Thông tin cơ bản
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={rooms}
                    getOptionLabel={(option) => option ?? ""}
                    value={selectedRoom}
                    onChange={(event, newValue) => handleRoomChange(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Chọn phòng" />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={shifts}
                    getOptionLabel={(option) => option ?? ""}
                    value={shift}
                    onChange={(event, newValue) => setShift(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Chọn ca làm" />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <DateField
                  fullWidth
                  label="Ngày khám bệnh"
                  InputLabelProps={{ shrink: true }}
                  defaultValue={new Date()}
                  onChange={handleDateChange}
                  helperText={dateError}
                  error={!!dateError}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={doctors}
                    getOptionLabel={(option) => option ?? ""}
                    value={selectedDoctor}
                    onChange={(event, newValue) => handleDoctorChange(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Chọn bác sĩ" />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
            {/* Thông tin bệnh nhân */}
            <Grid
              container
              spacing={1}
              sx={{
                mt: "5px",
                border: "2px solid #E9F7DD",
                borderRadius: 2,
                padding: 2,
                width: "max-width",
                boxShadow: 1,
                color: "#14AF55",
                bgcolor: "#ffffff",
              }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{
                    pl: "240px",
                    color: "#14AF55",
                    fontWeight: "bold",
                    fontSize: "25px",
                  }}
                >
                  Thông tin bệnh nhân
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="tenbenhnhan"
                  label="Tên bệnh nhân"
                  value={formData.tenbenhnhan}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TimeField
                  label="Giờ khám bệnh"
                  value={formData.gioKhamBenh}
                  onChange={handleTimeChange}
                  fullWidth
                  required
                  error={!!timeError} // Sử dụng !! để chuyển đổi sang boolean
                  helperText={timeError}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="sdtdangky"
                  label="Số điện thoại đăng ký"
                  value={formData.sdtdangky}
                  onChange={(e) => handlePhoneNumberChange(e, "sdtdangky")}
                  fullWidth
                  required
                  error={!!errors.sdtdangkyError}
                  helperText={errors.sdtdangkyError}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="sdtgoiden"
                  label="Số điện thoại Gọi đến"
                  value={formData.sdtgoiden}
                  onChange={(e) => handlePhoneNumberChange(e, "sdtgoiden")}
                  fullWidth
                  required
                  error={!!errors.sdtgoiError}
                  helperText={errors.sdtgoiError}
                />
              </Grid>
              <Grid item xs={6}>
                <DateField
                  label="Ngày sinh"
                  value={formData.ngaythangnamsinh}
                  onChange={(handleDobChange, handleInputChange)}
                  fullWidth
                  required
                  error={!!dobError} // Sử dụng !! để chuyển đổi sang boolean
                  helperText={dobError}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="yeucaudatbiet"
                  label="Yêu cầu đặc biệt"
                  fullWidth
                  required
                  value={formData.yeuCauDacBiet.Text}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  value={formData.loaiBenhNhan}
                  onChange={handleInputChange}
                  options={["Bệnh nhân mới", "Bệnh nhân tái khám"]}
                  renderInput={(params) => (
                    <TextField {...params} label="Loại bệnh nhân" />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Bộ lọc</InputLabel>
                  <Select
                    label="Bộ lọc"
                    value={patientType}
                    onChange={(e) => setPatientType(e.target.value)}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                    <MenuItem value="unconfirmed">Chưa xác nhận</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Nút hành động */}
              <Grid item xs={12} textAlign="center">
                <Button
                  variant="outlined"
                  color=""
                  sx={{
                    transitionDuration: "100",
                    borderWidth: "2px",
                    backgroundColor: "Blue",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "Blue",
                    },
                    marginRight: 5,
                  }}
                  disabled={!!dateError || !!timeError}
                  onClick={handleSubmit}
                >
                  Lưu lịch khám
                </Button>
                <Button
                  variant="outlined"
                  color=""
                  sx={{
                    transitionDuration: "100",
                    borderWidth: "2px",
                    backgroundColor: "red",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "red",
                    },
                  }}
                  onClick={handleDelete}
                >
                  Xóa
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              border: "2px solid #E9F7DD",
              borderRadius: 2,
              marginTop: 1,
              padding: 1,
              width: "max-width",
              boxShadow: 1,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(3px)",
            }}
          >
            {/* Bảng thông tin */}
            <Grid container>
              <Grid item xs={12}>
                <TableContainer
                  component={Paper}
                  sx={{ boxShadow: 3, height: "570px", overflowY: "auto" }}
                >
                  <Table>
                    <TableHead
                      sx={{
                        bgcolor: "#E9F7DD",
                      }}
                    >
                      <TableRow>
                        <TableCell sx={{ border: "2px solid #000" }}>
                          Chọn
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid #000",
                          }}
                        >
                          STT
                        </TableCell>
                        <TableCell sx={{ border: "2px solid #000" }}>
                          Xử lý
                        </TableCell>
                        <TableCell sx={{ border: "2px solid #000" }}>
                          Phòng
                        </TableCell>
                        <TableCell sx={{ border: "2px solid #000" }}>
                          Giờ khám
                        </TableCell>
                        <TableCell sx={{ border: "2px solid #000" }}>
                          Tên bệnh nhân
                        </TableCell>
                        <TableCell sx={{ border: "2px solid #000" }}>
                          Ngày sinh
                        </TableCell>
                        <TableCell sx={{ border: "2px solid #000" }}>
                          Số điện thoại
                        </TableCell>
                        <TableCell sx={{ border: "2px solid #000" }}>
                          Ngày khám
                        </TableCell>
                        <TableCell sx={{ border: "2px solid #000" }}>
                          Yêu cầu
                        </TableCell>
                        <TableCell sx={{ border: "2px solid #000" }}>
                          Ghi chú
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Dữ liệu mẫu */}
                      {appointmentList.map((appointment, index) => (
                        <TableRow key={appointment.id}>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            <Button>Chọn</Button>
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            {index + 1}{" "}
                            {/* Displaying the index or appointment number */}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            <Checkbox />
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            {appointment.phong} {/* Room data */}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            {appointment.gioKhamBenh} {/* Appointment time */}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            {appointment.tenbenhnhan} {/* Patient's name */}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            {appointment.ngaythangnamsinh}{" "}
                            {/* Patient's date of birth */}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            {appointment.sdtdangky}{" "}
                            {/* Patient's phone number */}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            {appointment.ngayKhamBenh} {/* Appointment date */}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            {appointment.yeuCauDacBiet} {/* Examination type */}
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            {appointment.loaiBenhNhan} {/* Patient's status */}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentBooking;
