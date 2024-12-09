import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import logo from "../../assets/logo.png";

const Logo = styled("img")({
  maxWidth: "200px",
  marginBottom: "20px",
});

export default function HeroSection() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "300px",
        backgroundImage: "linear-gradient(to right, #E9F7DD, #DDFBC4,#C7F2A4)",
        textAlign: "center",
        margin: "80px 0 10px 0",
        borderRadius: "15px",
      }}
    >
      <Logo
        src={logo}
        sx={{ borderRadius: "35px" }}
        alt="Logo Bệnh viện Nhi Đồng 2"
      />
      <Typography
        variant="h4"
        component="h1"
        sx={{ color: "#4CAF50", marginBottom: "8px", fontFamily: "Roboto" }}
      >
        BỆNH VIỆN NHI ĐỒNG 2
      </Typography>
      <Typography
        variant="h6"
        component="div"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "'RU Serius', cursive",
          fontSize: "24px",
        }}
      >
        <span style={{ color: "#BC1417", marginRight: "8px" }}>Thân </span>
        <span style={{ color: "#2398D7", marginRight: "8px" }}>thiện </span>
        <span style={{ color: "#0B7D38", marginRight: "8px" }}>như </span>
        <span style={{ color: "#D4631D", marginRight: "8px" }}>chính </span>
        <span style={{ color: "#822478", marginRight: "8px" }}>ngôi </span>
        <span style={{ color: "#670830", marginRight: "8px" }}>nhà </span>
        <span style={{ color: "#D41699", marginRight: "8px" }}>của </span>
        <span style={{ color: "#0D2958", marginRight: "8px" }}>bạn</span>
      </Typography>
    </Box>
  );
}
