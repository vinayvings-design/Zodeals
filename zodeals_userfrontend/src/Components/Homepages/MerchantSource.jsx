import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  AppBar,
  Toolbar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom PriceBar component to replace the missing MerchantPriceBar
const PriceBar = ({ title, price, selected, onClick }) => {
  return (
    <Paper 
      elevation={selected ? 4 : 1}
      sx={{ 
        p: 2, 
        mb: 2, 
        cursor: 'pointer',
        border: selected ? '2px solid #6366f1' : '1px solid #e0e0e0',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
      onClick={onClick}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getDescription(title)}
          </Typography>
        </Box>
        <Typography variant="h6" color="primary">
          ₹{price.toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};

// Helper function to get descriptions
const getDescription = (title) => {
  const descriptions = {
    'Single Pincode': 'Target a specific area',
    '2 Pincodes': 'Cover two important areas',
    '3 to 4 Pincodes': 'Ideal for small regions',
    '5 to 10 Pincodes': 'Cover a medium area',
    'Full City': 'Entire city coverage',
    'Full State': 'Statewide presence',
    'Two States': 'Expand to neighboring states',
    'PAN India': 'Nationwide coverage'
  };
  return descriptions[title] || '';
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#f8fafc'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    }
  }
});

const pricingOptions = [
  { id: 1, name: 'Single Pincode', price: 500 },
  { id: 2, name: '2 Pincodes', price: 1000 },
  { id: 3, name: '3 to 4 Pincodes', price: 2000 },
  { id: 4, name: '5 to 10 Pincodes', price: 4000 },
  { id: 5, name: 'Full City', price: 10000 },
  { id: 6, name: 'Full State', price: 25000 },
  { id: 7, name: 'Two States', price: 40000 },
  { id: 8, name: 'PAN India', price: 100000 },
];

function MerchantSource() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [orderSummary, setOrderSummary] = useState(false);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setOrderSummary(true);
  };

  const calculateTotal = () => {
    if (!selectedOption) return 0;
    const basePrice = selectedOption.price;
    const gst = basePrice * 0.18;
    return basePrice + gst;
  };

  return (
    <Box sx={{marginTop:2}}>
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default', }}>
        <AppBar position="static" elevation={2} sx={{ bgcolor: 'white', color: 'text.primary' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 , fontFamily: 'Poppins, sans-serif' }}>
              Merchant Coverage Plans
            </Typography>
            {/* <Button color="primary">Login</Button> */}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
            Select Your Coverage Area
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 5, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Choose the perfect plan to expand your merchant services. All prices are exclusive of 18% GST.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Available Coverage Options
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {pricingOptions.map((option) => (
                  <PriceBar
                    key={option.id}
                    title={option.name}
                    price={option.price}
                    selected={selectedOption?.id === option.id}
                    onClick={() => handleSelectOption(option)}
                  />
                ))}
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ position: 'sticky', top: 20 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  {orderSummary ? (
                    <>
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary={selectedOption.name} 
                            secondary="Base price" 
                          />
                          <Typography variant="body1">
                            ₹{selectedOption.price.toLocaleString()}
                          </Typography>
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="GST" 
                            secondary="18%" 
                          />
                          <Typography variant="body1">
                            ₹{(selectedOption.price * 0.18).toLocaleString()}
                          </Typography>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText 
                            primary="Total" 
                            primaryTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                          />
                          <Typography variant="h6" color="primary" fontWeight={600}>
                            ₹{calculateTotal().toLocaleString()}
                          </Typography>
                        </ListItem>
                      </List>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        size="large"
                        sx={{ mt: 2 }}
                      >
                        Proceed to Payment
                      </Button>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Select a coverage option to see pricing details
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 2 }}>
                    <Chip label="GST 18% applicable" color="secondary" size="small" sx={{ mr: 1 }} />
                    <Chip label="All plans annual" color="default" size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
    </Box>
  );
}

export default MerchantSource;