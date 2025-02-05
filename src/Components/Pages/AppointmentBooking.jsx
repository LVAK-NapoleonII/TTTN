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
import { differenceInYears } from "date-fns";

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
  const [creationDateFilter, setCreationDateFilter] = useState(new Date());
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // Hàm so sánh ngày (chỉ so sánh ngày/tháng/năm, không quan tâm giờ)
  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };
  // Hàm xử lý thay đổi ngày
  const handleCreationDateChange = (newValue) => {
    setCreationDateFilter(newValue);
  };
  // Thêm nút reset để quay lại ngày hiện tại
  const resetToCurrentDate = () => {
    setCreationDateFilter(new Date());
  };

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
    if (selectedDate) {
      fetchDoctorSchedules();
    }
    fetchAppointments();
  }, [selectedDate]);

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
            ngayLam: selectedDate?.toISOString().split("T")[0],
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
        if (currentRoom && !rooms.includes(currentRoom)) {
          setSelectedRoom("");
          showNotification(
            "Phòng đã chọn không khả dụng trong ca này",
            "warning"
          );
        }
        if (currentShift && !shifts.includes(currentShift)) {
          setShift("");
          showNotification("Ca làm việc đã chọn không khả dụng", "warning");
        }
        if (currentDoctor && !doctors.includes(currentDoctor)) {
          setSelectedDoctor("");
          showNotification(
            "Bác sĩ đã chọn không làm việc trong ca này",
            "warning"
          );
        }
      }
    } catch (error) {
      console.error("Error fetching doctor schedules:", error);
      setErrors(error.message || "Không thể tải lịch làm việc của bác sĩ");
      showNotification("Không thể tải lịch làm việc của bác sĩ", "error");
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
      return;
    }
    const age = differenceInYears(today, newValue);

    if (age > 16) {
      setDobError("Bệnh nhân phải dưới 16 tuổi");
      setFormData((prev) => ({
        ...prev,
        ngaythangnamsinh: prev.ngaythangnamsinh,
      }));
      return;
    }

    setDobError("");
    setFormData((prev) => ({
      ...prev,
      ngaythangnamsinh: newValue,
    }));
  };

  const handleSelectAppointmentForEdit = (appointment) => {
    setIsEditing(true);
    setFormData({
      id: appointment.id,
      tenbenhnhan: appointment.hovaTenbenhnhan,
      ngaythangnamsinh: new Date(appointment.ngaythangnamsinh),
      sdtdangky: appointment.sdtdangky,
      sdtgoiden: appointment.sdtgoiden || "",
      yeuCauDacBiet: appointment.yeuCauDacBiet || "",
      ngayKhamBenh: new Date(appointment.ngayKhamBenh),
      gioKhamBenh: new Date(`2024-01-01T${appointment.gioKhamBenh}`),
      loaiBenhNhan: appointment.loaiBenhNhan || "",
      trangThai: appointment.trangThai,
      lichLamViecBacSi: {
        tenphong: appointment.phong,
        calam: appointment.calam,
        thongtinBacsi: {
          tenBacsi: appointment.bacSi,
        },
      },
      thongtinBenhnhan: {
        // Explicitly set patient info
        id: appointment.thongtinBenhnhan?.id || 0,
        hovaTenbenhnhan: appointment.hovaTenbenhnhan,
        ngaythangnamsinh: appointment.ngaythangnamsinh,
      },
    });

    setSelectedRoom(appointment.phong);
    setSelectedDoctor(appointment.bacSi);
    setShift(appointment.calam);
  };

  const handlePhoneNumberChange = (e, fieldName) => {
    const value = e.target.value;
    const phoneRegex = /^[0-9]*$/;

    let phoneError = "";
    if (!phoneRegex.test(value)) {
      phoneError = "Số điện thoại chỉ được chứa ký tự số";
    } else if (value.length > 12) {
      phoneError = "Số điện thoại không được quá 12 ký tự";
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [fieldName]: phoneError,
    }));
  };

  const timeStringToDate = (timeStr) => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };
  const getShiftFromTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();

    if ((hours === 5 && minutes >= 30) || (hours >= 6 && hours < 7))
      return "Ca 0";
    if (hours >= 7 && hours < 11) return "Ca 1";
    if (hours >= 11 && hours < 13) return "Ca 2";
    if (hours >= 13 && hours < 16) return "Ca 3";
    if ((hours >= 16 && hours < 19) || (hours === 19 && minutes <= 30))
      return "Ca 4";
    return "";
  };
  const isTimeWithinShift = (time, shiftName) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();

    const shiftRanges = {
      "Ca 0": { start: { h: 5, m: 30 }, end: { h: 7, m: 0 } },
      "Ca 1": { start: { h: 7, m: 0 }, end: { h: 11, m: 0 } },
      "Ca 2": { start: { h: 11, m: 0 }, end: { h: 13, m: 0 } },
      "Ca 3": { start: { h: 13, m: 0 }, end: { h: 16, m: 0 } },
      "Ca 4": { start: { h: 16, m: 0 }, end: { h: 19, m: 30 } },
    };

    const range = shiftRanges[shiftName];
    if (!range) return false;

    const timeInMinutes = hours * 60 + minutes;
    const startInMinutes = range.start.h * 60 + range.start.m;
    const endInMinutes = range.end.h * 60 + range.end.m;

    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  };

  const handleTimeChange = async (newValue) => {
    try {
      const hours = newValue.getHours();
      const minutes = newValue.getMinutes();
      const timeInMinutes = hours * 60 + minutes;

      if (timeInMinutes < 5 * 60 + 30 || timeInMinutes > 19 * 60 + 30) {
        setTimeError("Thời gian đặt lịch phải từ 5:30 đến 19:30");
        showNotification("Thời gian đặt lịch phải từ 5:30 đến 19:30", "error");
        return;
      }

      const newShift = getShiftFromTime(newValue);
      if (!newShift) {
        setTimeError("Thời gian không thuộc ca làm việc nào");
        showNotification("Thời gian không thuộc ca làm việc nào", "error");
        return;
      }

      const today = new Date();
      const selectedDay = new Date(selectedDate);
      const currentTime = new Date();

      if (isSameDay(selectedDay, today) && newValue < currentTime) {
        setTimeError("Giờ khám không được nhỏ hơn giờ hiện tại");
        showNotification("Giờ khám không được nhỏ hơn giờ hiện tại", "error");
        return;
      }

      const response = await axios.get(
        "http://localhost:5038/api/LichKhamBenh/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const appointmentsOnSameDay = response.data.filter(
        (appointment) =>
          appointment.phong === selectedRoom &&
          isSameDay(new Date(appointment.ngayKhamBenh), selectedDate)
      );

      // Sort appointments by time
      appointmentsOnSameDay.sort((a, b) => {
        const timeA = timeStringToDate(a.gioKhamBenh);
        const timeB = timeStringToDate(b.gioKhamBenh);
        return timeA - timeB;
      });

      // Check 7-minute gap between appointments
      for (const appointment of appointmentsOnSameDay) {
        const existingTime = timeStringToDate(appointment.gioKhamBenh);
        if (!existingTime) continue;

        const newTimeMinutes = newValue.getHours() * 60 + newValue.getMinutes();
        const existingTimeMinutes =
          existingTime.getHours() * 60 + existingTime.getMinutes();
        const timeDiff = Math.abs(newTimeMinutes - existingTimeMinutes);

        console.log("Time check:", {
          existing: appointment.gioKhamBenh,
          new: newValue,
          diff: timeDiff,
        });

        if (timeDiff < 7) {
          const errorMessage =
            "Thời gian đặt lịch phải cách các lịch khám khác ít nhất 7 phút";
          setTimeError(errorMessage);
          showNotification(errorMessage, "error");
          return;
        }
      }

      setTimeError("");
      setSelectedTime(newValue);
      setFormData((prev) => ({
        ...prev,
        gioKhamBenh: newValue,
      }));
      setShift(newShift);
      fetchDoctorSchedules(newShift, selectedRoom, selectedDoctor);
    } catch (error) {
      console.error("Error in handleTimeChange:", error);
      const errorMessage = "Có lỗi xảy ra khi kiểm tra thời gian đặt lịch";
      setTimeError(errorMessage);
      showNotification(errorMessage, "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Fix for yeuCauDacBiet field
      [name === "yeucaudatbiet" ? "yeuCauDacBiet" : name]: value,
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
    } else {
      const age = differenceInYears(new Date(), formData.ngaythangnamsinh);
      if (age > 16) {
        newErrors.ngaythangnamsinh = "Bệnh nhân phải dưới 16 tuổi";
      }
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
      // Kiểm tra trùng lịch khám
      const checkDuplicateResponse = await axios.get(
        "http://localhost:5038/api/LichKhamBenh/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const existingAppointments = checkDuplicateResponse.data;

      // Kiểm tra trùng số điện thoại trong cùng ngày
      const duplicatePhone = existingAppointments.find(
        (appointment) =>
          appointment.sdtdangky === formData.sdtdangky &&
          isSameDay(new Date(appointment.ngayKhamBenh), formData.ngayKhamBenh)
      );

      if (duplicatePhone) {
        showNotification(
          "Số điện thoại này đã được đặt lịch khám trong ngày. Vui lòng chọn ngày khác!",
          "error"
        );
        return;
      }

      // Kiểm tra trùng tên trong cùng ngày
      const duplicateName = existingAppointments.find(
        (appointment) =>
          appointment.hovaTenbenhnhan.toLowerCase() ===
            formData.tenbenhnhan.toLowerCase() &&
          isSameDay(new Date(appointment.ngayKhamBenh), formData.ngayKhamBenh)
      );

      if (duplicateName) {
        showNotification(
          "Bệnh nhân này đã có lịch khám trong ngày. Vui lòng chọn ngày khác!",
          "error"
        );
        return;
      }

      // Kiểm tra thời gian giữa các lịch khám
      const appointmentsOnSameDay = existingAppointments.filter(
        (appointment) =>
          appointment.phong === selectedRoom &&
          isSameDay(new Date(appointment.ngayKhamBenh), formData.ngayKhamBenh)
      );

      const selectedTimeMinutes =
        formData.gioKhamBenh.getHours() * 60 +
        formData.gioKhamBenh.getMinutes();

      for (const appointment of appointmentsOnSameDay) {
        const [hours, minutes] = appointment.gioKhamBenh.split(":").map(Number);
        const existingTimeMinutes = hours * 60 + minutes;

        const timeDiff = Math.abs(selectedTimeMinutes - existingTimeMinutes);

        if (timeDiff < 7) {
          showNotification(
            "Thời gian giữa các lịch khám phải cách nhau ít nhất 7 phút!",
            "error"
          );
          return;
        }
      }

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

      // Chuẩn bị dữ liệu để gửi
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
      const newStatus =
        appointment.trangThai === "Đã xác nhận"
          ? "Chưa xác nhận"
          : "Đã xác nhận";

      const updatedAppointment = {
        id: appointment.id,
        sdtdangky: appointment.sdtdangky,
        sdtgoiden: appointment.sdtgoiden || "",
        yeuCauDacBiet: appointment.yeuCauDacBiet || "",
        ngayKhamBenh: appointment.ngayKhamBenh,
        gioKhamBenh: appointment.gioKhamBenh,
        loaiBenhNhan: appointment.loaiBenhNhan,
        trangThai: newStatus,
        thongtinBenhnhan: {
          hovaTenbenhnhan: appointment.hovaTenbenhnhan,
          ngaythangnamsinh: appointment.ngaythangnamsinh,
        },
        lichLamViecBacSi: {
          tenphong: appointment.phong,
          calam: appointment.calam,
          thongtinBacsi: {
            tenBacsi: appointment.bacSi,
          },
        },
      };

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

      if (response.status === 200) {
        showNotification(
          `Cập nhật trạng thái thành công: ${newStatus}`,
          "success"
        );
        fetchAppointments(); // Refresh the list
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.Message ||
        "Cập nhật trạng thái thất bại, vui lòng thử lại!";
      showNotification(errorMessage, "error");
    }
  };

  const handleUpdateAppointment = async () => {
    try {
      if (!validateForm()) return;

      const checkDuplicateResponse = await axios.get(
        "http://localhost:5038/api/LichKhamBenh/getAll",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const existingAppointments = checkDuplicateResponse.data.filter(
        (appointment) => appointment.id !== formData.id
      );

      // Time validation
      const appointmentsOnSameDay = existingAppointments.filter(
        (appointment) =>
          appointment.phong === selectedRoom &&
          isSameDay(new Date(appointment.ngayKhamBenh), formData.ngayKhamBenh)
      );

      // Convert selected time to minutes for comparison
      let selectedTimeMinutes;
      if (formData.gioKhamBenh instanceof Date) {
        selectedTimeMinutes =
          formData.gioKhamBenh.getHours() * 60 +
          formData.gioKhamBenh.getMinutes();
      } else {
        const [hours, minutes] = formData.gioKhamBenh.split(":").map(Number);
        selectedTimeMinutes = hours * 60 + minutes;
      }

      for (const appointment of appointmentsOnSameDay) {
        const [hours, minutes] = appointment.gioKhamBenh.split(":").map(Number);
        const existingTimeMinutes = hours * 60 + minutes;

        if (Math.abs(selectedTimeMinutes - existingTimeMinutes) < 7) {
          showNotification(
            "Thời gian giữa các lịch khám phải cách nhau ít nhất 7 phút!",
            "error"
          );
          return;
        }
      }

      // Format time for submission
      let formattedTime;
      if (formData.gioKhamBenh instanceof Date) {
        formattedTime = `${formData.gioKhamBenh
          .getHours()
          .toString()
          .padStart(2, "0")}:${formData.gioKhamBenh
          .getMinutes()
          .toString()
          .padStart(2, "0")}:00`;
      } else {
        formattedTime = formData.gioKhamBenh.includes(":00")
          ? formData.gioKhamBenh
          : `${formData.gioKhamBenh}:00`;
      }

      const updateData = {
        ...formData,
        gioKhamBenh: formattedTime,
        ngayKhamBenh:
          formData.ngayKhamBenh instanceof Date
            ? formData.ngayKhamBenh.toISOString().split("T")[0]
            : formData.ngayKhamBenh,
        thongtinBenhnhan: {
          hovaTenbenhnhan: formData.tenbenhnhan,
          ngaythangnamsinh:
            formData.ngaythangnamsinh instanceof Date
              ? formData.ngaythangnamsinh.toISOString().split("T")[0]
              : formData.ngaythangnamsinh,
        },
        lichLamViecBacSi: {
          tenphong: selectedRoom,
          calam: shift,
          thongtinBacsi: { tenBacsi: selectedDoctor },
        },
      };

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

      if (response.status === 200) {
        showNotification("Cập nhật thông tin thành công", "success");
        resetForm();
        fetchAppointments();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật lịch khám";
      showNotification(errorMessage, "error");
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
      appointment.hovaTenbenhnhan
        .toLowerCase()
        .includes(searchKeyword.toLowerCase()) ||
      appointment.sdtdangky.includes(searchKeyword) ||
      appointment.phong.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchCreationDate = creationDateFilter
      ? isSameDay(appointment.ngayTaoLich, creationDateFilter)
      : true;

    return matchPatientType && matchKeyword && matchCreationDate;
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
                  label="Họ và tên bệnh nhân"
                  value={formData.tenbenhnhan}
                  onChange={(e) => {
                    const upperCaseValue = e.target.value.toUpperCase();
                    handleInputChange({
                      target: { name: "tenbenhnhan", value: upperCaseValue },
                    });
                  }}
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
                  value={formData.yeuCauDacBiet}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  value={formData.loaiBenhNhan || null}
                  onChange={(event, newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      loaiBenhNhan: newValue || "",
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
              <Grid item xs={6} sm={6} md={4} sx={{ marginLeft: "115px" }}>
                <DateField
                  label="Lọc theo ngày tạo"
                  value={creationDateFilter}
                  onChange={handleCreationDateChange}
                  fullWidth
                  slotProps={{
                    textField: {
                      InputProps: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              size="small"
                              onClick={resetToCurrentDate}
                              sx={{
                                minWidth: "auto",
                              }}
                            >
                              Hôm nay
                            </Button>
                          </InputAdornment>
                        ),
                      },
                    },
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
                  sx={{ boxShadow: 3, height: "633px", overflowY: "auto" }}
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
                              sx={{
                                bgcolor: "#89CFF0",
                              }}
                              size="small"
                              onClick={() => {
                                // Điền thông tin lịch khám vào form để sửa
                                setFormData({
                                  id: appointment.id,
                                  tenbenhnhan: appointment.hovaTenbenhnhan,
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
                            {appointment.hovaTenbenhnhan} {/* Patient's name */}
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
