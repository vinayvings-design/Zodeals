// SignUpPage.js
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  Alert,
  InputBase,
  InputAdornment,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import LoginBackground from "../../assets/images/loginbackground.jpg";
import SigninIcon from "../../assets/images/signinimage.png";
import { hosturl } from "../libs/Constant";
import Colors from "../libs/Colors";

const SignUpPage = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [formMessage, setFormMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setFormMessage("Passwords do not match.");
    }

    try {
      const response = await axios.post(`${hosturl}/user`, {
        name: formData.fullname,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.mobileNumber,
      });

      if (response.status === 201) {
        showSnackbar("User created successfully!", "success");
        setTimeout(() => navigate("/login", { replace: true }), 1000);
      }
    } catch (error) {
      const msg =
        error.response?.data?.displayMessage ||
        "Signup failed. Please check your details.";
      showSnackbar(msg, "error");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? "column" : "row"}
      height="100vh"
      width="100vw"
    >
      <Box
        flex={isMobile ? "none" : 7}
        sx={{
          backgroundImage: `url(${LoginBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: isMobile ? 2 : 4,
        }}
      >
        <Card
          sx={{ width: "90%", maxWidth: 500, borderRadius: 1, boxShadow: 4 }}
        >
          <CardContent>
            <form onSubmit={onSubmit}>
              <Typography variant="h6" textAlign="center" fontWeight="600">
                Create Your Account
              </Typography>

              {/* Full Name */}
              <Typography variant="body2" mt={2} fontWeight="bold">
                Full Name
              </Typography>
              <InputBase
                fullWidth
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  mt: 0.5,
                }}
              />
              <Typography variant="body2" mt={2} fontWeight="bold">
                Mobile Number
              </Typography>
              <InputBase
                fullWidth
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,10}$/.test(val)) {
                    handleChange(e);
                  }
                }}
                inputProps={{ maxLength: 10 }}
                type="tel"
                required
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  mt: 0.5,
                }}
              />
              {/* Email */}
              <Typography variant="body2" mt={2} fontWeight="bold">
                Email Address
              </Typography>
              <InputBase
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  mt: 0.5,
                }}
              />

              {/* Password */}
              <Typography variant="body2" mt={2} fontWeight="bold">
                Password
              </Typography>
              <InputBase
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  mt: 0.5,
                }}
              />

              {/* Confirm Password */}
              <Typography variant="body2" mt={2} fontWeight="bold">
                Confirm Password
              </Typography>
              <InputBase
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  mt: 0.5,
                }}
              />

              {/* Submit */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  backgroundColor: Colors.secondary,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Submit
              </Button>

              {formMessage && (
                <Alert severity={messageType || "info"} sx={{ mt: 2 }}>
                  {formMessage}
                </Alert>
              )}

              <Typography variant="body2" align="center" mt={2}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ color: Colors.primary, fontWeight: "bold" }}
                >
                  Login
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Box
        flex={isMobile ? "none" : 5}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#ffffff"
      >
        <img
          src={SigninIcon}
          alt="Sign In Illustration"
          style={{ width: "100%", maxWidth: "700px", objectFit: "contain" }}
        />
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Box>
  );
};

export default SignUpPage;
