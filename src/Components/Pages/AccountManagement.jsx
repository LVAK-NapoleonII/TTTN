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
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5038/api/Taikhoan/getAll",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAccountList(response.data.data);
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
    // Kiểm tra các điều kiện bắt buộc
    if (!account.tennguoidung) {
      showSnackbar("Vui lòng nhập tên người dùng.", "error");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (isEditing) {
        // Chỉnh sửa tài khoản
        await axios.put(
          `http://localhost:5038/api/Taikhoan/Edit/${account.id}`,
          account,
          config
        );
      } else {
        // Đăng ký tài khoản mới
        await axios.post(
          "http://localhost:5038/api/Taikhoan/register",
          account,
          config
        );
      }

      fetchAccounts(); // Làm mới danh sách tài khoản
      resetForm(); // Đặt lại form
      setIsEditing(false); // Thoát chế độ chỉnh sửa
      showSnackbar(isEditing ? "Cập nhật thành công" : "Đăng ký thành công");
    } catch (error) {
      console.error("Lỗi đăng ký:", error.response?.data || error.message);
      showSnackbar(
        error.response?.data?.message || "Đã xảy ra lỗi khi đăng ký tài khoản",
        "error"
      );
    }
  };
  // Delete an account
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5038/api/Taikhoan/Delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAccounts(); // Làm mới danh sách tài khoản
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Lỗi khi xóa tài khoản",
        "error"
      );
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
                variant="outlined"
                color=""
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
                onClick={handleRegister}
              >
                {isEditing ? "Cập nhật" : "Lưu"}
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
            <Table>
              <TableHead sx={{ bgcolor: "#ADFF2F" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      border: "2px solid  #E1EBEE",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: "2px",
                    }}
                  >
                    Tên người dùng
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
                    Tên tài khoản
                  </TableCell>
                  {/* <TableCell>Mật khẩu</TableCell> */}
                  <TableCell
                    sx={{
                      border: "2px solid  #E1EBEE",
                      textAlign: "center",
                      fontWeight: "bold",
                      p: "2px",
                    }}
                  >
                    Vai trò
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "2px solid  #E1EBEE",
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
                {accountList.map((acc) => (
                  <TableRow key={acc.id}>
                    <TableCell
                      sx={{
                        border: "2px solid  #E1EBEE",
                        textAlign: "center",

                        p: "2px",
                      }}
                    >
                      {acc.tennguoidung}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid  #E1EBEE",
                        textAlign: "center",

                        p: "2px",
                      }}
                    >
                      {acc.sodienthoai}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid  #E1EBEE",
                        textAlign: "center",

                        p: "2px",
                      }}
                    >
                      {acc.tentaiKhoan}
                    </TableCell>
                    {/* <TableCell>{acc.matkhau}</TableCell> */}
                    <TableCell
                      sx={{
                        border: "2px solid  #E1EBEE",
                        textAlign: "center",
                        p: "2px",
                      }}
                    >
                      {acc.vaitro}
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "2px solid  #E1EBEE",
                        textAlign: "center",
                        p: "2px",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color=""
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
                        onClick={() => handleEdit(acc)}
                      >
                        Sửa
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
