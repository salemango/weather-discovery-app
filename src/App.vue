<template>
  <div id="app"
    :class="{ 
      'clear' : weatherCondition == 'Clear',
      'cloudy' : weatherCondition == 'Clouds',
      'rainy' : weatherCondition == 'Rain',
      'snowy' : weatherCondition == 'Snow',
      'stormy' : weatherCondition == 'Thunderstorm',
      'dark': darkMode || isNight
     }">
  
  <header>
    <input type="search" class="search-bar" :class="{ 'dark': darkMode || isNight }" placeholder="Search for a location..." v-model="query" @keyup.enter="searchNewLocation()">
    <img :src="getModeIcon()" @click="toggleDarkMode()" v-show="!isNight">
  </header>

  <div class="location" v-show="!loading"> 
    <img :src="getLocationIcon()"> 
    <select :class="{ 'dark': darkMode || isNight}" name="location" v-model="location" @change="selectSavedLocation()">
      <option :value="location"> {{ location }} </option>
      <option v-for="savedLocation in savedLocations" :value="savedLocation" :key="savedLocation"> {{ savedLocation }} </option>
    </select>
    <img :src="getFavoriteIcon()" @click="saveLocation()">
  </div>
  
  <RouterView v-show="!loading"/>

  <nav>
    <RouterLink to="/">Overview</RouterLink>
    <RouterLink to="/hourly-forecast">Hourly Forecast</RouterLink>
    <RouterLink to="/5-day-forecast">5 Day Forecast</RouterLink>
  </nav>
  </div>
</template>

<script>

// Functionality
import  { useDark, useToggle } from '@vueuse/core';
import axios from 'axios';
import { provide, ref } from 'vue';

// Icons 
import lightModeIcon from './assets/light-mode.svg';
import darkModeIcon from './assets/dark-mode.svg';
import lightModeLocation from './assets/location-light.svg';
import darkModeLocation from './assets/location-dark.svg';
import lightModeFavorite from './assets/favorite-light.svg';
import darkModeFavorite from './assets/favorite-dark.svg';
import lightModeRemove from './assets/remove-light.svg';
import darkModeRemove from './assets/remove-dark.svg';


const isDark = useDark({
  selector: 'body',
  attribute: 'color',
  valueDark: 'dark',
  valueLight: 'light',
});

const toggleDark = useToggle(isDark);

export default {
  name: 'App',
  data() {
    return {
      weatherCondition: 'Clouds',
      location: 'Wake Forest, North Carolina, US',
      darkMode: isDark,
      saved: false, 
      savedLocations: [],
      sunriseTime: null,
      sunsetTime: null,
      
      apiKey: '79159695d5493548f7e48890afac0eb2',
      geocodingPrefix: 'http://api.openweathermap.org/geo/1.0/direct?q=',
      oneCallPrefix: 'https://api.openweathermap.org/data/3.0/onecall?lat=',
      query: '',
      
      geocodingResults: null,
      lat: 35.9803138,
      long: -78.5103731,
      loading: false,
      
      weatherData: null,
      currentWeather: null,
      timezone: null,
      UNIXtime: null,
      currentTime: null,
      isNight: false,
    }
  },

  methods: {
    // Toggle dark mode 
    toggleDarkMode() { // Toggles dark mode based on time of day or user input
      toggleDark();
    },

    // Toggle icons
    getModeIcon() {
      if (this.darkMode) { // Flips between light mode and dark mode icons
        return darkModeIcon;
      }
      else {
        return lightModeIcon;
      }
    },
    getLocationIcon() { // Flips between light mode and dark mode location icons
      if (this.darkMode || this.isNight ) {
        return darkModeLocation;
      }
      else {
        return lightModeLocation;
      }
    },
    getFavoriteIcon() {
      if ( ( !this.darkMode && !this.isNight ) && !this.saved ) {
        return lightModeFavorite;
      }
      else if ( ( this.darkMode || this.isNight ) && !this.saved ) {
        return darkModeFavorite;
      }
      else if ( ( !this.darkMode && !this.isNight ) && this.saved ) {
        return lightModeRemove;
      }
      else {
        return darkModeRemove;
      }
    },

    // Saved location controls
    saveLocation() {
      this.saved = !this.saved;
      if (this.saved) {
        this.savedLocations.push(this.location);
      }
      else {
        let i = 0;
        for (i = 0; i < this.savedLocations.length; i++) {
          if (this.savedLocations[i] == this.location) {
            this.savedLocations.splice(i, 1);
          } 
        }
      }
    },
    selectSavedLocation() {
      this.saved = true;
      this.query = this.location;
      this.getData();
    },

    // Search
    searchNewLocation() {
      this.saved = false;
      this.getData();
    },

    // Get data
    getData() { // Get data on enter press - Working as intended
      this.loading = true;
      this.query = this.formatQuery();
      axios
        .get(`${this.geocodingPrefix}${this.query}&limit=1&appid=${this.apiKey}`)
        .then((response => {
          this.geocodingResults = response.data;
          this.geocodingResults = this.geocodingResults[0];
          this.lat = this.geocodingResults.lat;
          this.long = this.geocodingResults.lon;
          if (this.geocodingResults.state) {
            this.location = this.geocodingResults.name + ", " + this.geocodingResults.state + ", " + this.geocodingResults.country;
          }
          else {
            this.location = this.geocodingResults.name + ", " + this.geocodingResults.country;
          }
          
          this.getWeatherData();
        }));
    
      this.loading = false;
      this.query = '';
    },
    getWeatherData() {
      axios 
        .get(`${this.oneCallPrefix}${this.lat}&lon=${this.long}&units=imperial&appid=${this.apiKey}`)
        .then((response => {
          this.weatherData = response.data;
          this.currentWeather = this.weatherData.current.weather;
          this.currentWeather = this.currentWeather[0];
          this.weatherCondition = this.currentWeather.main;
          this.UNIXtime = this.weatherData.current.dt;
          this.timezone = this.weatherData.timezone_offset;
          this.UNIXtoNormal();
        })); 
      return;      
    },

    // Data formatting 
    formatQuery() { // Replace spaces in query with dash -- works as intended
      return this.query.replace(/ /g, "-");
    },
    UNIXtoNormal() {
        
        // Get current time
          this.UNIXtime = this.UNIXtime + this.timezone;
          let date =  new Date(this.UNIXtime * 1000);
          
          // Get hours
          let hours = date.getUTCHours();
          this.currentTime = hours * 100;

          // Get minutes
          let minutes = date.getUTCMinutes();
          this.currentTime = this.currentTime + minutes;
        // End

        // Get sunrise time 
          this.UNIXtime = this.weatherData.current.sunrise;
          this.UNIXtime = this.UNIXtime + this.timezone;
          date = new Date(this.UNIXtime * 1000);

          hours = date.getUTCHours();
          this.sunriseTime = hours * 100;

          minutes = date.getUTCMinutes();
          this.sunriseTime = this.sunriseTime + minutes;
      // End  

      // Get sunset time 
        this.UNIXtime = this.weatherData.current.sunset;
        this.UNIXtime = this.UNIXtime + this.timezone;
        date = new Date(this.UNIXtime * 1000);

        hours = date.getUTCHours();
        this.sunsetTime = hours * 100;

        minutes = date.getUTCMinutes();
        this.sunsetTime = this.sunsetTime + minutes;
      // End

      if ((this.currentTime < this.sunriseTime )|| (this.currentTime > this.sunsetTime)) {
        this.isNight = true;
      }
      else {
        this.isNight = false;
      }
      return;
    },
    setup() {
      const reactiveWeatherData = ref(this.weatherData);
      provide('weatherData', reactiveWeatherData);
    }
  }, 

  // Mounted -- gets weather data for Wake Forest, a placeholder location
  mounted() {
      this.getWeatherData();
    } 
}


</script>

<style>

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  #app {
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    transition: 1s ease all;
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
  }

  /* App background possibilities */
    #app.clear {
      background-image: url('./assets/clear-sky-day.jpg');
    }

    #app.clear.dark {
      background-image: url('./assets/clear-sky-night.jpg');
    }

    #app.cloudy {
      background-image: url('./assets/cloudy-sky-day.jpg');
    }

    #app.cloudy.dark {
      background-image: url('./assets/cloudy-sky-night.jpg');
    }

    #app.rainy {
      background-image: url('./assets/rainy-sky-day.jpg');
    }

    #app.rainy.dark {
      background-image: url('./assets/rainy-sky-night.jpg');
    }

    #app.snowy {
      background-image: url('./assets/snowy-sky-day.jpg');
    }

    #app.snowy.dark {
      background-image: url('./assets/snowy-sky-night.jpg');
    }

    #app.stormy {
      background-image: url('./assets/thunderstorm-day.jpg');
    }

    #app.stormy.dark {
      background-image: url('./assets/thunderstorm-night.jpg');
    }
  /* End */

  header {
    display: flex;
    gap: 5%;
    justify-content: center;
    padding-top: 10px;
  }

  input {
    appearance: none;
  }


  input[type="search"] {
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    border: none;
    background-color: rgba(255, 255, 255, 0.5);
    color: #06293f;
    font-size: 15pt;
    border-radius: 0px 10px;
    width: 350px;
    padding: 2% 5%;
    overflow: hidden;
    transition: .5s ease all;
  }

  input[type="search"]::placeholder {
    appearance: none;
    color: #06293f;
    overflow: visible;
    font-weight: 500;
  } 

  input.dark[type="search"]::placeholder {
    color: #000;
  }

  input[type="search"]:focus {
    background-color: white;
    border-radius: 10px 0px;
    transition: .5s ease all;
  }

  header img {
    cursor: pointer;
  }

 
  div.location {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    gap: 2%;
  }

  .location img {
    vertical-align: top;
    width: 30px;
  }

  .location img:nth-of-type(2) {
    cursor: pointer;
  }

  select {
    background-color: transparent;
    border: none;
    color: #06293f;
    font-size: 16pt;
    font-weight: 300;
    font-style: italic;
    cursor: pointer;
  }

  select:focus {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
  }

  select.dark {
    color: #caddf4;
  }

  option {
    font-size: 12pt;
    font-style: normal;
    cursor: pointer;
  }

nav {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
}

nav a {
  text-decoration: none;
  color: white;
  background-color: #264c78;
  margin: 1%;
  font-size: 16pt;
  padding: 3% 5%;
  border-radius: 10px;
  transition: .5s ease all;
}

nav a.active-link {
  background-color: #06293f;
  transition: .5s ease all;
}

@media screen and (min-width: 700px) {
  
  header {
    gap: 2%;
  }

  input[type="search"] {
    font-size: 16pt;
    width: 500px;
    padding: 1% 3%;
  }

  header img {
    width: 50px;
  }

  nav {
    flex-direction: row;
  }

  nav a {
    font-size: 18pt;
  }
}

@media screen and (min-width: 1000px ) {

  header img {
    width: 60px;
  }

  input[type="search"] {
    font-size: 22pt;
    width: 700px;
  }
}

@media screen and (min-width:1400px) {
  
  select {
    font-size: 20pt;
  }

  .location img {
    width: 30px;
  }
  
  input[type="search"] {
    font-size: 18pt;
    padding: .5% 2%;
  }

  nav a {
    padding: 1.5% 5%;
    font-size: 20pt;
  }

}

@media screen and (min-width:1700px) {
  input[type="search"] {
    padding: .5% 1%;
    font-size: 16pt;
  }
}

</style>
