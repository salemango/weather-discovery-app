<template>
  <div class="overview">
    <h1>Overview</h1>
    <div class="overview-info">
      <div class="date-time">
        <h2> {{ weatherInfo.date }} </h2>
        <h2> {{ weatherInfo.time }} {{ weatherInfo.timeSuffix }} </h2>
      </div>
      <div class="temperature">
        <h1 @click="getCurrentTemp">{{ weatherInfo.temperature }}°{{ weatherInfo.tempUnit }}</h1>
      </div>
      <div class="weather-condition">
        <p>{{ weatherInfo.weatherCondition }} </p>
      </div>
      <ul class="high-and-low">
        <li><span>Today's High:</span> {{ weatherInfo.high }}° </li>
        <li><span>Today's Low:</span> {{ weatherInfo.low }}° </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'OverviewHome',
  data() {
    return {
      weatherInfo: {
        date: "September 14 2025",
        time: "3:30",
        timeSuffix: 'PM',
        tempUnit: 'F',
        tempF: 50,
        tempC: 10,
        temperature: 50,
        weatherCondition: "clear",
        highF: 60,
        highC: 15.5,
        high: 60,
        lowF: 40,
        lowC: 4.4,
        low: 40
      },
      weatherData: null
    }
  },
  methods: {
      getCurrentTemp() {
        if (this.weatherInfo.temperature == this.weatherInfo.tempF) {
          this.weatherInfo.temperature = this.weatherInfo.tempC;
          this.weatherInfo.tempUnit = 'C';
          this.weatherInfo.high = this.weatherInfo.highC;
          this.weatherInfo.low = this.weatherInfo.lowC;
        }
        else if (this.weatherInfo.temperature == this.weatherInfo.tempC) {
          this.weatherInfo.temperature = this.weatherInfo.tempF;
          this.weatherInfo.tempUnit = 'F';
          this.weatherInfo.high = this.weatherInfo.highF;
          this.weatherInfo.low = this.weatherInfo.lowF;
        }
      },
      watchEffect() {
        console.log('new WeatherData', weatherData);
      } 
    },
  setup() {
    const weatherData = inject('weatherData');
    this.weatherData = weatherData;
    // this.watchEffect();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .overview {
    color: white;
    text-align: center;
  }

  .overview > h1 {
    font-size: 32pt;
    text-shadow: 0 1px 4px rgb(9, 48, 80, .5);
    margin-top: 20px;
    margin-bottom: 5px;
    line-height: 1em;
  }
  
  .overview-info {
    background: linear-gradient(#264c78 20%, rgb(9, 48, 80, .7));
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

  .high-and-low {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .high-and-low li {
    list-style-type: none;
    padding: none;
    color: #caddf4;
    font-size: 17pt;
    font-weight: 300;
    text-shadow: 0px 0px 3px rgb(9, 48, 80, .7);
  }

  .high-and-low li span {
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
      font-size: 120pt;
    }

    .weather-condition p {
      font-size: 25pt;
    }

    .high-and-low {
      margin-top: 40px;
    }

    .high-and-low li {
      font-size: 22pt;
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
      margin-bottom: 30px;
    }

    .date-time h2 {
      font-size: 25pt;
    }

    .weather-condition p {
      font-size: 30pt;
      line-height: 1em;
      margin-bottom: 30px;
    }

    .high-and-low {
      margin-bottom: 30px;
    }

    .high-and-low li {
      font-size: 25pt;
    }
  }

  @media screen and (min-width: 1700px) {
    
    .overview > h1 {
      margin-top: 40px;
      margin-bottom: 20px;
    }
  }

</style>
