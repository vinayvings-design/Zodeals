import React, { useState, useEffect } from "react";
import {
  Box, Button, Typography, useMediaQuery, IconButton,
  InputBase, Modal, Alert, Snackbar, Divider,
} from "@mui/material";
import { Eye, EyeOff, X, Mail, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/zodealsLogo.png";
import SigninIcon from "../../assets/images/signinimage.png";
import { hosturl } from "../libs/Constant";
import { useModal } from "../../context/ModalContext";
import axios from "axios";

// ── Field wrapper ──
const Field = ({ label, icon: Icon, children }) => (
  <Box mb={2.2}>
    <Typography
      fontSize={13} fontWeight={600} color="#374151"
      fontFamily="Inter, sans-serif" mb={0.7}
    >
      {label}
    </Typography>
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1,
      border: '1.5px solid #E8ECF4', borderRadius: '12px',
      px: 1.6, py: 1, backgroundColor: '#FAFBFD',
      transition: 'all 0.22s',
      '&:focus-within': {
        backgroundColor: '#fff',
        borderColor: '#FF6B35',
        boxShadow: '0 0 0 3px rgba(255,107,53,0.1)',
      },
    }}>
      {Icon && <Icon size={15} color="#9CA3AF" />}
      {children}
    </Box>
  </Box>
);

const LoginForm = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const { setIsLogiden } = useModal();
  const navigate = useNavigate();
  const [openForgotModal, setOpenForgotModal] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const showSnackbar = (message, severity = "info") => setSnackbar({ open: true, message, severity });
  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`${hosturl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password, role: "user" }),
      });
      const data = await r.json();
      if (data.status) {
        localStorage.setItem("token", data.result.token);
        localStorage.setItem("role", data.result.role);
        setIsLogiden(true);
        showSnackbar("Login successful", "success");
        navigate("/");
      } else {
        showSnackbar("Invalid email or password", "error");
      }
    } catch { showSnackbar("Invalid email or password", "error"); }
  };

  return (
    <Box display="flex" flexDirection={isMobile ? "column" : "row"} minHeight="100vh" bgcolor="#F5F7FA">
      {/* ── LEFT: Brand panel ── */}
      {!isMobile && (
        <Box flex={6} sx={{
          background: 'linear-gradient(160deg, #0F1B35 0%, #1a2d5a 50%, #0F1B35 100%)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', alignItems: 'center', p: 5,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative blobs */}
          <Box sx={{
            position: 'absolute', top: -100, right: -100,
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', bottom: -60, left: -60,
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <Box alignSelf="flex-start" sx={{ position: 'relative', zIndex: 1 }}>
            <img src={Logo} alt="ZoDeals" height={44}
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.92 }} />
          </Box>

          <Box textAlign="center" sx={{ position: 'relative', zIndex: 1 }}>
            {/* Trust badge */}
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.8,
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 50, px: 1.6, py: 0.7, mb: 2.5,
            }}>
              <Sparkles size={13} color="#FFD60A" />
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', letterSpacing: 0.5 }}>
                TRUSTED BY THOUSANDS
              </Typography>
            </Box>

            <Typography sx={{
              color: '#fff', fontFamily: 'Inter, sans-serif',
              fontWeight: 900, fontSize: '2.4rem', mb: 1.5, lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}>
              Save More.<br />
              <Box component="span" sx={{
                color: '#FF6B35',
                borderBottom: '3px solid #FF6B35', pb: 0.3,
              }}>
                Shop Smart.
              </Box>
            </Typography>
            <Typography sx={{
              color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif', fontSize: 15, lineHeight: 1.6,
            }}>
              Verified coupons &amp; exclusive deals<br />from 500+ top brands.
            </Typography>
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <img src={SigninIcon} alt="Sign In"
              style={{ width: '72%', maxWidth: 340, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
          </Box>
        </Box>
      )}

      {/* ── RIGHT: Form ── */}
      <Box
        flex={isMobile ? 1 : 4}
        display="flex" justifyContent="center" alignItems="center"
        bgcolor="#fff" p={isMobile ? 3 : 5}
      >
        <Box width="100%" maxWidth={400}>
          {isMobile && (
            <Box mb={4} textAlign="center">
              <img src={Logo} alt="ZoDeals" height={42} style={{ display: 'inline-block' }} />
            </Box>
          )}

          {/* Heading */}
          <Box mb={0.6}>
            <Typography variant="h5" fontWeight={900} color="#0F1B35"
              fontFamily="Inter, sans-serif" fontSize="1.6rem" letterSpacing="-0.02em">
              Welcome Back 👋
            </Typography>
          </Box>
          <Typography fontSize={14} color="#6B7280" fontFamily="Inter, sans-serif" mb={3.5} lineHeight={1.6}>
            Login to your ZoDeals account to access exclusive deals.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Field label="Email Address" icon={Mail}>
              <InputBase
                name="email" type="email" value={formData.email} onChange={handleChange}
                required placeholder="Enter your email"
                sx={{ flex: 1, fontSize: 14, fontFamily: 'Inter, sans-serif' }}
              />
            </Field>

            <Field label="Password" icon={Lock}>
              <InputBase
                name="password" type={showPassword ? "text" : "password"}
                value={formData.password} onChange={handleChange}
                required placeholder="Enter your password"
                sx={{ flex: 1, fontSize: 14, fontFamily: 'Inter, sans-serif' }}
              />
              <IconButton onClick={() => setShowPassword(p => !p)} size="small" sx={{ p: 0.3 }}>
                {showPassword
                  ? <EyeOff size={15} color="#9CA3AF" />
                  : <Eye size={15} color="#9CA3AF" />}
              </IconButton>
            </Field>

            <Box textAlign="right" mb={3}>
              <Typography
                onClick={() => setOpenForgotModal(true)}
                sx={{
                  fontSize: 13, color: '#FF6B35', cursor: 'pointer',
                  fontWeight: 700, fontFamily: 'Inter, sans-serif',
                  display: 'inline',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot Password?
              </Typography>
            </Box>

            <Button
              type="submit" variant="contained" fullWidth
              sx={{
                height: 50, fontFamily: 'Inter, sans-serif',
                fontWeight: 800, fontSize: 15, textTransform: 'none',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF6B35, #e63946)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e55a26, #c62a35)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 24px rgba(255,107,53,0.4)',
                },
                transition: 'all 0.25s ease',
                boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
              }}
            >
              Login to ZoDeals
            </Button>

            {/* Trust indicator */}
            <Box display="flex" alignItems="center" justifyContent="center" gap={0.6} mt={2}>
              <ShieldCheck size={13} color="#10B981" />
              <Typography fontSize={11.5} color="#6B7280" fontFamily="Inter, sans-serif">
                Secured with 256-bit SSL encryption
              </Typography>
            </Box>

            <Divider sx={{ my: 2.5 }}>
              <Typography fontSize={12} color="#D1D5DB" fontFamily="Inter, sans-serif">OR</Typography>
            </Divider>

            <Typography variant="body2" textAlign="center" fontFamily="Inter, sans-serif" color="#6B7280">
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: '#FF6B35', fontWeight: 800, textDecoration: 'none' }}>
                Sign up free
              </Link>
            </Typography>
          </form>
        </Box>
      </Box>

      <ForgotPasswordModal open={openForgotModal} handleClose={() => setOpenForgotModal(false)} />
      <Snackbar
        open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar(p => ({ ...p, open: false }))}
          severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;

// ── Forgot Password Modal ──
const ForgotPasswordModal = ({ open, handleClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    if (!open) { setStep(1); setEmail(""); setOtp(""); setNewPassword(""); setConfirmPassword(""); setUserId(null); }
  }, [open]);

  const showSnackbar = (message, severity = "info") => setSnackbar({ open: true, message, severity });

  const inputSx = {
    display: 'flex', alignItems: 'center', gap: 1,
    border: '1.5px solid #E8ECF4', borderRadius: '12px',
    px: 1.6, py: 1, mb: 2, backgroundColor: '#FAFBFD',
    '&:focus-within': { borderColor: '#FF6B35', boxShadow: '0 0 0 3px rgba(255,107,53,0.1)' },
  };

  const btnSx = {
    background: 'linear-gradient(135deg, #FF6B35, #e63946)',
    color: '#fff', textTransform: 'none',
    fontFamily: 'Inter, sans-serif', fontWeight: 800,
    py: 1.3, borderRadius: '12px',
    '&:hover': {
      background: 'linear-gradient(135deg, #e55a26, #c62a35)',
      boxShadow: '0 6px 20px rgba(255,107,53,0.35)',
    },
    transition: 'all 0.22s',
  };

  const handleSendOtp = async () => {
    try {
      const r = await axios.post(`${hosturl}/email/code`, { email, tag: "password", role: "user" }, { headers: { "Content-Type": "application/json" } });
      if (r.data?.status) { showSnackbar("OTP sent to your email", "success"); setStep(2); }
      else showSnackbar(r.data?.displayMessage || "Error sending OTP", "error");
    } catch (err) { showSnackbar(err.response?.data?.displayMessage || "Error sending OTP", "error"); }
  };

  const handleVerifyOtp = async () => {
    try {
      const r = await axios.post(`${hosturl}/email/verify`, { email, code: Number(otp), tag: "password" });
      if (r.data?.status) { setUserId(r.data.result); showSnackbar("OTP verified!", "success"); setStep(3); }
      else showSnackbar(r.data?.displayMessage || "Invalid OTP", "error");
    } catch (err) { showSnackbar(err.response?.data?.displayMessage || "Error verifying OTP", "error"); }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) return showSnackbar("Passwords don't match", "warning");
    if (!userId) return showSnackbar("User verification missing", "error");
    try {
      const r = await axios.post(`${hosturl}/forgot/password`, { userId, password: newPassword });
      if (r.data?.status) { showSnackbar("Password reset successfully", "success"); handleClose(); }
      else showSnackbar(r.data?.displayMessage || "Failed to reset", "error");
    } catch (err) { showSnackbar(err.response?.data?.displayMessage || "Error resetting password", "error"); }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          width: 400, bgcolor: "#fff", p: 4, borderRadius: '20px',
          mx: "auto", mt: "15vh", position: "relative",
          boxShadow: '0 24px 64px rgba(15,27,53,0.18)',
        }}>
          <IconButton onClick={handleClose} sx={{ position: "absolute", top: 12, right: 12, borderRadius: '8px', p: 0.6 }}>
            <X size={16} color="#6B7280" />
          </IconButton>
          <Typography variant="h6" fontWeight={800} fontFamily="Inter, sans-serif" color="#0F1B35" mb={0.5} letterSpacing="-0.01em">
            Reset Password
          </Typography>
          <Divider sx={{ mb: 2.5 }} />

          {step === 1 && (<>
            <Typography fontSize={13} mb={1.5} color="#6B7280" fontFamily="Inter, sans-serif">Enter your registered email address</Typography>
            <Box sx={inputSx}><Mail size={14} color="#9CA3AF" /><InputBase fullWidth placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} sx={{ fontSize: 14, fontFamily: 'Inter, sans-serif' }} /></Box>
            <Button variant="contained" fullWidth onClick={handleSendOtp} sx={btnSx}>Send OTP</Button>
          </>)}
          {step === 2 && (<>
            <Typography fontSize={13} mb={1.5} color="#6B7280" fontFamily="Inter, sans-serif">Enter the 6-digit OTP sent to your email</Typography>
            <Box sx={inputSx}><InputBase fullWidth placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} sx={{ fontSize: 14, fontFamily: 'Inter, sans-serif', letterSpacing: 4, fontWeight: 700 }} /></Box>
            <Button variant="contained" fullWidth onClick={handleVerifyOtp} sx={btnSx}>Verify OTP</Button>
          </>)}
          {step === 3 && (<>
            <Typography fontSize={13} mb={1.5} color="#6B7280" fontFamily="Inter, sans-serif">Create a new password</Typography>
            <Box sx={inputSx}><Lock size={14} color="#9CA3AF" /><InputBase fullWidth placeholder="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} sx={{ fontSize: 14, fontFamily: 'Inter, sans-serif' }} /></Box>
            <Box sx={{ ...inputSx, mb: 2 }}><Lock size={14} color="#9CA3AF" /><InputBase fullWidth placeholder="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} sx={{ fontSize: 14, fontFamily: 'Inter, sans-serif' }} /></Box>
            <Button variant="contained" fullWidth onClick={handleResetPassword} sx={btnSx}>Reset Password</Button>
          </>)}
        </Box>
      </Modal>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar(p => ({ ...p, open: false }))} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};
