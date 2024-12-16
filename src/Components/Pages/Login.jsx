import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
const LoginForm = () => {
  const [account, setAccount] = useState({
    id: 0,
    tentaiKhoan: "",
    matkhau: "",
    tennguoidung: "Null",
    sodienthoai: "Null",
    vaitro: "NUll",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!account.tentaiKhoan || !account.matkhau) {
      setError("Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.");
      return;
    }
    if (account.matkhau.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5038/api/Taikhoan/login",
        { ...account }
      );

      const { token, Message, userName } = response.data;
      console.log("response", response.data);
      login(token);
      // Lưu token vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userName", userName);
      // Hiển thị thông báo thành công
      setSuccess(Message || "Đăng nhập thành công.");
      setTimeout(() => {
        setLoading(false);
        navigate("/"); // Điều hướng đến trang chính
      }, 1000);
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0][0];
          setError(firstError || "Đã xảy ra lỗi.");
        } else if (errorData.title) {
          setError(errorData.title);
        } else {
          setError("Sai tên tài khoản hoặc mật khẩu.");
        }
      } else {
        setError("Không thể kết nối đến server. Vui lòng thử lại.");
      }
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url("src/assets/pexels-tomfisk-1770818.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        borderRadius: "15px",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 3,
          p: 4,
          width: 300,
          boxShadow: 4,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 2, fontWeight: "bold", color: "#14af55" }}
        >
          Đăng nhập
        </Typography>
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
        <TextField
          label="Tài Khoản"
          type="text"
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={account.tentaiKhoan}
          onChange={(e) =>
            setAccount({ ...account, tentaiKhoan: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={account.matkhau}
          onChange={(e) => setAccount({ ...account, matkhau: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Button
          variant="outlined"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
          sx={{
            color: "white",
            backgroundColor: "#2196f3",
            ":hover": { backgroundColor: "white", color: "#1976d2" },
          }}
        >
          Đăng nhập
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
