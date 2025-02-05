import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
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
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import axios from "axios";

const DoctorSchedule = () => {
  const [schedule, setSchedule] = useState({
    id: 0,
    ngaybatdau: "",
    ngayketthuc: "",
    tenphong: "",
    calam: "",
    thongtinBacsi: {
      id: 0,
      tenBacsi: "",
    },
  });

  const [suggestions, setSuggestions] = useState({
    doctors: [],
    rooms: [],
  });
  const [selectedWeek, setSelectedWeek] = useState("");
  const [filterWeek, setFilterWeek] = useState("");
  const [scheduleList, setScheduleList] = useState([]);
  const [filteredScheduleList, setFilteredScheduleList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm lấy ngày đầu tuần (thứ 2) từ một ngày bất kỳ
  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  // Hàm lấy ngày cuối tuần (chủ nhật) từ ngày đầu tuần
  const getSunday = (monday) => {
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return sunday;
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Xử lý khi chọn tuần
  const handleWeekChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const monday = getMonday(selectedDate);
    const sunday = getSunday(monday);

    setSelectedWeek(event.target.value);
    setSchedule({
      ...schedule,
      ngaybatdau: formatDate(monday),
      ngayketthuc: formatDate(sunday),
    });
  };

  // Xử lý khi chọn tuần để lọc danh sách
  const handleFilterWeekChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const monday = getMonday(selectedDate);
    const sunday = getSunday(monday);
    setFilterWeek(event.target.value);

    // Lọc danh sách theo tuần đã chọn
    const filtered = scheduleList.filter((sch) => {
      const scheduleDate = new Date(sch.ngaybatdau);
      return scheduleDate >= monday && scheduleDate <= sunday;
    });
    setFilteredScheduleList(filtered);
  };
  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5038/api/Lichlamviecbacsi/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setScheduleList(response.data.data);
      setFilteredScheduleList(response.data.data);
    } catch (error) {
      showSnackbar("Lỗi khi tải danh sách lịch làm việc.", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    fetchSchedules();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5038/api/Lichlamviecbacsi/getFilteredSchedules",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const uniqueDoctors = [
        ...new Set(response.data.data.map((item) => item.tenBacsi)),
      ];
      const uniqueRooms = [
        ...new Set(response.data.data.map((item) => item.tenphong)),
      ];

      setSuggestions({
        doctors: uniqueDoctors,
        rooms: uniqueRooms,
      });
    } catch (error) {
      showSnackbar("Lỗi khi tải dữ liệu gợi ý", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const checkDuplicateSchedule = () => {
    return scheduleList.some(
      (sch) =>
        sch.thongtinBacsi.tenBacsi === schedule.thongtinBacsi.tenBacsi &&
        sch.calam === schedule.calam &&
        sch.tenphong === schedule.tenphong &&
        new Date(sch.ngaybatdau).toDateString() ===
          new Date(schedule.ngaybatdau).toDateString() &&
        sch.id !== schedule.id
    );
  };

  const handleSubmit = async () => {
    if (
      !schedule.thongtinBacsi.tenBacsi ||
      !schedule.tenphong ||
      !schedule.calam ||
      !selectedWeek
    ) {
      showSnackbar("Vui lòng điền đầy đủ thông tin.", "error");
      return;
    }

    if (checkDuplicateSchedule()) {
      showSnackbar("Lịch làm việc này đã tồn tại!", "error");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (isEditing) {
        await axios.put(
          `http://localhost:5038/api/Lichlamviecbacsi/update/${schedule.id}`,
          schedule,
          config
        );
      } else {
        await axios.post(
          "http://localhost:5038/api/Lichlamviecbacsi/create",
          schedule,
          config
        );
      }

      await fetchSchedules();
      resetForm();
      showSnackbar(
        isEditing ? "Cập nhật thành công" : "Thêm lịch làm việc thành công"
      );
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Đã xảy ra lỗi", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5038/api/Lichlamviecbacsi/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSchedules();
      showSnackbar("Xóa lịch làm việc thành công");
    } catch (error) {
      showSnackbar("Lỗi khi xóa lịch làm việc", error);
    }
  };

  const handleEdit = (sch) => {
    const startDate = new Date(sch.ngaybatdau);
    setSelectedWeek(formatDate(startDate));
    setSchedule({
      id: sch.id,
      ngaybatdau: sch.ngaybatdau.split("T")[0],
      ngayketthuc: sch.ngayketthuc.split("T")[0],
      tenphong: sch.tenphong,
      calam: sch.calam,
      thongtinBacsi: sch.thongtinBacsi,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setSchedule({
      id: 0,
      ngaybatdau: "",
      ngayketthuc: "",
      tenphong: "",
      calam: "",
      thongtinBacsi: {
        id: 0,
        tenBacsi: "",
      },
    });
    setSelectedWeek("");
    setIsEditing(false);
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
        Quản lý lịch làm việc bác sĩ
      </Typography>

      <Grid container spacing={1}>
        <Grid
          item
          xs={6}
          sm={3}
          sx={{
            border: "2px solid #E9F7DD",
            padding: 1,
            margin: 5,
            width: "max-width",
            borderRadius: "15px",
            boxShadow: 1,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(3px)",
          }}
        >
          <Box
            sx={{
              padding: 1,
              border: "1px solid #90caf9",
              borderRadius: "15px",
              backgroundSize: "cover",
              bgcolor: "rgba(255, 255, 255)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Autocomplete
              fullWidth
              options={suggestions.doctors}
              value={schedule.thongtinBacsi.tenBacsi}
              onChange={(event, newValue) => {
                setSchedule({
                  ...schedule,
                  thongtinBacsi: {
                    ...schedule.thongtinBacsi,
                    tenBacsi: newValue || "",
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tên bác sĩ"
                  variant="outlined"
                  margin="normal"
                />
              )}
              freeSolo
            />

            <Autocomplete
              fullWidth
              options={suggestions.rooms}
              value={schedule.tenphong}
              onChange={(event, newValue) => {
                setSchedule({
                  ...schedule,
                  tenphong: newValue || "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tên phòng"
                  variant="outlined"
                  margin="normal"
                />
              )}
              freeSolo
            />
            <TextField
              fullWidth
              type="date"
              label="Chọn tuần"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={selectedWeek}
              onChange={handleWeekChange}
              helperText="Chọn bất kỳ ngày nào trong tuần"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Ca làm</InputLabel>
              <Select
                value={schedule.calam}
                onChange={(e) =>
                  setSchedule({ ...schedule, calam: e.target.value })
                }
              >
                <MenuItem value="Ca 0">Ca 0</MenuItem>
                <MenuItem value="Ca 1">Ca 1</MenuItem>
                <MenuItem value="Ca 2">Ca 2</MenuItem>
                <MenuItem value="Ca 3">Ca 3</MenuItem>
                <MenuItem value="Ca 4">Ca 4</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="date"
              label="Chọn tuần để xem lịch"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={filterWeek}
              onChange={handleFilterWeekChange}
              sx={{ bgcolor: "white" }}
            />
            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <Button
                variant="outlined"
                sx={{
                  borderWidth: "2px",
                  backgroundColor: "blue",
                  marginRight: 2,
                  color: "white",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "blue",
                  },
                }}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isEditing ? "Cập nhật" : "Lưu"}
              </Button>
              <Button
                variant="outlined"
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
                onClick={resetForm}
              >
                {isEditing ? "Hủy" : "Xóa"}
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          xs={6}
          sm={7.5}
          sx={{
            border: "2px solid #E9F7DD",
            borderRadius: "15px",
            padding: 2,
            margin: 5,
            width: "max-width",
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
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Table>
                <TableHead sx={{ bgcolor: "#ADFF2F" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        border: "2px solid #E1EBEE",
                        textAlign: "center",
                        fontWeight: "bold",
                        p: "2px",
                      }}
                    >
                      Tên bác sĩ
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid #E1EBEE",
                        textAlign: "center",
                        fontWeight: "bold",
                        p: "2px",
                      }}
                    >
                      Tên phòng
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid #E1EBEE",
                        textAlign: "center",
                        fontWeight: "bold",
                        p: "2px",
                      }}
                    >
                      Ngày bắt đầu
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid #E1EBEE",
                        textAlign: "center",
                        fontWeight: "bold",
                        p: "2px",
                      }}
                    >
                      Ngày kết thúc
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid #E1EBEE",
                        textAlign: "center",
                        fontWeight: "bold",
                        p: "2px",
                      }}
                    >
                      Ca làm
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid #E1EBEE",
                        textAlign: "center",
                        fontWeight: "bold",
                        p: "2px",
                      }}
                    >
                      Hành động
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredScheduleList.map((sch) => (
                    <TableRow key={sch.id}>
                      <TableCell
                        sx={{
                          border: "2px solid #E1EBEE",
                          textAlign: "center",
                          p: "2px",
                        }}
                      >
                        {sch.thongtinBacsi.tenBacsi}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid #E1EBEE",
                          textAlign: "center",
                          p: "2px",
                        }}
                      >
                        {sch.tenphong}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid #E1EBEE",
                          textAlign: "center",
                          p: "2px",
                        }}
                      >
                        {new Date(sch.ngaybatdau).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid #E1EBEE",
                          textAlign: "center",
                          p: "2px",
                        }}
                      >
                        {new Date(sch.ngayketthuc).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid #E1EBEE",
                          textAlign: "center",
                          p: "2px",
                        }}
                      >
                        {sch.calam}
                      </TableCell>
                      <TableCell
                        sx={{
                          border: "2px solid #E1EBEE",
                          textAlign: "center",
                          p: "2px",
                        }}
                      >
                        <Button
                          variant="outlined"
                          sx={{
                            borderWidth: "2px",
                            backgroundColor: "blue",
                            marginRight: 2,
                            color: "white",
                            "&:hover": {
                              backgroundColor: "white",
                              color: "blue",
                            },
                          }}
                          onClick={() => handleEdit(sch)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="outlined"
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
                          onClick={() => handleDelete(sch.id)}
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorSchedule;
