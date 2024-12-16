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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateField } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import enGB from "date-fns/locale/en-GB";
import axios from "axios";

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    tenbenhnhan: "",
    ngaythangnamsinh: null,
    sdtdangky: "",
    ngaykhambenh: null,
    giokhambenh: null,
    loaiBenhNhan: "",
    yeuCauDacBiet: "",
    taiKhoan: {},
    lichLamViecBacSi: {},
  });

  const [dateError, setDateError] = useState("");
  const [dobError, setDobError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [shift, setShift] = useState("");
  const [appointmentList, setAppointmentList] = useState([]);

  useEffect(() => {
    fetchLoggedInAccount();
    fetchDoctorSchedules();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5038/api/LichKhamBenh"
      );
      setAppointmentList(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      showSnackbar("Không thể tải danh sách lịch khám", "error");
    }
  };

  const fetchLoggedInAccount = async () => {
    // Fetch logged-in user account information
    try {
      const response = await axios.get(
        "http://localhost:5038/api/Account/LoggedIn"
      );
      setFormData({ ...formData, taiKhoan: response.data });
    } catch (error) {
      console.error("Error fetching logged-in account:", error);
    }
  };

  const fetchDoctorSchedules = async () => {
    // Fetch doctor schedules
    try {
      const response = await axios.get(
        "http://localhost:5038/api/DoctorSchedules"
      );
      setFormData({ ...formData, lichLamViecBacSi: response.data });
    } catch (error) {
      console.error("Error fetching doctor schedules:", error);
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
      setFormData({ ...formData, ngaykhambenh: newValue });
      setTimeError("");
    }
  };

  const handleTimeChange = (newValue) => {
    const today = new Date();
    const selectedDay = new Date(selectedDate);
    selectedDay.setHours(newValue.getHours(), newValue.getMinutes(), 0, 0);
    const currentTime = new Date();
    currentTime.setSeconds(0, 0);
    if (
      selectedDate.toDateString() === today.toDateString() &&
      selectedDay < currentTime
    ) {
      setTimeError("Giờ khám không được nhỏ hơn giờ hiện tại");
    } else {
      setTimeError("");
      setSelectedTime(newValue);
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:5038/api/LichKhamBenh",
        {
          ...formData,
          ngaythangnamsinh: formData.ngaythangnamsinh.toISOString(),
          ngaykhambenh: formData.ngaykhambenh.toISOString(),
          giokhambenh: formData.giokhambenh.toTimeString().split(" ")[0],
        }
      );

      showSnackbar("Đặt lịch khám thành công", "success");
      fetchAppointments(); // Refresh the list
      resetForm();
    } catch (error) {
      console.error("Error creating appointment:", error);
      showSnackbar("Đặt lịch khám thất bại", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const resetForm = () => {
    setFormData({
      tenbenhnhan: "",
      ngaythangnamsinh: new Date(),
      sdtdangky: "",
      yeuCauDacBiet: "",
      ngaykhambenh: new Date(),
      giokhambenh: new Date(),
      loaiBenhNhan: "",
      taiKhoan: {},
      lichLamViecBacSi: {},
    });
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
                    freeSolo
                    options={["Phòng 1", "Phòng 2"]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn phòng"
                        variant="outlined"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    freeSolo
                    options={["Ca 0", "Ca 1", "Ca 2", "Ca 3", "Ca 4"]}
                    value={shift}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn ca làm"
                        variant="outlined"
                      />
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
                  onChange={(newValue) => handleDateChange(newValue)}
                  helperText={dateError}
                  error={!!dateError}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    label="Yêu cầu đặc biệt"
                    value={formData.yeuCauDacBiet}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yeuCauDacBiet: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Đặt lịch khám
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentBooking;
