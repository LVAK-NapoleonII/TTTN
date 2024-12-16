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
  Button,
  Grid2,
} from "@mui/material";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";

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
      <Grid containe sx={{}}>
        <Grid
          xs={12}
          sx={{ marginLeft: "800px", bgcolor: "#fff", borderRadius: "5px" }}
        >
          <TextField fullWidth label="" type="Date" />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{
          marginTop: 4,
          border: "2px solid #E9F7DD",
          borderRadius: "15px",
          padding: 2,
          margin: 5,
          width: "max-width",
          boxShadow: 1,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(3px)",
          height: "500px",
          overflowY: "auto",
        }}
      >
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: "#E9F7DD" }}>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Dữ liệu ngày</TableCell>
                  <TableCell>số lượng </TableCell>
                  <TableCell>Xử lý</TableCell>
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
                  <TableCell>
                    <Button>
                      <AssignmentReturnedIcon sx={{ color: "black" }} />
                    </Button>
                  </TableCell>
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
