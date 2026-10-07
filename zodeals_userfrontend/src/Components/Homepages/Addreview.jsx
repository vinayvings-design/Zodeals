import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating
} from "@mui/material";
import { hosturl } from "../libs/Constant";
import SignInRequiredPrompt from "../authentications/SigninOverlay";

export default function Addreview() {
  const [form, setForm] = useState({ review: "", rating: 0 });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: "", severity: "success" });
  const [openSignInDialog, setOpenSignInDialog] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (_, newValue) => {
    setForm({ ...form, rating: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setOpenSignInDialog(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${hosturl}/testimonial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review: form.review,
          rating: form.rating,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit testimonial");

      setFeedback({ open: true, message: "Review submitted successfully", severity: "success" });
      setForm({ review: "", rating: 0 });
    } catch (error) {
      setFeedback({ open: true, message: error.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Typography fontFamily="poppins" fontWeight="600" fontSize="17px" mb={1}>
        Add your Review
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
        <Typography color="#fff" mb={1}>Rating</Typography>
      <Rating
            name="rating"
            value={form.rating}
            onChange={handleRatingChange}
            size="large"
            sx={{
                mb: 2,
                color: "gold", // color of filled stars
                '& .MuiRating-iconEmpty': {
                color: "rgba(255, 255, 255, 0.7)", // color of empty star borders
                },
            }}
            />

        <TextField
          name="review"
          value={form.review}
          onChange={handleChange}
          variant="outlined"
          size="small"
          fullWidth
          label="Add your review"
          multiline
          rows={4}
          sx={textFieldStyle}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            textTransform: "none",fontFamily:'poppins',
            fontWeight: "500",
            width: "100%",
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Box>

      {/* Feedback Snackbar */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={() => setFeedback({ ...feedback, open: false })}
      >
        <Alert
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.severity}
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>

      {/* Sign-In Dialog */}
      <Dialog
        open={openSignInDialog}
        onClose={() => setOpenSignInDialog(false)}
        fullWidth
        maxWidth="xs"
      >
            {openSignInDialog && (
            <SignInRequiredPrompt onClose={() => setOpenSignInDialog(false)} />
            )}
      </Dialog>
    </Grid>
  );
}

const textFieldStyle = {
  mb: 2,
  textarea: { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#4a647c" },
    "&:hover fieldset": { borderColor: "#cbd5e1" },
    "&.Mui-focused fieldset": { borderColor: "#cbd5e1" },
  },
  "& label": { color: "#b0bec5" },
  "& label.Mui-focused": { color: "#cbd5e1" },
};
