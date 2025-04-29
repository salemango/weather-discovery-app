<template>
  <div class="overview" v-if="!loading">
    <h1 v-show="!loading">Current Weather</h1>
    <h1 v-show="loading">Loading...</h1>
    <div class="overview-info">

      <div class="date-time">
        <h2> {{ displayInfo.date }} </h2>
        <h2> {{ displayInfo.time }} {{ displayInfo.timeSuffix }} </h2>
      </div>

      <div class="temperature">
        <h1 @click="getOtherTemp">{{ displayInfo.temperature }}°{{ displayInfo.tempUnit }}</h1>
      </div>

      <div class="weather-condition">
        <p>{{ displayInfo.weatherCondition }} </p>
      </div>

      <ul class="humidity">
        <li> <span>Humidity:</span> {{ displayInfo.humidity }}% </li>
      </ul>
      
      <ul class="high-and-low">
        <li><span>Today's High:</span> {{ displayInfo.high }}° </li>
        <li><span>Today's Low:</span> {{ displayInfo.low }}° </li>
      </ul>

      <ul class="sunset-and-sunrise">
        <li><span>Sunrise Time:</span> {{ displayInfo.sunriseTime }} {{ displayInfo.sunriseTimeSuffix }} </li>
        <li><span>Sunset Time:</span> {{ displayInfo.sunsetTime }} {{ displayInfo.sunsetTimeSuffix }} </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'OverviewHome',
  data() {
    return {
      lat: 35.9803138,
      long: -78.5103731,
      loading: true,
      weatherInfo: null,
      displayInfo: {
        UNIXtime: null,
        timezone: null,
        date: '',
        time: null,
        timeSuffix: null,
        sunriseTime: null,
        sunsetTime: null,
        sunriseTimeSuffix: null,
        sunsetTimeSuffix: null,

        tempUnit: 'F',
        tempF: null,
        tempC: null,
        temperature: null,
        highF: null,
        highC: null,
        high: null,
        lowF: null,
        lowC: null,
        low: null,

        weatherCondition: null,
        humidity: null
      },
    }
  },
  props: {
    weatherData: Object
  },
  methods: {
    async fillOutData() {
      await this.getDateAndTime();
      await this.getTemperature();
      await this.getWeatherCondition();
      await this.getHumidity();
    }, 
    
    async getDateAndTime() {
      this.displayInfo.timezone = this.weatherInfo.timezone_offset * 1000;
      this.displayInfo.UNIXtime = this.weatherInfo.current.dt * 1000;

      let date = new Date(this.displayInfo.UNIXtime + this.displayInfo.timezone);        
      
      let day = null;
      let year = null;

      let hours = null;
      let minutes = null;

      this.displayInfo.date = date.getUTCMonth() + 1;

      // Get month
      this.displayInfo.date = await this.getMonth(this.displayInfo.date);

      // Get day and year
      day = date.getUTCDate();
      year = date.getUTCFullYear();

      this.displayInfo.date = this.displayInfo.date + " " + day + " " + year;

      // Get time
      hours = date.getUTCHours();
      minutes = date.getUTCMinutes();

      hours = await this.normalizeHours(hours, 'normal');
      minutes = await this.normalizeMinutes(minutes, 'normal');

      this.displayInfo.time = hours + ":" + minutes;

      let SunriseUNIX = this.weatherInfo.current.sunrise * 1000;
      let SunsetUNIX = this.weatherInfo.current.sunset * 1000;

      // Get sunrise time 
      date = new Date(SunriseUNIX + this.displayInfo.timezone);
      hours = date.getUTCHours();
      minutes = date.getUTCMinutes();
      hours = await this.normalizeHours(hours, 'sunrise');
      minutes = await this.normalizeMinutes(minutes, 'sunrise');

      this.displayInfo.sunriseTime = hours + ":" + minutes;

      date = new Date(SunsetUNIX + this.displayInfo.timezone);
      hours = date.getUTCHours();
      minutes = date.getUTCMinutes();
      hours = await this.normalizeHours(hours, 'sunset');
      minutes = await this.normalizeMinutes(minutes);

      this.displayInfo.sunsetTime = hours + ":" + minutes;

      return;
    },
    async getTemperature() {
      
      // Get current
      this.displayInfo.tempF = this.weatherInfo.current.temp;
      this.displayInfo.tempC = await this.getCelsiusTemps(this.displayInfo.tempF);
      
      // Get high
      this.displayInfo.highF = this.weatherInfo.daily[0].temp.max;
      this.displayInfo.highC = await this.getCelsiusTemps(this.displayInfo.highF);

      // Get low 
      this.displayInfo.lowF = this.weatherInfo.daily[0].temp.min;
      this.displayInfo.lowC = await this.getCelsiusTemps(this.displayInfo.lowF);
      
      // Turn all into whole numbers 
      this.displayInfo.tempF = parseInt(this.displayInfo.tempF);
      this.displayInfo.tempC = parseInt(this.displayInfo.tempC);
      
      this.displayInfo.highF = parseInt(this.displayInfo.highF);
      this.displayInfo.highC = parseInt(this.displayInfo.highC);
      
      this.displayInfo.lowF = parseInt(this.displayInfo.lowF);
      this.displayInfo.lowC = parseInt(this.displayInfo.lowC);

      // Display all
      this.displayInfo.temperature = this.displayInfo.tempF;
      this.displayInfo.high = this.displayInfo.highF;
      this.displayInfo.low = this.displayInfo.lowF;
      
      return;
    },
    async getWeatherCondition() {
      this.displayInfo.weatherCondition = this.weatherInfo.current.weather.main;
      return;
    },
    async getHumidity() { 
      this.displayInfo.humidity = this.weatherInfo.current.humidity;
      return;
    },

    async getMonth(date) {
      switch(date) {
        case 1: 
          return 'January';
    
        case 2: 
          return 'February';
          
        case 3: 
          return 'March';
          
        case 4: 
          return 'April';
          
        case 5: 
          return 'May';
          
        case 6: 
          return 'June';
          
        case 7: 
          return 'July';
          
        case 8: 
          return 'August';
          
        case 9: 
          return 'September';
          
        case 10: 
          return 'October';
          
        case 11: 
          return 'November';
          
        case 12: 
          return 'December';  
      }
    },
    async normalizeMinutes(minutes) {
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      return minutes;
    },
    async normalizeHours(hours, type) {

      if (hours >= 12) {
        if (type == 'normal') 
          { this.displayInfo.timeSuffix = 'PM' }
        else if (type == 'sunrise')
          { this.displayInfo.sunriseTimeSuffix = 'PM' }
        else if (type == 'sunset') 
          { this.displayInfo.sunsetTimeSuffix = 'PM' }
      }
      else {
        if (type == 'normal') 
          { this.displayInfo.timeSuffix = 'AM' }
        else if (type == 'sunrise')
          { this.displayInfo.sunriseTimeSuffix = 'AM' }
        else if (type == 'sunset') 
          { this.displayInfo.sunsetTimeSuffix = 'AM' }
        
      }

      if (hours > 12) {
        hours = hours - 12;
      }

      return hours;
    },
    async getCelsiusTemps(temp) {
      let celsius = null;
      celsius = (temp - 30) / 2
      return celsius;
    },
    async getOtherTemp() {
      if (this.displayInfo.temperature == this.displayInfo.tempF) {
        this.displayInfo.temperature = this.displayInfo.tempC;
        this.displayInfo.tempUnit = 'C';
        this.displayInfo.high = this.displayInfo.highC;
        this.displayInfo.low = this.displayInfo.lowC;
      }
      else if (this.displayInfo.temperature == this.displayInfo.tempC) {
        this.displayInfo.temperature = this.displayInfo.tempF;
        this.displayInfo.tempUnit = 'F';
        this.displayInfo.high = this.displayInfo.highF;
        this.displayInfo.low = this.displayInfo.lowF;
      }
    },
      
  },
  watch: {
    weatherData: {
      async handler (newValue) {
        if (newValue) {
          this.weatherInfo = await newValue;
          await this.fillOutData();
          this.loading = false;
        }
      },
      immediate: true,
    }
  }, 
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .overview {
    color: white;
    text-align: center;
    transition: 1s ease all;
  }

  .overview > h1 {
    font-size: 32pt;
    text-shadow: 0 0px 5px rgb(0, 27, 48, .7);
    margin-top: 20px;
    margin-bottom: 5px;
    line-height: 1em;
  }
  
  .overview-info {
    background: linear-gradient(rgba(42, 75, 109, 0.9) 20%, rgba(24, 52, 75, 0.9));
    width: 90%;
    margin: 0 auto;
    border-radius: 10px;
    padding: 5%;
  }

  .date-time {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: nowrap;
  }

  .date-time h2 {
    font-weight: 300;
    font-size: 18pt;
  }

  .temperature h1 {
    font-size: 80pt;
    line-height: 1em;
    text-shadow: 0 1px 10px rgb(9, 48, 80);
    cursor: pointer;
  }

  .weather-condition p {
    font-size: 20pt;
    text-transform: capitalize;
    text-shadow: 0px 0px 5px rgb(9, 48, 80, .7);
  }

  .high-and-low, .sunset-and-sunrise, .humidity {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .high-and-low li, .sunset-and-sunrise li, .humidity li {
    list-style-type: none;
    padding: none;
    color: #caddf4;
    font-size: 17pt;
    font-weight: 300;
    text-shadow: 0px 0px 3px rgb(9, 48, 80, .7);
  }

  .high-and-low li span, .sunset-and-sunrise li span, .humidity li span {
    font-weight: 500;
  }

  @media screen and (min-width: 700px) {

    .overview > h1 {
      font-size: 40pt;
    }

    .overview-info {
      width: 80%;
      padding: 4% 2%;
    }

    .date-time h2 {
      font-size: 22pt; 
    }

    .temperature h1 {
      font-size: 95pt;
    }

    .weather-condition p {
      font-size: 25pt;
    }

    .high-and-low, .sunset-and-sunrise, .humidity {
      margin-top: 30px;
    }

    .high-and-low li, .sunset-and-sunrise li, .humidity li {
      font-size: 20pt;
    }
  }

  @media screen and (min-width: 1400px) {
    
    .overview > h1 {
      margin-bottom: 10px;
    }
    
    .overview-info {
      width: 50%;
      padding: 1%;
    }

    .date-time {
      margin-bottom: 15px;
    }

    .date-time h2 {
      font-size: 25pt;
    }

    .weather-condition p {
      font-size: 30pt;
      line-height: 1em;
      margin-bottom: 30px;
    }

    .high-and-low, .sunset-and-sunrise, .humidity {
      margin-top: 5px;
      margin-bottom: 20px;
    }

    .high-and-low li, .sunset-and-sunrise li, .humidity li {
      font-size: 18pt;
    }
  }

  @media screen and (min-width: 1700px) {
    
    .overview > h1 {
      margin-top: 40px;
      margin-bottom: 20px;
    }

    .overview-info {
      width: 40%;
    }
  }

</style>
