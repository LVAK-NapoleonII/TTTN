import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
    sdtdangky: "",
    sdtgoiden: "",
    yeuCauDacBiet: "",
    ngayKhamBenh: new Date(),
    gioKhamBenh: new Date(),
    loaiBenhNhan: "",
    trangThai: "Chưa xác nhận",
    ngayTaoLich: "",
    lichLamViecBacSi: {
      id: 0,
      tenphong: "",
      calam: "",
      ngaybatdau: new Date(),
      ngayketthuc: new Date(),
      thongtinBacsi: {
        id: 0,
        tenBacsi: "",
      },
    },
    thongtinBenhnhan: {
      id: 0,
      hovaTenbenhnhan: "",
      ngaythangnamsinh: new Date(),
    },
  });
  const [isEditing, setIsEditing] = useState(false);
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
  const [patientType, setPatientType] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const handleCloseNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };
  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };
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
  const handleSelectAppointmentForEdit = (appointment) => {
    setIsEditing(true);
    setFormData({
      id: appointment.id,
      tenbenhnhan: appointment.tenbenhnhan,
      ngaythangnamsinh: new Date(appointment.ngaythangnamsinh),
      sdtdangky: appointment.sdtdangky,
      sdtgoiden: appointment.sdtgoiden || "",
      yeuCauDacBiet: appointment.yeuCauDacBiet || "",
      ngayKhamBenh: new Date(appointment.ngayKhamBenh),
      gioKhamBenh: new Date(`2024-01-01T${appointment.gioKhamBenh}`),
      loaiBenhNhan: appointment.loaiBenhNhan || "",
      trangThai: appointment.trangThai,
      lichLamViecBacSi: {
        tenphong: appointment.lichLamViecBacSi?.tenphong || "",
        tenBacsi: appointment.lichLamViecBacSi?.tenBacsi || "",
        calam: appointment.lichLamViecBacSi?.calam || "",
      },
    });
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
      [fieldName]: phoneError,
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

    // Kiểm tra phòng khám
    if (!selectedRoom) {
      newErrors.room = "Vui lòng chọn phòng khám";
    }

    // Kiểm tra ca làm việc
    if (!shift) {
      newErrors.shift = "Vui lòng chọn ca làm việc";
    }

    // Kiểm tra ngày khám
    if (!formData.ngayKhamBenh) {
      newErrors.ngayKhamBenh = "Vui lòng chọn ngày khám";
    }

    // Kiểm tra bác sĩ
    if (!selectedDoctor) {
      newErrors.doctor = "Vui lòng chọn bác sĩ";
    }

    // Kiểm tra tên bệnh nhân
    if (!formData.tenbenhnhan?.trim()) {
      newErrors.tenbenhnhan = "Vui lòng nhập tên bệnh nhân";
    }

    // Kiểm tra giờ khám
    if (!formData.gioKhamBenh) {
      newErrors.gioKhamBenh = "Vui lòng chọn giờ khám";
    }

    // Kiểm tra số điện thoại đăng ký
    if (!formData.sdtdangky?.trim()) {
      newErrors.sdtdangky = "Vui lòng nhập số điện thoại đăng ký";
    } else if (!/^[0-9]{10,11}$/.test(formData.sdtdangky)) {
      newErrors.sdtdangky = "Số điện thoại không hợp lệ (10-11 số)";
    }

    // Kiểm tra ngày sinh
    if (!formData.ngaythangnamsinh) {
      newErrors.ngaythangnamsinh = "Vui lòng chọn ngày sinh";
    }

    // Kiểm tra loại bệnh nhân
    if (!formData.loaiBenhNhan) {
      newErrors.loaiBenhNhan = "Vui lòng chọn loại bệnh nhân";
    }

    // Cập nhật state errors
    setErrors(newErrors);

    // Nếu có lỗi, hiển thị thông báo
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join("\n");
      showNotification(errorMessages, "error");
      return false;
    }

    return true;
  };

  // Submit appointment
  const handleSubmit = async () => {
    if (!validateForm()) {
      showNotification("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    try {
      // Tìm lịch làm việc bác sĩ phù hợp
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
        showNotification("Không tìm thấy lịch làm việc của bác sĩ", "error");
        return;
      }

      const matchingSchedule = matchingScheduleResponse.data.data[0];

      // Chuẩn bị dữ liệu theo đúng cấu trúc API yêu cầu
      const submitData = {
        sdtdangky: formData.sdtdangky,
        sdtgoiden: formData.sdtgoiden || "",
        yeuCauDacBiet: formData.yeuCauDacBiet || "",
        ngayKhamBenh: formData.ngayKhamBenh.toISOString().split("T")[0],
        gioKhamBenh: formData.gioKhamBenh.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        loaiBenhNhan: formData.loaiBenhNhan || "",
        trangThai: "Chưa xác nhận",
        lichLamViecBacSi: {
          id: matchingSchedule.id,
          tenphong: matchingSchedule.tenphong,
          calam: matchingSchedule.calam,
          thongtinBacsi: {
            id: matchingSchedule.thongtinBacsi?.id || 0,
            tenBacsi: matchingSchedule.tenBacsi,
          },
        },
        thongtinBenhnhan: {
          hovaTenbenhnhan: formData.tenbenhnhan,
          ngaythangnamsinh: formData.ngaythangnamsinh
            .toISOString()
            .split("T")[0],
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

      if (response.data) {
        showNotification("Tạo lịch khám thành công", "success");
        fetchAppointments();
        resetForm();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.Errors?.map((e) => e.ErrorMessage).join(", ") ||
        "Có lỗi xảy ra khi tạo lịch khám";
      showNotification(errorMessage, "error");
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
      showNotification("Xóa lịch khám thành công", "success");
      fetchAppointments();
    } catch (error) {
      showNotification("Có lỗi xảy ra khi xóa lịch khám", error);
    }
  };
  const handleEdit = async (appointment) => {
    try {
      // Determine the new status
      const newStatus =
        appointment.trangThai === "Đã xác nhận"
          ? "Chưa xác nhận"
          : "Đã xác nhận";
      const updatedAppointment = {
        id: appointment.id,
        tenbenhnhan: appointment.tenbenhnhan,
        ngaythangnamsinh: appointment.ngaythangnamsinh,
        sdtdangky: appointment.sdtdangky,
        sdtgoiden: appointment.sdtgoiden || "",
        yeuCauDacBiet: appointment.yeuCauDacBiet || "",
        ngayKhamBenh: appointment.ngayKhamBenh,
        gioKhamBenh: appointment.gioKhamBenh,
        loaiBenhNhan: appointment.loaiBenhNhan || "",
        trangThai: newStatus,
        lichLamViecBacSi: {
          id: appointment.lichLamViecBacSi?.id || 0,
          tenphong: appointment.lichLamViecBacSi?.tenphong || "",
          tenBacsi: appointment.lichLamViecBacSi?.tenBacsi || "",
          calam: appointment.lichLamViecBacSi?.calam || "",
          ngayLam: appointment.lichLamViecBacSi?.ngayLam || new Date(),
        },
      };
      // Send the update request
      const response = await axios.put(
        `http://localhost:5038/api/LichKhamBenh/edit/${appointment.id}`,
        updatedAppointment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check for successful response
      if (response.status === 200) {
        // Refresh the appointment list
        fetchAppointments();

        // Optional: Show a success message
        alert(`Cập nhật trạng thái thành công: ${newStatus}`);
      }
    } catch (error) {
      // Handle any errors that occur during the update
      console.error("Lỗi cập nhật trạng thái:", error);

      // Provide more detailed error feedback
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.Errors?.map((e) => e.ErrorMessage).join(", ") ||
        error.message ||
        "Cập nhật trạng thái thất bại, vui lòng thử lại!";

      alert(errorMessage);
    }
  };
  const handleUpdateAppointment = async () => {
    try {
      const token = localStorage.getItem("token");

      // Prepare data for update
      const updateData = {
        ...formData,
        ngaythangnamsinh:
          formData.ngaythangnamsinh instanceof Date
            ? formData.ngaythangnamsinh.toISOString().split("T")[0]
            : formData.ngaythangnamsinh,
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
      };

      // Send update request
      const response = await axios.put(
        `http://localhost:5038/api/LichKhamBenh/edit/${formData.id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      handleUpdateAppointment;
      resetForm();
      fetchAppointments();
    } catch (error) {
      showNotification("Có lỗi xảy ra khi cập nhật lịch khám", "error");
    }
  };
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };
  const filteredAppointments = appointmentList.filter((appointment) => {
    // Kiểm tra loại bệnh nhân
    const matchPatientType =
      !patientType ||
      (patientType === "confirmed" &&
        appointment.trangThai === "Đã xác nhận") ||
      (patientType === "unconfirmed" &&
        appointment.trangThai === "Chưa xác nhận");

    // Kiểm tra từ khóa tìm kiếm
    const matchKeyword =
      !searchKeyword ||
      appointment.tenbenhnhan
        .toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.sdtdangky.includes(searchKeyword) ||
      appointment.phong.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchPatientType && matchKeyword;
  });
  // Reset form after submission
  const resetForm = () => {
    setFormData({
      id: 0,
      tenbenhnhan: "",
      ngaythangnamsinh: new Date(),
      sdtdangky: "",
      sdtgoiden: "",
      yeuCauDacBiet: "", // Ensure this is initialized as empty string
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
    setIsEditing(false);
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
                      <TextField
                        {...params}
                        label="Chọn phòng"
                        error={!!errors.room}
                        helperText={errors.room}
                        required
                      />
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
                      <TextField
                        {...params}
                        label="Chọn ca làm"
                        error={!!errors.shift}
                        helperText={errors.shift}
                        required
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <DateField
                  fullWidth
                  label="Ngày khám bệnh"
                  required
                  value={formData.ngayKhamBenh}
                  onChange={handleDateChange}
                  error={!!dateError || !!errors.ngayKhamBenh}
                  helperText={dateError || errors.ngayKhamBenh}
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
                      <TextField
                        {...params}
                        label="Chọn bác sĩ"
                        error={!!errors.doctor}
                        helperText={errors.doctor}
                        required
                      />
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
                  error={!!errors.tenbenhnhan}
                  helperText={errors.tenbenhnhan}
                />
              </Grid>
              <Grid item xs={6}>
                <TimeField
                  label="Giờ khám bệnh"
                  value={formData.gioKhamBenh}
                  onChange={handleTimeChange}
                  fullWidth
                  required
                  error={!!timeError || !!errors.gioKhamBenh}
                  helperText={timeError || errors.gioKhamBenh}
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
                  error={!!errors.sdtdangky}
                  helperText={errors.sdtdangky}
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
                  error={!!errors.sdtgoiden}
                  helperText={errors.sdtgoiden}
                />
              </Grid>
              <Grid item xs={6}>
                <DateField
                  label="Ngày sinh"
                  value={formData.ngaythangnamsinh}
                  onChange={handleDobChange}
                  fullWidth
                  required
                  error={!!dobError || !!errors.ngaythangnamsinh}
                  helperText={dobError || errors.ngaythangnamsinh}
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
                  onChange={(event, newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      loaiBenhNhan: newValue,
                    }));
                  }}
                  options={["Bệnh nhân mới", "Bệnh nhân tái khám"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Loại bệnh nhân"
                      error={!!errors.loaiBenhNhan}
                      helperText={errors.loaiBenhNhan}
                      required
                    />
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
              <Grid item xs={6} sm={6} md={4}>
                <TextField
                  label="Tìm kiếm"
                  variant="outlined"
                  size="small"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  sx={{ width: "100%" }}
                  placeholder="Tìm theo tên, số điện thoại"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* Nút hành động */}
              <Grid item xs={12} textAlign="center">
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    sx={{
                      transitionDuration: "100",
                      borderWidth: "2px",
                      borderColor: "#007FFF",
                      backgroundColor: "#007FFF",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "white",
                        color: "#007FFF",
                      },
                      marginRight: 2,
                    }}
                    disabled={!!dateError || !!timeError}
                    onClick={handleSubmit}
                  >
                    Lưu lịch khám
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      sx={{
                        transitionDuration: "100",
                        borderWidth: "2px",
                        backgroundColor: "green",
                        borderColor: "green",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "white",
                          color: "green",
                        },
                        marginRight: 2,
                      }}
                      onClick={handleUpdateAppointment}
                    >
                      Lưu chỉnh sửa
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        transitionDuration: "100",
                        borderWidth: "2px",
                        borderColor: "gray",
                        backgroundColor: "gray",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "white",
                          color: "gray",
                        },
                        marginRight: 2,
                      }}
                      onClick={resetForm}
                    >
                      Hủy
                    </Button>
                  </>
                )}
                <Button
                  variant="outlined"
                  sx={{
                    transitionDuration: "100",
                    borderWidth: "2px",
                    borderColor: "#FF033E",
                    backgroundColor: "#FF033E",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "#FF033E",
                    },
                  }}
                  onClick={() => {
                    if (formData.id) {
                      handleDelete(formData.id);
                    } else {
                      resetForm();
                    }
                  }}
                >
                  {formData.id ? "Xóa" : "Làm mới"}
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
                          Chọn
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            fontWeight: "bold",
                            p: "2px",
                          }}
                        >
                          STT
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            fontWeight: "bold",
                            p: "2px",
                          }}
                        >
                          Xử lý
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            fontWeight: "bold",
                            p: "2px",
                          }}
                        >
                          Phòng
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            fontWeight: "bold",
                            p: "2px",
                          }}
                        >
                          Giờ khám
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
                          Số điện thoại
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            fontWeight: "bold",
                            p: "2px",
                          }}
                        >
                          Ngày khám
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            fontWeight: "bold",
                            p: "2px",
                          }}
                        >
                          Yêu cầu
                        </TableCell>
                        <TableCell
                          sx={{
                            border: "2px solid  #E1EBEE",
                            textAlign: "center",
                            fontWeight: "bold",
                            p: "2px",
                          }}
                        >
                          Ghi chú
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Dữ liệu mẫu */}
                      {filteredAppointments.map((appointment, index) => (
                        <TableRow
                          key={appointment.id}
                          hover
                          sx={{
                            cursor: "pointer",
                            backgroundColor:
                              appointment.trangThai === "Đã xác nhận"
                                ? "#B2FFFF"
                                : "#ffbcba",
                          }}
                        >
                          <TableCell sx={{ border: "2px solid #E1EBEE" }}>
                            <Button
                              variant="contained"
                              sx={{ bgcolor: "#89CFF0" }}
                              size="small"
                              onClick={() => {
                                // Điền thông tin lịch khám vào form để sửa
                                setFormData({
                                  id: appointment.id,
                                  tenbenhnhan: appointment.tenbenhnhan,
                                  ngaythangnamsinh: new Date(
                                    appointment.ngaythangnamsinh
                                  ),
                                  sdtdangky: appointment.sdtdangky,
                                  ngayKhamBenh: new Date(
                                    appointment.ngayKhamBenh
                                  ),
                                  gioKhamBenh: new Date(
                                    `2024-01-01T${appointment.gioKhamBenh}`
                                  ),
                                  yeuCauDacBiet: appointment.yeuCauDacBiet,
                                  loaiBenhNhan: appointment.loaiBenhNhan,
                                  lichLamViecBacSi: {
                                    tenphong: appointment.phong,
                                    tenBacsi: appointment.bacSi,
                                  },
                                });
                                // Thiết lập các state khác
                                setSelectedRoom(appointment.phong);
                                setSelectedDoctor(appointment.bacSi);
                                setShift(
                                  appointment.lichLamViecBacSi?.calam || ""
                                );
                                handleSelectAppointmentForEdit(appointment);
                              }}
                            >
                              Chọn
                            </Button>
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid  #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {index + 1}
                            {/* Displaying the index or appointment number */}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid  #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            <Checkbox
                              checked={appointment.trangThai === "Đã xác nhận"}
                              onChange={() => handleEdit(appointment)}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid  #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.phong} {/* Room data */}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid  #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.gioKhamBenh} {/* Appointment time */}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid  #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.tenbenhnhan} {/* Patient's name */}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid  #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.ngaythangnamsinh}
                            {/* Patient's date of birth */}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid  #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.sdtdangky}
                            {/* Patient's phone number */}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid  #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.ngayKhamBenh} {/* Appointment date */}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid  #E1EBEE",
                              textAlign: "center",
                            }}
                          >
                            {appointment.yeuCauDacBiet} {/* Examination type */}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "2px solid  #E1EBEE",
                              textAlign: "center",
                            }}
                          >
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
      </Box>{" "}
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
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default AppointmentBooking;
