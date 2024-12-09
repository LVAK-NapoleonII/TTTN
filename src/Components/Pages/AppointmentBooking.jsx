import React, { useState } from "react";
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
import { CheckBox } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateField } from "@mui/x-date-pickers/DateField";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import enGB from "date-fns/locale/en-GB";

const AppointmentBooking = () => {
  const [dateError, setDateError] = useState("");
  const [dobError, setDobError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [shift, setShift] = useState("");

  const handleDateChange = (newValue) => {
    const today = new Date();
    const selectedDay = new Date(newValue).setHours(0, 0, 0, 0);
    const todayMidnight = today.setHours(0, 0, 0, 0);
    if (selectedDay < todayMidnight) {
      setDateError("Ngày khám bệnh không được nhỏ hơn thời điểm hiện tại");
    } else {
      setDateError("");
      setSelectedDate(newValue);
      setTimeError("");
    }
  };
  const handleDobChange = (newValue) => {
    const today = new Date();
    if (newValue > today) {
      setDobError("Ngày sinh không được lớn hơn thời điểm hiện tại");
    } else {
      setDobError("");
    }
  };
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const phoneRegex = /^[0-9]*$/; // Chỉ cho phép số

    if (!phoneRegex.test(value)) {
      setPhoneError("Số điện thoại chỉ được chứa ký tự số");
    } else if (value.length > 12) {
      setPhoneError("Số điện thoại không được quá 12 ký tự");
    } else {
      setPhoneError("");
    }
    setPhoneNumber(value);
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
                    options={["Phòng 1", "Phòng 2"]} // Các giá trị có sẵn
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn phòng"
                        variant="outlined"
                      />
                    )}
                    onInputChange={(event, newValue) => {
                      console.log("Giá trị nhập:", newValue); // Xử lý giá trị tại đây
                    }}
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
                    onInputChange={(event, newValue) => {
                      console.log("Giá trị nhập:", newValue);
                    }}
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
                  <Autocomplete
                    freeSolo
                    options={["Lê Vũ Anh kiệt", "Mai rồi làm tiếp"]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chọn Bác sĩ"
                        variant="outlined"
                      />
                    )}
                    onInputChange={(event, newValue) => {
                      console.log("Giá trị nhập:", newValue);
                    }}
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
                <TextField fullWidth label="Tên bệnh nhân" />
              </Grid>
              <Grid item xs={6}>
                <TimeField
                  fullWidth
                  label="Giờ khám"
                  InputLabelProps={{ shrink: true }}
                  defaultValue={new Date()}
                  onChange={(newValue) => handleTimeChange(newValue)}
                  helperText={timeError}
                  error={!!timeError}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại đăng ký"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  helperText={phoneError}
                  error={!!phoneError}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại gọi"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  helperText={phoneError}
                  error={!!phoneError}
                />
              </Grid>
              <Grid item xs={6}>
                <DateField
                  fullWidth
                  label="Ngày sinh"
                  InputLabelProps={{ shrink: true }}
                  defaultValue={new Date()}
                  onChange={(newValue) => handleDobChange(newValue)}
                  helperText={dobError}
                  error={!!dobError}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Yêu cầu đặc biệt" />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <RadioGroup row>
                    <FormControlLabel
                      value="new"
                      control={<Radio />}
                      label="Bệnh nhân mới"
                    />
                    <FormControlLabel
                      value="return"
                      control={<Radio />}
                      label="Tái khám"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Bộ lọc</InputLabel>
                  <Select label="Bộ lọc">
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                    <MenuItem value="unconfirmed">Chưa xác nhận</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Nút hành động */}
              <Grid item xs={12} textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: 2 }}
                  disabled={!!dateError || !!timeError}
                >
                  Lưu lịch khám
                </Button>
                <Button variant="outlined" color="error">
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
            <Grid>
              {/* Bảng thông tin */}
              <Grid container>
                <Grid item xs={12}>
                  <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                    <Table>
                      <TableHead
                        sx={{
                          bgcolor: "#E9F7DD",
                        }}
                      >
                        <TableRow>
                          <TableCell
                            sx={{
                              border: "2px solid #000",
                            }}
                          >
                            STT
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
                            Người chỉnh sửa
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            Ghi chú
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            Xử lý
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* Dữ liệu mẫu */}
                        <TableRow>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            1
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            Phòng 1
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            08:00
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            Nguyễn Văn A
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            01/01/1990
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            0123456789
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            10/12/2024
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            Khám tổng quát
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            Bệnh nhân mới
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            Admin
                          </TableCell>
                          <TableCell sx={{ border: "2px solid #000" }}>
                            <CheckBox />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentBooking;
