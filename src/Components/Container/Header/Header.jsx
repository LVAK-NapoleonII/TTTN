import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import logo from "../../../assets/logo.png";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { useAuth } from "../../AuthContext.jsx";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

// Styled components for better customization
const Logo = styled("img")({
  maxWidth: "70px",
  borderRadius: "50%",
  marginRight: "10px",
});

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#f0f4f8",
  boxShadow: "none",
});

const MenuButton = styled(Button)({
  color: "#14AF55",
  fontWeight: "bold",
  textTransform: "none",
  borderRadius: "20px",
  marginLeft: "15px",
  "&:hover": {
    backgroundImage: "linear-gradient(to right, #E9F7DD, #DDFBC4,#C7F2A4)",
  },
});

const AvatarIcon = styled(Avatar)({
  backgroundColor: "#14AF55",
  fontSize: "1.2rem",
});

const Header = () => {
  const { auth, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
  };
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        width: "99%",
        zIndex: 1100,
        bgcolor: "white",
        boxShadow: 1,
        borderRadius: "15px",
      }}
    >
      <StyledAppBar
        position="static"
        sx={{
          borderRadius: "15px 15px 15px 15px",
          width: "max-width",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", padding: "0 20px" }}>
          <Typography
            variant="h6"
            component={Link}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
              fontWeight: "bold",
              fontFamily: "'Roboto', sans-serif",
              borderColor: "#D8D2FC",
              borderRadius: "50px 50px 50px 50px",
              textDecoration: "none",
              border: "1px ",
              backgroundImage:
                "linear-gradient(to right, #E9F7DD, #DDFBC4,#C7F2A4)",
            }}
            to="/"
          >
            <Logo src={logo} alt="Logo Bệnh viện Nhi Đồng 2" />
            <Box
              sx={{
                fontFamily: "Roboto",
                color: "#14AF55",
                fontWeight: "bold",
                marginRight: "15px",
              }}
            >
              Đặt lịch khám bệnh - BVND 2
            </Box>
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginRight: "150px",
              gap: 1,
            }}
          >
            <MenuButton component={Link} to="/AppointmentBooking">
              <AppRegistrationIcon sx={{ marginRight: "5px" }} /> Đăng ký lịch
              khám
            </MenuButton>
            <MenuButton component={Link} to="/Exportexcel">
              <ExitToAppIcon sx={{ marginRight: "5px" }} /> Xuất file excel
            </MenuButton>{" "}
            {auth?.user?.role === "Admin" && (
              <MenuButton component={Link} to="/Statistics">
                <AssessmentIcon sx={{ marginRight: "5px" }} />
                Thống kê
              </MenuButton>
            )}
            <MenuButton component={Link} to="/Doctorschedule">
              <AssignmentIndIcon sx={{ marginRight: "5px" }} />
              Lịch làm việc bác sĩ
            </MenuButton>
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  minWidth: 100,
                  color: "#14AF55",
                  fontWeight: "bold",
                  fontFamily: "'Roboto', sans-serif",
                  p: "6px 8px",
                  justifyContent: "center",
                  display: "flex",
                  gap: 1,
                  borderRadius: "20px",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(to right, #E9F7DD, #DDFBC4,#C7F2A4)",
                  },
                  textDecoration: "none",
                }}
                component={Link}
                to="/SMSNotification"
              >
                <ContactPhoneIcon /> Liên hệ
              </Typography>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <AvatarIcon>
                    {auth?.user?.name
                      ? auth.user.name.charAt(0).toUpperCase()
                      : "?"}
                  </AvatarIcon>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                  mt: 1.5,
                  backgroundColor: "#f9f9f9", // Soft light background
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {auth?.user?.role === "Admin" && (
                <MenuItem component={Link} to="/AccountManagement">
                  <ListItemIcon>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  Quản lý tài khoản
                </MenuItem>
              )}
              {!auth?.user && (
                <MenuItem onClick={handleClose} component={Link} to="/Login">
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Đăng nhập
                </MenuItem>
              )}{" "}
              {auth?.user && (
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Đăng xuất
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
};

export default Header;
