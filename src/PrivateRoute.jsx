import React from'react';import{Navigate}from'react-router-dom';

const PrivateRoute=(props)=>{const userRole=localStorage.getItem('userRole');const userName=localStorage.getItem('userName');

// Nếu không có thông tin đăng nhập, chuyển về trang Login
if(!userRole||!userName){return<Navigate to="/Login"replace/>;}

// Nếu có requiredRoles, kiểm tra vai trò
if(props.requiredRoles&&props.requiredRoles.length>0&&!props.requiredRoles.includes(userRole)){
// Chuyển về trang không có quyền hoặc trang chính
return<Navigate to="/"replace/>;}

return props.children;};

export default PrivateRoute;