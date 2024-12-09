import React from "react";
import { Container, Grid, Typography, Link } from "@mui/material";

function Footer() {
  return (
    <footer>
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary" align="center">
              {"~LVAK~ "}
              {new Date().getFullYear()}
              {"."}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="textSecondary" align="center">
              <Link color="inherit" href="#">
                Điều khoản sử dụng
              </Link>
              {" | "}
              <Link color="inherit" href="#">
                Chính sách bảo mật
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}

export default Footer;
