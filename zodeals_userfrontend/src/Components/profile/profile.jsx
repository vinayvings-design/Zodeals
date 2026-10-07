import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { PhotoCamera, Edit, Save, Cancel, Grade } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../Homepages/footerpage";
import Header from "../MainPage/Header";
import { hosturl } from "../libs/Constant";
import ProtectedRoute from "../ProtectedComponent/protected";

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    profile: "",
    phoneNumber: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const axiosInstance = axios.create({
    baseURL: hosturl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!token || role !== "user") {
      setUserNotFound(true);
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/profile");
        const data = res.data?.result;
        if (data && data._id) {
          setProfileData({
            name: data.name || "",
            email: data.email || "",
            profile: data.profile || "",
            phoneNumber: data.phoneNumber || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setProfileData({ ...profileData, profile: URL.createObjectURL(file) });
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setLoading(true);
    axiosInstance.get("/profile").then((res) => {
      const data = res.data?.result;
      if (data && data._id) {
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          profile: data.profile || "",
          phoneNumber: data.phoneNumber || "",
        });
      }
      setImageFile(null);
      setEditMode(false);
      setLoading(false);
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    formData.append("phoneNumber", profileData.phoneNumber);
    if (imageFile) {
      formData.append("profile", imageFile);
    }
    try {                  
      await axiosInstance.patch("/user", formData);

      const res = await axiosInstance.get("/profile");
      const data = res.data?.result;
      if (data && data._id) {
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          profile: data.profile || "",
          phoneNumber: data.phoneNumber || "",  
        });
      }

      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });

      setEditMode(false);
      setImageFile(null);
    } catch (error) {
      console.error("Update error:", error);
      setSnackbar({
        open: true,
        message: "User Logged out! Please login.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (userNotFound) {
    return <ProtectedRoute />;
  }

  return (
    <>
      <Header showTabs={true} />

      <Container maxWidth="md" sx={{ mt: 10, pb: 10 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography
              variant="h5"
              fontWeight="700"
              fontFamily="Poppins"
              color="primary.main"
            >
              Profile
            </Typography>

            {!editMode ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleEditClick}
                color="primary"
              >
                Edit
              </Button>
            ) : (
              <Box>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSubmit}
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancelClick}
                  color="error"
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box position="relative" textAlign="center">
                <Avatar
                  alt="Profile"
                  src={
                    imageFile
                      ? profileData.profile
                      : profileData.profile
                      ? `${hosturl}${profileData.profile}`
                      : ""
                  }
                  sx={{
                    width: 140,
                    height: 140,
                    margin: "auto",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  }}
                  imgProps={{ crossOrigin: "anonymous" }}
                >
                  {!profileData.profile && <PhotoCamera fontSize="large" />}
                </Avatar>

                {editMode && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      id="profile-upload"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <label htmlFor="profile-upload">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: "calc(50% - 20px)",
                          backgroundColor: "background.paper",
                          boxShadow: 1,
                          "&:hover": { backgroundColor: "primary.light" },
                        }}
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant={editMode ? "outlined" : "filled"}
                    sx={{
                      backgroundColor: editMode ? "inherit" : "#f5f5f5",
                      borderRadius: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    variant={editMode ? "outlined" : "filled"}
                    sx={{
                      backgroundColor: editMode ? "inherit" : "#f5f5f5",
                      borderRadius: 1,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                 
                  <TextField
                    fullWidth
                    name="phoneNumber"
                    label="Mobile Number"
                    value={profileData.phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d{0,10}$/.test(val)) {
                        handleInputChange(e);
                      }
                    }}
                    disabled={!editMode}
                    variant={editMode ? "outlined" : "filled"}
                    inputProps={{
                      maxLength: 10,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    placeholder="Enter 10-digit mobile number"
                    sx={{
                      backgroundColor: editMode ? "inherit" : "#f5f5f5",
                      borderRadius: 1,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Footer />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
