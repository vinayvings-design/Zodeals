import React from "react";
import { Box, Button } from "@mui/material";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

const VendorPartnershipButton = () => {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        mt: -10,
        mb: 4 
      }}
    >
      <MotionButton
        variant="contained"
        href="https://partner.zodeals.in"
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          textTransform: "none",
          fontFamily: "poppins",
          fontWeight: "600",
          fontSize: "1.1rem",
          padding: "12px 32px",
          borderRadius: "50px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            backgroundColor: "#e0e0e0",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
          },
        }}
        // Hover animation
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        // Entrance animation
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: [1, 1.02, 1],
          boxShadow: [
            "0 4px 15px rgba(0, 0, 0, 0.2)",
            "0 6px 20px rgba(255, 107, 53, 0.3)",
            "0 4px 15px rgba(0, 0, 0, 0.2)"
          ],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        Merchant Partnership
        {/* Glow effect */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "50px",
            boxShadow: "0 0 20px 10px rgba(255, 107, 53, 0.5)",
            opacity: 0,
            zIndex: -1,
          }}
          component={motion.div}
          animate={{
            opacity: [0, 0.5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        />
      </MotionButton>
    </Box>
  );
};

export default VendorPartnershipButton;