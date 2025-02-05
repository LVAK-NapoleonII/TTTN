import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";

function Footer() {
  return (
    <footer>
      <Box
        sx={{
          backgroundColor: "#F0F4FA",
          py: 4,
          borderTop: "2px solid #14AF55",
          mt: 5,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Thông tin Bệnh viện */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" color="#14AF55" gutterBottom>
                Bệnh viện Nhi Đồng 2
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Địa chỉ: 14 Lý Tự Trọng, P. Bến Nghé, Q.1, TP. Hồ Chí Minh.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Điện thoại: (028) 3829 5723
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Email:{" "}
                <Link href="mailto:info@nhidong2.gov.vn" color="inherit">
                  info@nhidong2.gov.vn
                </Link>
              </Typography>
            </Grid>

            {/* Liên kết nhanh */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" color="#14AF55" gutterBottom>
                Liên kết nhanh
              </Typography>
              <Link
                href="/AppointmentBooking"
                color="inherit"
                variant="body2"
                display="block"
              >
                Đăng ký khám bệnh
              </Link>
              <Link
                href="/Doctorschedule"
                color="inherit"
                variant="body2"
                display="block"
              >
                Lịch khám bác sĩ
              </Link>
            </Grid>

            {/* Điều khoản và Chính sách */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="#14AF55" gutterBottom>
                Điều khoản & Chính sách
              </Typography>
              <Link href="#" color="inherit" variant="body2" display="block">
                Điều khoản sử dụng
              </Link>
              <Link href="#" color="inherit" variant="body2" display="block">
                Chính sách bảo mật
              </Link>
              <Link href="#" color="inherit" variant="body2" display="block">
                Quy định khám chữa bệnh
              </Link>
              <Link href="#" color="inherit" variant="body2" display="block">
                Liên hệ hỗ trợ
              </Link>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
              {"© "}
              {new Date().getFullYear()} Bệnh viện Nhi Đồng 2. Design by ~LVAK~.
            </Typography>
          </Box>
        </Container>
      </Box>
    </footer>
  );
}

export default Footer;
