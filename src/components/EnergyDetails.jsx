import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import TvIcon from '@mui/icons-material/Tv';
import ComputerIcon from '@mui/icons-material/Computer';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import KitchenIcon from '@mui/icons-material/Kitchen';
import SavingsIcon from '@mui/icons-material/Savings';
import TimelineIcon from '@mui/icons-material/Timeline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ParkIcon from '@mui/icons-material/Park';
import NatureIcon from '@mui/icons-material/Nature';
import AirIcon from '@mui/icons-material/Air';
import WaterIcon from '@mui/icons-material/Water';
import RecyclingIcon from '@mui/icons-material/Recycling';
import SpeedIcon from '@mui/icons-material/Speed';
import TimerIcon from '@mui/icons-material/Timer';
import BoltIcon from '@mui/icons-material/Bolt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.95) 100%)'
    : 'linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(224, 242, 254, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  boxShadow: theme.shadows[8],
  position: 'relative',
  zIndex: 1,
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
    borderRadius: 3,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    minWidth: 100,
    padding: theme.spacing(2, 3),
  },
}));

const InsightCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const PredictionCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const EnergyDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('daily');
  const [energyData, setEnergyData] = useState([]);
  const [deviceConsumption, setDeviceConsumption] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState({
    nextMonth: 0,
    nextYear: 0,
    potentialSavings: 0,
    carbonFootprint: 0,
  });
  const [environmentalImpact, setEnvironmentalImpact] = useState({
    treesSaved: 0,
    carbonOffset: 0,
    waterSaved: 0,
    airQuality: 0,
    recyclingEquivalent: 0,
  });
  const [statistics, setStatistics] = useState({
    averageConsumption: 0,
    peakHour: '',
    lowestHour: '',
    costPerUnit: 0,
    efficiencyScore: 0,
    savingsPercentage: 0,
    comparisonWithAverage: 0,
    bestPerformingDay: '',
    worstPerformingDay: '',
  });

  // Helper function to generate realistic daily pattern
  const generateDailyPattern = (hour) => {
    // Base consumption for each hour (in kWh)
    const basePattern = {
      0: 0.3,  // Midnight - low usage
      1: 0.2,  // 1 AM - lowest usage
      2: 0.2,  // 2 AM - lowest usage
      3: 0.2,  // 3 AM - lowest usage
      4: 0.3,  // 4 AM - low usage
      5: 0.4,  // 5 AM - rising
      6: 0.8,  // 6 AM - morning rise
      7: 1.2,  // 7 AM - breakfast peak
      8: 1.0,  // 8 AM - work hours
      9: 0.9,  // 9 AM - work hours
      10: 0.9, // 10 AM - work hours
      11: 1.1, // 11 AM - lunch preparation
      12: 1.3, // 12 PM - lunch peak
      13: 1.0, // 1 PM - work hours
      14: 1.0, // 2 PM - work hours
      15: 1.1, // 3 PM - afternoon
      16: 1.2, // 4 PM - evening rise
      17: 1.4, // 5 PM - evening peak
      18: 1.6, // 6 PM - dinner preparation
      19: 1.5, // 7 PM - dinner
      20: 1.3, // 8 PM - evening
      21: 1.1, // 9 PM - evening
      22: 0.8, // 10 PM - night
      23: 0.5, // 11 PM - night
    };

    // Add some random variation (±20%)
    const variation = 0.8 + Math.random() * 0.4;
    return basePattern[hour] * variation;
  };

  // Helper function to get seasonal multiplier
  const getSeasonalMultiplier = (month) => {
    // Higher consumption in summer (May-July) and winter (Dec-Feb)
    const seasonalPattern = {
      0: 1.2,  // January - winter
      1: 1.3,  // February - winter
      2: 1.1,  // March - spring
      3: 1.0,  // April - spring
      4: 1.2,  // May - summer
      5: 1.4,  // June - summer peak
      6: 1.3,  // July - summer
      7: 1.1,  // August - monsoon
      8: 1.0,  // September - monsoon
      9: 0.9,  // October - autumn
      10: 1.0, // November - autumn
      11: 1.2, // December - winter
    };
    return seasonalPattern[month];
  };

  // Updated daily data generation
  const generateDailyData = useCallback(() => {
    try {
      const days = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        const consumption = generateDailyPattern(i);
        const cost = consumption * 8.5; // ₹8.5 per kWh
        const peak = consumption * 1.2; // 20% higher during peak hours
        const offPeak = consumption * 0.8; // 20% lower during off-peak hours

        return {
          hour: `${hour}:00`,
          consumption: parseFloat(consumption.toFixed(2)),
          cost: parseFloat(cost.toFixed(2)),
          peak: parseFloat(peak.toFixed(2)),
          offPeak: parseFloat(offPeak.toFixed(2)),
        };
      });
      return days;
    } catch (err) {
      setError('Error generating daily data');
      return [];
    }
  }, []);

  // Updated monthly data generation
  const generateMonthlyData = useCallback(() => {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map((month, index) => {
        const baseConsumption = 450; // Base monthly consumption
        const seasonalMultiplier = getSeasonalMultiplier(index);
        const consumption = baseConsumption * seasonalMultiplier * (0.9 + Math.random() * 0.2);
        const cost = consumption * 8.5; // ₹8.5 per kWh
        const peak = consumption * 1.2;
        const offPeak = consumption * 0.8;

        return {
          month,
          consumption: parseFloat(consumption.toFixed(1)),
          cost: parseFloat(cost.toFixed(0)),
          peak: parseFloat(peak.toFixed(1)),
          offPeak: parseFloat(offPeak.toFixed(1)),
        };
      });
    } catch (err) {
      setError('Error generating monthly data');
      return [];
    }
  }, []);

  // Updated yearly data generation
  const generateYearlyData = useCallback(() => {
    try {
      const years = ['2019', '2020', '2021', '2022', '2023'];
      const baseConsumption = 5400; // Base yearly consumption
      const yearlyGrowth = 0.05; // 5% yearly growth

      return years.map((year, index) => {
        const consumption = baseConsumption * Math.pow(1 + yearlyGrowth, index) * (0.95 + Math.random() * 0.1);
        const cost = consumption * 8.5; // ₹8.5 per kWh
        const peak = consumption * 1.2;
        const offPeak = consumption * 0.8;

        return {
          year,
          consumption: parseFloat(consumption.toFixed(1)),
          cost: parseFloat(cost.toFixed(0)),
          peak: parseFloat(peak.toFixed(1)),
          offPeak: parseFloat(offPeak.toFixed(1)),
        };
      });
    } catch (err) {
      setError('Error generating yearly data');
      return [];
    }
  }, []);

  // Updated device consumption generation
  const generateDeviceConsumption = useCallback(() => {
    try {
      return [
        { name: 'Air Conditioning', value: 42, icon: <AcUnitIcon /> },
        { name: 'Lighting', value: 18, icon: <LightbulbIcon /> },
        { name: 'Entertainment', value: 12, icon: <TvIcon /> },
        { name: 'Computers', value: 8, icon: <ComputerIcon /> },
        { name: 'Water Heating', value: 10, icon: <WaterDropIcon /> },
        { name: 'Laundry', value: 10, icon: <LocalLaundryServiceIcon /> },
      ];
    } catch (err) {
      setError('Error generating device consumption data');
      return [];
    }
  }, []);

  // Updated prediction calculations
  const calculatePredictions = useCallback((data) => {
    try {
      const lastMonthAvg = data.slice(-3).reduce((sum, item) => sum + item.consumption, 0) / 3;
      const growthRate = 0.03; // 3% monthly growth rate (more realistic)
      const seasonalFactor = getSeasonalMultiplier(new Date().getMonth());
      
      return {
        nextMonth: lastMonthAvg * (1 + growthRate) * seasonalFactor,
        nextYear: lastMonthAvg * Math.pow(1 + growthRate, 12) * seasonalFactor,
        potentialSavings: lastMonthAvg * 0.12, // 12% potential savings
        carbonFootprint: lastMonthAvg * 0.82, // kg of CO2 per kWh (more accurate)
      };
    } catch (err) {
      console.error('Error calculating predictions:', err);
      return {
        nextMonth: 0,
        nextYear: 0,
        potentialSavings: 0,
        carbonFootprint: 0,
      };
    }
  }, []);

  // Helper function to generate random environmental impact
  const generateEnvironmentalImpact = useCallback((consumption) => {
    // Base calculations
    const carbonEmitted = consumption * 0.82; // kg of CO2
    const treesNeeded = Math.round(carbonEmitted / 20); // One tree absorbs ~20kg CO2 per year
    const waterSaved = consumption * 2.5; // liters of water saved per kWh
    const airQuality = 85 + Math.random() * 10; // Air quality index (0-100)
    const recyclingEquivalent = Math.round(consumption * 0.5); // kg of waste recycled

    // Add some random variation
    const variation = 0.9 + Math.random() * 0.2; // ±10% variation

    return {
      treesSaved: Math.round(treesNeeded * variation),
      carbonOffset: parseFloat((carbonEmitted * variation).toFixed(1)),
      waterSaved: Math.round(waterSaved * variation),
      airQuality: parseFloat(airQuality.toFixed(1)),
      recyclingEquivalent: Math.round(recyclingEquivalent * variation),
    };
  }, []);

  // Helper function to calculate statistics
  const calculateStatistics = useCallback((data) => {
    try {
      const consumptionValues = data.map(item => item.consumption);
      const costValues = data.map(item => item.cost);
      
      // Find peak and lowest hours
      const peakIndex = consumptionValues.indexOf(Math.max(...consumptionValues));
      const lowestIndex = consumptionValues.indexOf(Math.min(...consumptionValues));
      
      // Calculate averages
      const avgConsumption = consumptionValues.reduce((a, b) => a + b, 0) / consumptionValues.length;
      const avgCost = costValues.reduce((a, b) => a + b, 0) / costValues.length;
      
      // Calculate efficiency score (0-100)
      const maxConsumption = Math.max(...consumptionValues);
      const minConsumption = Math.min(...consumptionValues);
      const efficiencyScore = 100 - ((avgConsumption - minConsumption) / (maxConsumption - minConsumption) * 100);
      
      // Calculate savings percentage
      const savingsPercentage = 15 + Math.random() * 10; // Random between 15-25%
      
      // Calculate comparison with average
      const comparisonWithAverage = -5 + Math.random() * 10; // Random between -5 to +5%
      
      // Find best and worst performing days
      const bestDay = data[lowestIndex].hour || data[lowestIndex].month || data[lowestIndex].year;
      const worstDay = data[peakIndex].hour || data[peakIndex].month || data[peakIndex].year;

      return {
        averageConsumption: parseFloat(avgConsumption.toFixed(2)),
        peakHour: data[peakIndex].hour || data[peakIndex].month || data[peakIndex].year,
        lowestHour: data[lowestIndex].hour || data[lowestIndex].month || data[lowestIndex].year,
        costPerUnit: parseFloat((avgCost / avgConsumption).toFixed(2)),
        efficiencyScore: parseFloat(efficiencyScore.toFixed(1)),
        savingsPercentage: parseFloat(savingsPercentage.toFixed(1)),
        comparisonWithAverage: parseFloat(comparisonWithAverage.toFixed(1)),
        bestPerformingDay: bestDay,
        worstPerformingDay: worstDay,
      };
    } catch (err) {
      console.error('Error calculating statistics:', err);
      return {
        averageConsumption: 0,
        peakHour: '',
        lowestHour: '',
        costPerUnit: 0,
        efficiencyScore: 0,
        savingsPercentage: 0,
        comparisonWithAverage: 0,
        bestPerformingDay: '',
        worstPerformingDay: '',
      };
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        let newEnergyData;
        switch (timeRange) {
          case 'daily':
            newEnergyData = generateDailyData();
            break;
          case 'monthly':
            newEnergyData = generateMonthlyData();
            break;
          case 'yearly':
            newEnergyData = generateYearlyData();
            break;
          default:
            newEnergyData = generateDailyData();
        }
        
        const newDeviceConsumption = generateDeviceConsumption();
        
        if (newEnergyData.length === 0 || newDeviceConsumption.length === 0) {
          throw new Error('Failed to generate data');
        }

        setEnergyData(newEnergyData);
        setDeviceConsumption(newDeviceConsumption);
        setPredictions(calculatePredictions(newEnergyData));
        setEnvironmentalImpact(generateEnvironmentalImpact(newEnergyData.reduce((sum, item) => sum + item.consumption, 0)));
        setStatistics(calculateStatistics(newEnergyData));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [timeRange, generateDailyData, generateMonthlyData, generateYearlyData, generateDeviceConsumption, calculatePredictions, generateEnvironmentalImpact, calculateStatistics]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Loading energy data...
        </Typography>
      </Box>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(0, 0, 0, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            padding: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            border: `1px solid ${theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            {timeRange === 'daily' ? `Hour: ${label}` : timeRange === 'monthly' ? `Month: ${label}` : `Year: ${label}`}
          </Typography>
          <Typography variant="body2" sx={{ color: '#2196F3' }}>
            Consumption: {payload[0].value.toFixed(1)} kWh
          </Typography>
          <Typography variant="body2" sx={{ color: '#4CAF50' }}>
            Cost: ₹{payload[1].value.toFixed(0)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(0, 0, 0, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            padding: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            border: `1px solid ${theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)'}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            {payload[0].name}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {payload[0].value}% of total consumption
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'fixed',
          top: 20,
          left: 20,
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(0, 0, 0, 0.2)',
          },
          zIndex: 2,
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Typography
        variant="h4"
        sx={{
          mb: 4,
          textAlign: 'center',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Energy Consumption Details
      </Typography>

      <StyledPaper>
        <Box sx={{ mb: 4 }}>
          <StyledTabs
            value={timeRange}
            onChange={(e, newValue) => setTimeRange(newValue)}
            centered
          >
            <Tab label="Daily View" value="daily" />
            <Tab label="Monthly View" value="monthly" />
            <Tab label="Yearly View" value="yearly" />
          </StyledTabs>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Consumption
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {statistics.averageConsumption.toFixed(1)} kWh
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon color="primary" />
                  <Typography variant="body2" color="primary">
                    +12.5% from previous period
                  </Typography>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total Cost
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ₹{energyData.reduce((sum, item) => sum + (item.cost || 0), 0).toFixed(0)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingDownIcon color="success" />
                  <Typography variant="body2" color="success.main">
                    -5.2% from previous period
                  </Typography>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Peak Consumption
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {statistics.peakHour}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon color="warning" />
                  <Typography variant="body2" color="warning.main">
                    +8.3% from previous period
                  </Typography>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={energyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2196F3" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(144, 202, 249, 0.1)" />
                  <XAxis
                    dataKey={timeRange === 'daily' ? 'hour' : timeRange === 'monthly' ? 'month' : 'year'}
                    stroke="rgba(144, 202, 249, 0.5)"
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#2196F3"
                    label={{ value: 'Consumption (kWh)', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#4CAF50"
                    label={{ value: 'Cost (₹)', angle: 90, position: 'insideRight' }}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="consumption"
                    stroke="#2196F3"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                    name="Consumption"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="cost"
                    stroke="#4CAF50"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                    name="Cost"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InsightCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Energy Consumption Insights
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <ElectricBoltIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Peak Usage Time"
                      secondary={
                        timeRange === 'daily' 
                          ? '2:00 PM - 6:00 PM' 
                          : timeRange === 'monthly' 
                            ? '2:00 PM - 6:00 PM' 
                            : 'June - August'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingDownIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Most Efficient Period"
                      secondary={
                        timeRange === 'daily'
                          ? '11:00 PM - 5:00 AM'
                          : timeRange === 'monthly'
                            ? '11:00 PM - 5:00 AM'
                            : 'January - March'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Average Consumption"
                      secondary={
                        timeRange === 'daily'
                          ? `${(statistics.averageConsumption).toFixed(1)} kWh per hour`
                          : timeRange === 'monthly'
                            ? `${(statistics.averageConsumption / 30).toFixed(1)} kWh per day`
                            : `${(statistics.averageConsumption / 365).toFixed(1)} kWh per day`
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </InsightCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <InsightCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Energy Saving Recommendations
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AcUnitIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Optimize AC Usage"
                      secondary="Set temperature to 24°C and use timer mode"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LightbulbIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Switch to LED Lights"
                      secondary="Replace traditional bulbs with energy-efficient LEDs"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <KitchenIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Smart Kitchen Habits"
                      secondary="Use microwave instead of oven for small meals"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </InsightCard>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Energy Efficiency Score
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ mr: 2 }}>
                      {statistics.efficiencyScore}%
                    </Typography>
                    <Chip
                      label="Good"
                      color="success"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={statistics.efficiencyScore}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(144, 202, 249, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Your energy efficiency is better than 75% of similar households
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Add Predictions Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Energy Predictions & Savings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <PredictionCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TimelineIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Consumption Predictions
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Next Month"
                        secondary={`${predictions.nextMonth.toFixed(1)} kWh (estimated)`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Next Year"
                        secondary={`${predictions.nextYear.toFixed(1)} kWh (estimated)`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </PredictionCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <PredictionCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SavingsIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Potential Savings
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CompareArrowsIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Monthly Savings"
                        secondary={`₹${(predictions.potentialSavings * 8).toFixed(0)} (estimated)`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CompareArrowsIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Annual Savings"
                        secondary={`₹${(predictions.potentialSavings * 8 * 12).toFixed(0)} (estimated)`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </PredictionCard>
            </Grid>
          </Grid>
        </Box>

        {/* Updated Environmental Impact Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Environmental Impact
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <PredictionCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ParkIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Carbon Footprint & Trees
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <NatureIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Carbon Emissions"
                        secondary={`${environmentalImpact.carbonOffset} kg CO2`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ParkIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Equivalent Trees Needed"
                        secondary={`${environmentalImpact.treesSaved} trees to offset emissions`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </PredictionCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <PredictionCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AirIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Air & Water Impact
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <AirIcon color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Air Quality Impact"
                        secondary={`${environmentalImpact.airQuality}% air quality index`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <WaterIcon color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Water Conservation"
                        secondary={`${environmentalImpact.waterSaved} liters of water saved`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </PredictionCard>
            </Grid>
            <Grid item xs={12}>
              <PredictionCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <RecyclingIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Waste Reduction Equivalent
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body1">
                      Your energy savings are equivalent to recycling:
                    </Typography>
                    <Chip
                      label={`${environmentalImpact.recyclingEquivalent} kg of waste`}
                      color="success"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(environmentalImpact.recyclingEquivalent / 100) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: 'rgba(144, 202, 249, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    This is equivalent to recycling {Math.round(environmentalImpact.recyclingEquivalent / 2)} plastic bottles
                  </Typography>
                </CardContent>
              </PredictionCard>
            </Grid>
          </Grid>
        </Box>

        {/* Add Energy Tips Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Smart Energy Tips
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <PredictionCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LightbulbIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Quick Wins
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Use LED Bulbs"
                        secondary="Save up to 80% on lighting costs"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Unplug Devices"
                        secondary="Reduce standby power consumption"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </PredictionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <PredictionCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AcUnitIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Temperature Control
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Optimal AC Settings"
                        secondary="Set to 24°C for best efficiency"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Smart Scheduling"
                        secondary="Program devices for off-peak hours"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </PredictionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <PredictionCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <KitchenIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Kitchen Efficiency
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Batch Cooking"
                        secondary="Reduce oven usage frequency"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Energy-Efficient Appliances"
                        secondary="Consider upgrading to 5-star rated devices"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </PredictionCard>
            </Grid>
          </Grid>
        </Box>

        {/* Add Statistics Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Detailed Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <PredictionCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SpeedIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Consumption Analysis
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <BoltIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Average Consumption"
                        secondary={`${statistics.averageConsumption} kWh`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TimerIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Peak Usage Time"
                        secondary={statistics.peakHour}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TimerIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Lowest Usage Time"
                        secondary={statistics.lowestHour}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </PredictionCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <PredictionCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AttachMoneyIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Cost Analysis
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <AttachMoneyIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Cost per Unit"
                        secondary={`₹${statistics.costPerUnit} per kWh`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CompareArrowsIcon color={statistics.comparisonWithAverage >= 0 ? "success" : "error"} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Comparison with Average"
                        secondary={`${statistics.comparisonWithAverage >= 0 ? '+' : ''}${statistics.comparisonWithAverage}%`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingDownIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Potential Savings"
                        secondary={`${statistics.savingsPercentage}%`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </PredictionCard>
            </Grid>
            <Grid item xs={12}>
              <PredictionCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmojiEventsIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Performance Metrics
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Efficiency Score
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={statistics.efficiencyScore}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: 'rgba(144, 202, 249, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5,
                              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            },
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {statistics.efficiencyScore}% efficiency rating
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Best Performing"
                            secondary={statistics.bestPerformingDay}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Worst Performing"
                            secondary={statistics.worstPerformingDay}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </PredictionCard>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default EnergyDetails; 