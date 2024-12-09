import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TextField,
} from "@mui/material";

const PatientInfoForm = () => {
  return (
    <Box
      sx={{
        padding: 4,
        bgcolor: "#ffffff",
        borderRadius: 2,
        boxShadow: 1,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundImage: `url(src/assets/pexels-tomfisk-1770818.jpg)`,
      }}
    >
      <Grid container>
        <Grid xs={12} sx={{ marginLeft: "800px", bgcolor: "#fff" }}>
          <TextField fullWidth label="" type="Date" />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: "#D8E8F9" }}>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Phòng</TableCell>
                  <TableCell>Giờ khám</TableCell>
                  <TableCell>Tên bệnh nhân</TableCell>
                  <TableCell>Ngày sinh</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Ngày khám</TableCell>
                  <TableCell>Yêu cầu</TableCell>
                  <TableCell>Người chỉnh sửa</TableCell>
                  <TableCell>Ghi chú</TableCell>
                  <TableCell>Xử lý</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Dữ liệu mẫu */}
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Phòng 1</TableCell>
                  <TableCell>08:00</TableCell>
                  <TableCell>Nguyễn Văn A</TableCell>
                  <TableCell>01/01/1990</TableCell>
                  <TableCell>0123456789</TableCell>
                  <TableCell>10/12/2024</TableCell>
                  <TableCell>Khám tổng quát</TableCell>
                  <TableCell>Bệnh nhân mới</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientInfoForm;
