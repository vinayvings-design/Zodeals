import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Container,
  Menu,
  Button,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import axios from "axios";
import { hosturl } from "../libs/Constant";
import { useNavigate } from "react-router-dom";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const AllStoresPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState("All");
  const [storeLogos, setStoreLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const pincode = localStorage.getItem("userPinCode");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoresByPin = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${hosturl}/stores`);
        if (response.data?.status && response.data?.result?.panIndiaStores?.length > 0) {
          setStoreLogos(response.data.result.panIndiaStores);
        } else {
          setStoreLogos([]);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        setStoreLogos([]);
      } finally {
        setLoading(false);
      }
    };
      fetchStoresByPin();
  }, [pincode]);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLetterSelect = (letter) => {
    setSelectedLetter(letter);
    setAnchorEl(null);
  };

  const filteredStores =
    selectedLetter === "All"
      ? storeLogos
      : storeLogos.filter(
          (store) =>
            store.name && store.name.toUpperCase().startsWith(selectedLetter)
        );

  return (
    <Container sx={{ mt: 5, paddingBottom: "100px" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          color="black"
          fontFamily="poppins"
        >
          All Stores
        </Typography>
      </Box>
      <Box mb={3}>
        <Box display="flex">
          <Button
            variant={selectedLetter === "All" ? "contained" : "outlined"}
            color="error"
            onClick={() => setSelectedLetter("All")}
            sx={{ textTransform: "none", borderRadius: 0 }}
          >
            All
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleMenuOpen}
            endIcon={<ArrowDropDownIcon />}
            sx={{ textTransform: "none", borderRadius: 0, marginLeft: "1px" }}
          >
            Jump to Stores by Alphabet
          </Button>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{ disablePadding: true }}
          PaperProps={{
            sx: {
              backgroundColor: "#0c2d59",
              padding: 2,
              maxWidth: 250,
              marginTop: "10px",
            },
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 1,
              fontSize: "13px",
            }}
          >
            A to Z Stores
          </Typography>

          <Grid container spacing={1} justifyContent="center">
            {alphabet.map((letter) => (
              <Grid
                item
                xs={2.4}
                sm={2.4}
                key={letter}
                sx={{ textAlign: "center" }}
              >
                <IconButton
                  onClick={() => handleLetterSelect(letter)}
                  sx={{
                    color: "white",
                    fontSize: "12px",
                    padding: "6px",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border:
                      selectedLetter === letter ? "2px solid white" : "none",
                    "&:hover": {
                      backgroundColor: "#17457a",
                    },
                  }}
                >
                  {letter}
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Menu>
      </Box>
      <Grid container spacing={2}>
        {filteredStores.map((store, index) => (
          <Grid item xs={4} sm={2} md={2} key={index}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() =>
                navigate("/single-store-page", {
                  state: {
                    storeId: store._id,
                  },
                })
              }
              sx={{
                height: 70,
                borderRadius: 2,
                borderBottomRightRadius: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 1,
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <img
                crossOrigin="anonymous"
                src={`${hosturl}${store.logo}`}
                alt={store.name || `Store ${index}`}
                style={{
                  maxHeight: 40,
                  maxWidth: "80%",
                  objectFit: "contain",
                }}
              />
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AllStoresPage;
