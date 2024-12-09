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
} from "@mui/material";
import axios from "axios";

const AccountManagement = () => {
  const [account, setAccount] = useState({
    id: 0,
    tentaiKhoan: "",
    matkhau: "",
    tennguoidung: "",
    sodienthoai: "",
    vaitro: "",
  });
  const [accountList, setAccountList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5038/api/Taikhoan/getAll"
      );
      setAccountList(response.data);
    } catch (error) {
      showSnackbar("Lỗi khi tải danh sách tài khoản.", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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

  const handleRegister = async () => {
    if (!account.tennguoidung) {
      showSnackbar("Vui lòng nhập tên người dùng.", "error");
      return;
    }

    if (!account.sodienthoai) {
      showSnackbar("Vui lòng nhập số điện thoại.", "error");
      return;
    }

    if (!account.tentaiKhoan) {
      showSnackbar("Vui lòng nhập tên tài khoản.", "error");
      return;
    }
    if (!account.vaitro) {
      showSnackbar("Vui lòng chọn vai trò.", "error");
      return;
    }
    try {
      if (isEditing) {
        // Nếu đang ở chế độ chỉnh sửa
        await axios.put(
          `http://localhost:5038/api/Taikhoan/Edit/${account.id}`,
          {
            ...account,
          }
        );
      } else {
        // Nếu đang ở chế độ thêm mới
        await axios.post("http://localhost:5038/api/Taikhoan/register", {
          ...account,
        });
      }

      fetchAccounts(); // Làm mới danh sách tài khoản
      resetForm(); // Đặt lại form
      setIsEditing(false); // Thoát chế độ chỉnh sửa
    } catch (error) {
      console.error(error.response?.data || "Đã xảy ra lỗi.");
    }
  };

  // Delete an account
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5038/api/Taikhoan/Delete/${id}`);
      fetchAccounts(); // Refresh the account list
    } catch (error) {
      showSnackbar(error.response?.data || "Lỗi khi xóa tài khoản.", error);
    }
  };
  const handleEdit = (acc) => {
    // Điền thông tin tài khoản vào form để chỉnh sửa
    setAccount({
      id: acc.id,
      tentaiKhoan: acc.tentaiKhoan,
      matkhau: "", // Để trống mật khẩu để người dùng nhập lại nếu muốn
      tennguoidung: acc.tennguoidung,
      sodienthoai: acc.sodienthoai,
      vaitro: acc.vaitro,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setAccount({
      id: 0,
      tentaiKhoan: "",
      matkhau: "",
      tennguoidung: "",
      sodienthoai: "",
      vaitro: "",
    });
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
        Quản lý tài khoản
      </Typography>

      <Grid container spacing={1}>
        {/* Form Nhập Liệu */}
        <Grid
          item
          spacing={3}
          xs={12}
          sm={5}
          sx={{
            border: "2px solid #E9F7DD",
            padding: 1,
            margin: "8px 32px 0 50px",
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
              marginLeft: "8px",
              backgroundSize: "cover",
              bgcolor: "rgba(255, 255, 255)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            <TextField
              fullWidth
              label="Tên người dùng"
              variant="outlined"
              margin="normal"
              value={account.tennguoidung}
              onChange={(e) =>
                setAccount({ ...account, tennguoidung: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              variant="outlined"
              margin="normal"
              value={account.sodienthoai}
              onChange={(e) =>
                setAccount({ ...account, sodienthoai: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Tên tài khoản"
              variant="outlined"
              margin="normal"
              value={account.tentaiKhoan}
              onChange={(e) =>
                setAccount({ ...account, tentaiKhoan: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              variant="outlined"
              margin="normal"
              type="password"
              value={account.matkhauatKhau}
              onChange={(e) =>
                setAccount({ ...account, matKhau: e.target.value })
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={account.vaitro}
                onChange={(e) =>
                  setAccount({ ...account, vaitro: e.target.value })
                }
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Bác sĩ">Bác sĩ</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "blue",
                  marginRight: 2,
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkblue",
                  },
                }}
                onClick={handleRegister}
              >
                {isEditing ? "Cập nhật" : "Lưu"}
              </Button>
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkred",
                  },
                }}
                onClick={resetForm}
              >
                {isEditing ? "Hủy" : "Xóa"}
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Bảng Danh Sách Tài Khoản */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            border: "2px solid #E9F7DD",
            borderRadius: 2,
            padding: 2,
            margin: 1,
            width: "max-width",
            boxShadow: 1,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(3px)",
          }}
        >
          <TableContainer component={Paper} sx={{ marginLeft: "8px" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#E9F7DD" }}>
                <TableRow>
                  <TableCell>Tên người dùng</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Tên tài khoản</TableCell>
                  {/* <TableCell>Mật khẩu</TableCell> */}
                  <TableCell>Vai trò</TableCell>
                  <TableCell sx={{ marginRight: 2 }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accountList.map((acc) => (
                  <TableRow key={acc.id}>
                    <TableCell>{acc.tennguoidung}</TableCell>
                    <TableCell>{acc.sodienthoai}</TableCell>
                    <TableCell>{acc.tentaiKhoan}</TableCell>
                    {/* <TableCell>{acc.matkhau}</TableCell> */}
                    <TableCell>{acc.vaitro}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "blue",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "darkblue",
                          },
                          marginRight: 1,
                        }}
                        onClick={() => handleEdit(acc)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "red",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "darkred",
                          },
                        }}
                        onClick={() => handleDelete(acc.id)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

export default AccountManagement;
