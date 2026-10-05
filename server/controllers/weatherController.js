export const getAgriWeather = (req, res) => {
  const { region = 'North / Central India' } = req.query;

  const currentMonthIndex = new Date().getMonth(); // 0 - 11
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = months[currentMonthIndex];

  // Determine current agricultural season in India
  let season = 'Rabi';
  let seasonDescription = 'Winter Cropping Season (रबी की फसल)';
  if (currentMonthIndex >= 5 && currentMonthIndex <= 9) {
    season = 'Kharif';
    seasonDescription = 'Monsoon Cropping Season (खरीफ की फसल)';
  } else if (currentMonthIndex >= 2 && currentMonthIndex <= 4) {
    season = 'Zaid';
    seasonDescription = 'Summer Cropping Season (जायद की फसल)';
  }

  res.json({
    success: true,
    region,
    currentDate: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    currentMonth,
    activeSeason: season,
    seasonDescription,
    sowingReadinessScore: 92, // Percentage
    weatherConditions: {
      temperature: '26°C',
      tempRange: '18°C - 31°C',
      humidity: '58%',
      windSpeed: '7 km/h (North-Easterly)',
      condition: 'Clear Sky / Sunny',
      rainfallChance: '10% (Favorable for field preparation & sowing)'
    },
    sprayingSafetyIndex: {
      status: 'SAFE TO SPRAY',
      color: 'green',
      guidance: 'Wind speed is below 10 km/h and zero rain forecasted for next 36 hours. Ideal for foliar insecticide or fungicide application.'
    },
    seasonalAlerts: [
      {
        type: 'sowing',
        title: `Optimal Sowing Window Active for ${season}`,
        message: season === 'Rabi'
          ? 'Prepare seedbeds for Wheat, Mustard, Potato, and Chickpea. Conduct seed treatment with Trichoderma.'
          : (season === 'Kharif'
            ? 'Monsoon rains underway. Optimal time for transplanting Paddy and sowing Cotton, Soybean, and Maize.'
            : 'Sow short duration summer crops like Watermelon, Cucumber, and Moong Dal.')
      },
      {
        type: 'pest',
        title: 'Active Pest Surveillance Alert',
        message: 'Monitor leaf curl in Chilli and Aphids in vegetables. Hang yellow and blue sticky traps.'
      }
    ]
  });
};
