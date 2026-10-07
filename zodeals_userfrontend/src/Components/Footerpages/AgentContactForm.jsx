import React, { useState } from "react";
import {
    Container,
    Button,
    Card,
    Typography,
    Alert,
    Snackbar,
    CircularProgress,
    Grid,
    TextField,
    Box,
} from "@mui/material";
import axios from "axios";
import { hosturl } from "../libs/Constant";
import Header from "../MainPage/Header";
import Footer from "../Homepages/footerpage";

const AgentContactForm = () => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        pan: "",
        address: "",
        city: "",
        pincode: "",
        upi: "",
        reference: "",
        phoneNumber: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const response = await axios.post(
                `${hosturl}/admin/agent`,
                formData
            );
            setSuccess(
                response?.data?.displayMessage || "Agent Created Successfully"
            );
            setFormData({
                name: "",
                email: "",
                pan: "",
                address: "",
                city: "",
                pincode: "",
                upi: "",
                reference: "",
                phoneNumber: "",
            });
        } catch (err) {
            setError(
                err?.response?.data?.displayMessage ||
                err?.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Container sx={{ mt: 5, px: 5, mb: 10 }}>
                <Card sx={{ p: 4, borderRadius: 3, maxWidth: 900, mx: "auto" }}>
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        mb={3}
                        textAlign="center"
                    >
                        Become an Agent
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {[
                                { label: "Name", name: "name", required: true },
                                { label: "Email", name: "email", type: "email", required: true },
                                { label: "Phone Number", name: "phoneNumber", required: true, max_length: 10 },
                                { label: "PAN", name: "pan" },
                                { label: "Address", name: "address" },
                                { label: "City", name: "city" },
                                { label: "Pincode", name: "pincode" },
                                { label: "UPI", name: "upi" },
                                { label: "Reference", name: "reference" },
                            ].map((field) => (
                                <Grid item size={{ xs: 12, md: 6 }} key={field.name}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label={field.label}
                                        name={field.name}
                                        type={field.type || "text"}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        required={field.required || false}
                                        inputProps={{
                                            maxLength: field.max_length || undefined,
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Box textAlign="center">
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading}
                                sx={{
                                    mt: 4,
                                    px: 6,
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    borderRadius: 2,
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </Box>
                    </form>
                </Card>
            </Container>

            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={() => setError("")}
            >
                <Alert severity="error" variant="filled">
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!success}
                autoHideDuration={3000}
                onClose={() => setSuccess("")}
            >
                <Alert severity="success" variant="filled">
                    {success}
                </Alert>
            </Snackbar>
            <Footer/>
        </>
    );
};

export default AgentContactForm;
