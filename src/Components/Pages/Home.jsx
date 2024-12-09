import React, { useState, useEffect } from "react";
import { Box, Typography, Alert, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function Home() {
  const backgroundImage = "src/assets/pexels-tomfisk-1770818.jpg";
  const sections = [
    {
      title: "SỨ MẠNG",
      content:
        "Xây dựng bệnh viện hiện đại, thân thiện, đảm bảo cung cấp dịch vụ chăm sóc sức khỏe hiệu quả, an toàn và chất lượng dựa trên y học chứng cứ.",
    },
    {
      title: "TẦM NHÌN",
      content:
        "Trở thành bệnh viện có tất cả các chuyên khoa về Nhi với chất lượng hàng đầu Việt Nam và trong khu vực.",
    },
    {
      title: "CAM KẾT THỰC HIỆN",
      content:
        "Không ngừng nâng cao chất lượng khám và điều trị, đồng thời đáp ứng tốt nhất các nhu cầu cần thiết của bệnh nhân và thân nhân bệnh nhân theo pháp luật và quy trình hiện hành.",
    },
  ];

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px",
        borderRadius: "20px",
      }}
    >
      {sections.map((section, index) => (
        <Paper
          key={index}
          elevation={6}
          sx={{
            width: { xs: "90%", md: "60%" },
            padding: "20px",
            marginBottom: "40px",
            borderRadius: "16px",
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(3px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#C7F2A4",
              marginBottom: "10px",
            }}
          >
            {section.title}
          </Typography>
          <Typography variant="body1" sx={{ color: "#fff" }}>
            {section.content}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
