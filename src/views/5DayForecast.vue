<template>
    <div class="five-day-forecast" v-show="!loading">
        <h1>5-Day Forecast</h1>
        <div class="forecast-info">
            <div class="day">
                <h2> {{ currentDay.date }}</h2>
                <table>
                    <tbody>
                    <tr>
                        <th scope="col">Weather</th>
                        <th scope="col">Day</th>
                        <th scope="col">Night</th>
                        <th scope="col">Humidity</th>
                    </tr>
                    <tr>
                        <td>{{ currentDay.weather }}</td>
                        <td @click="changeTempType()">{{ currentDay.dayTemp }}°{{ tempUnit }} </td>
                        <td @click="changeTempType()">{{ currentDay.nightTemp }}°{{ tempUnit }}</td>
                        <td>{{ currentDay.humidity }}%</td>
                    </tr>
                    </tbody>
                </table>
                <p>{{ currentDay.summary }} </p>
            </div>

            <div class="day">
                <h2> {{ day1.date }}</h2>
                <table>
                    <tbody>
                    <tr>
                        <th scope="col">Weather</th>
                        <th scope="col">Day</th>
                        <th scope="col">Night</th>
                        <th scope="col">Humidity</th>
                    </tr>
                    <tr>
                        <td>{{  day1.weather }}</td>
                        <td @click="changeTempType()">{{  day1.dayTemp }}°{{ tempUnit }} </td>
                        <td @click="changeTempType()">{{  day1.nightTemp }}°{{ tempUnit }}</td>
                        <td>{{  day1.humidity }}%</td>
                    </tr>
                    </tbody>
                </table>
                <p>{{  day1.summary }} </p>
            </div>

            <div class="day">
                <h2> {{  day2.date }}</h2>
                <table>
                    <tbody>
                    <tr>
                        <th scope="col">Weather</th>
                        <th scope="col">Day</th>
                        <th scope="col">Night</th>
                        <th scope="col">Humidity</th>
                    </tr>
                    <tr>
                        <td>{{  day2.weather }}</td>
                        <td @click="changeTempType()">{{  day2.dayTemp }}°{{ tempUnit }} </td>
                        <td @click="changeTempType()">{{  day2.nightTemp }}°{{ tempUnit }}</td>
                        <td>{{  day2.humidity }}%</td>
                    </tr>
                    </tbody>
                </table>
                <p>{{  day2.summary }} </p>
            </div>

            <div class="day">
                <h2> {{  day3.date }}</h2>
                <table>
                    <tbody>
                    <tr>
                        <th scope="col">Weather</th>
                        <th scope="col">Day</th>
                        <th scope="col">Night</th>
                        <th scope="col">Humidity</th>
                    </tr>
                    <tr>
                        <td>{{  day3.weather }}</td>
                        <td @click="changeTempType()">{{  day3.dayTemp }}°{{ tempUnit }} </td>
                        <td @click="changeTempType()">{{  day3.nightTemp }}°{{ tempUnit }}</td>
                        <td>{{  day3.humidity }}%</td>
                    </tr>
                    </tbody>
                </table>
                <p>{{  day3.summary }} </p>
            </div>

            <div class="day">
                <h2> {{  day4.date }}</h2>
                <table>
                    <tbody>
                    <tr>
                        <th scope="col">Weather</th>
                        <th scope="col">Day</th>
                        <th scope="col">Night</th>
                        <th scope="col">Humidity</th>
                    </tr>
                    <tr>
                        <td>{{  day4.weather }}</td>
                        <td @click="changeTempType()">{{  day4.dayTemp }}°{{ tempUnit }} </td>
                        <td @click="changeTempType()">{{  day4.nightTemp }}°{{ tempUnit }}</td>
                        <td>{{  day4.humidity }}%</td>
                    </tr>
                    </tbody>
                </table>
                <p>{{  day4.summary }} </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tempUnit: 'F',
            timezone: null,
            weatherInfo: null,
            loading: false,
            currentDay: {
                date: null,
                weather: '',
                dayTemp: null,
                nightTemp: null,
                dayTempF: null,
                nightTempF: null,
                dayTempC: null,
                nightTempC: null,
                humidity: null,
                summary: ''
            },
            day1: {
                date: null,
                weather: '',
                dayTemp: null,
                nightTemp: null,
                dayTempF: null,
                nightTempF: null,
                dayTempC: null,
                nightTempC: null,
                humidity: null,
                summary: ''
            },
            day2: {
                date: null,
                weather: '',
                dayTemp: null,
                nightTemp: null,
                dayTempF: null,
                nightTempF: null,
                dayTempC: null,
                nightTempC: null,
                humidity: null,
                summary: ''
            },
            day3: {
                date: null,
                weather: '',
                dayTemp: null,
                nightTemp: null,
                dayTempF: null,
                nightTempF: null,
                dayTempC: null,
                nightTempC: null,
                humidity: null,
                summary: ''
            },
            day4: {
                date: null,
                weather: '',
                dayTemp: null,
                nightTemp: null,
                dayTempF: null,
                nightTempF: null,
                dayTempC: null,
                nightTempC: null,
                humidity: null,
                summary: ''
            }
        }
    },
    props: {
        weatherData: Object
    },
    methods: {
        async fillOutData() {
            await this.getDates();
            await this.getWeather();
            await this.getTemps();
            await this.getHumidity();
            await this.getSummaries();
            return;
        },
        async getDates() {
            // Get timezone
            this.timezone = this.weatherInfo.timezone_offset;
            
            // Get UNIX times for each day
            let UNIXtimeCurrent = this.weatherInfo.daily[0].dt + this.timezone;
            let UNIXtimeday1 = this.weatherInfo.daily[1].dt + this.timezone;
            let UNIXtimeday2= this.weatherInfo.daily[2].dt + this.timezone;
            let UNIXtimeday3 = this.weatherInfo.daily[3].dt + this.timezone;
            let UNIXtimeday4 = this.weatherInfo.daily[4].dt + this.timezone;

            // Get current day date
            let date = new Date(UNIXtimeCurrent * 1000);
            let month =  date.getUTCMonth() + 1;
            let day = date.getUTCDate();
            let year = date.getUTCFullYear();
            this.currentDay.date = month + "/" + day + "/" + year;

            // Get day 1 date
            date = new Date(UNIXtimeday1 * 1000);
            month = date.getUTCMonth() + 1;
            day = date.getUTCDate();
            year = date.getUTCFullYear();
            this.day1.date = month + "/" + day + "/" + year;

            // Get day 2 date
            date = new Date(UNIXtimeday2 * 1000);
            month = date.getUTCMonth() + 1;
            day = date.getUTCDate();
            year = date.getUTCFullYear();
            this.day2.date = month + "/" + day + "/" + year;

            // Get day 3 date
            date = new Date(UNIXtimeday3 * 1000);
            month = date.getUTCMonth() + 1;
            day = date.getUTCDate();
            year = date.getUTCFullYear();
            this.day3.date = month + "/" + day + "/" + year;

            // Get day 4 date
            date = new Date(UNIXtimeday4 * 1000);
            month = date.getUTCMonth() + 1;
            day = date.getUTCDate();
            year = date.getUTCFullYear();
            this.day4.date = month + "/" + day + "/" + year;

            return;
        },
        async getWeather() {
            this.currentDay.weather = this.weatherInfo.daily[0].weather[0].main;
            this.day1.weather = this.weatherInfo.daily[1].weather[0].main;
            this.day2.weather = this.weatherInfo.daily[2].weather[0].main;
            this.day3.weather = this.weatherInfo.daily[3].weather[0].main;
            this.day4.weather = this.weatherInfo.daily[4].weather[0].main;
            return;
        },
        async getTemps() {
            // Get current day temps
            this.currentDay.dayTempF = this.weatherInfo.daily[0].temp.day;
            this.currentDay.nightTempF = this.weatherInfo.daily[0].temp.night;

            // Get day 1 temps
            this.day1.dayTempF = this.weatherInfo.daily[1].temp.day;
            this.day1.nightTempF = this.weatherInfo.daily[1].temp.night;

            // Get day 2 temps
            this.day2.dayTempF = this.weatherInfo.daily[2].temp.day;
            this.day2.nightTempF = this.weatherInfo.daily[2].temp.night;

            // Get day 3 temps
            this.day3.dayTempF = this.weatherInfo.daily[3].temp.day;
            this.day3.nightTempF = this.weatherInfo.daily[3].temp.night;

            // Get day 4 temps
            this.day4.dayTempF = this.weatherInfo.daily[4].temp.day;
            this.day4.nightTempF = this.weatherInfo.daily[4].temp.night;

            // get Celsius temps
            this.currentDay.dayTempC = await this.getCelsiusTemps(this.currentDay.dayTempF);
            this.currentDay.nightTempC = await this.getCelsiusTemps(this.currentDay.nightTempF);

            this.day1.dayTempC = await this.getCelsiusTemps(this.day1.dayTempF);
            this.day1.nightTempC = await this.getCelsiusTemps(this.day1.nightTempF);

            this.day2.dayTempC = await this.getCelsiusTemps(this.day2.dayTempF);
            this.day2.nightTempC = await this.getCelsiusTemps(this.day2.nightTempF);

            this.day3.dayTempC = await this.getCelsiusTemps(this.day3.dayTempF);
            this.day3.nightTempC = await this.getCelsiusTemps(this.day3.nightTempF);

            this.day4.dayTempC = await this.getCelsiusTemps(this.day4.dayTempF);
            this.day4.nightTempC = await this.getCelsiusTemps(this.day4.nightTempF);

            // Truncate values
            this.currentDay.dayTempF = parseInt(this.currentDay.dayTempF);
            this.currentDay.nightTempF = parseInt(this.currentDay.nightTempF);

            this.day1.dayTempF = parseInt(this.day1.dayTempF);
            this.day1.nightTempF = parseInt(this.day1.nightTempF);

            this.day2.dayTempF = parseInt(this.day2.dayTempF);
            this.day2.nightTempF = parseInt(this.day2.nightTempF);

            this.day3.dayTempF = parseInt(this.day3.dayTempF);
            this.day3.nightTempF = parseInt(this.day3.nightTempF);

            this.day4.dayTempF = parseInt(this.day4.dayTempF);
            this.day4.nightTempF = parseInt(this.day4.nightTempF);

            this.currentDay.dayTempC = parseInt(this.currentDay.dayTempC);
            this.currentDay.nightTempC = parseInt(this.currentDay.nightTempC);

            this.day1.dayTempC = parseInt(this.day1.dayTempC);
            this.day1.nightTempC = parseInt(this.day1.nightTempC);

            this.day2.dayTempC = parseInt(this.day2.dayTempC);
            this.day2.nightTempC = parseInt(this.day2.nightTempC);

            this.day3.dayTempC = parseInt(this.day3.dayTempC);
            this.day3.nightTempC = parseInt(this.day3.nightTempC);

            this.day4.dayTempC = parseInt(this.day4.dayTempC);
            this.day4.nightTempC = parseInt(this.day4.nightTempC);

            // assign temps to fahrenheit temps 
            this.currentDay.dayTemp = this.currentDay.dayTempF;
            this.currentDay.nightTemp = this.currentDay.nightTempF;

            this.day1.dayTemp = this.day1.dayTempF;
            this.day1.nightTemp = this.day1.nightTempF;

            this.day2.dayTemp = this.day2.dayTempF;
            this.day2.nightTemp = this.day2.nightTempF;

            this.day3.dayTemp = this.day3.dayTempF;
            this.day3.nightTemp = this.day3.nightTempF;

            this.day4.dayTemp = this.day4.dayTempF;
            this.day4.nightTemp = this.day4.nightTempF;

            

            return;
        },
        async getHumidity() {
            this.currentDay.humidity = this.weatherInfo.daily[0].humidity;
            this.day1.humidity = this.weatherInfo.daily[1].humidity;
            this.day2.humidity = this.weatherInfo.daily[2].humidity;
            this.day3.humidity = this.weatherInfo.daily[3].humidity;
            this.day4.humidity = this.weatherInfo.daily[4].humidity;
            return;
        },
        async getSummaries() {
            this.currentDay.summary = this.weatherInfo.daily[0].summary + ".";
            this.day1.summary = this.weatherInfo.daily[1].summary + ".";
            this.day2.summary = this.weatherInfo.daily[2].summary + ".";
            this.day3.summary = this.weatherInfo.daily[3].summary + ".";
            this.day4.summary = this.weatherInfo.daily[4].summary + ".";
            return;
        },
        changeTempType() {
            if (this.tempUnit == 'F') {
                this.tempUnit = 'C';
                
                this.currentDay.dayTemp = this.currentDay.dayTempC;
                this.currentDay.nightTemp = this.currentDay.nightTempC;

                this.day1.dayTemp = this.day1.dayTempC;
                this.day1.nightTemp = this.day1.nightTempC;

                this.day2.dayTemp = this.day2.dayTempC;
                this.day2.nightTemp = this.day2.nightTempC;

                this.day3.dayTemp = this.day3.dayTempC;
                this.day3.nightTemp = this.day3.nightTempC;

                this.day4.dayTemp = this.day4.dayTempC;
                this.day4.nightTemp = this.day4.nightTempC;
            }
            else if (this.tempUnit == 'C') {
                this.tempUnit = 'F';
                
                this.currentDay.dayTemp = this.currentDay.dayTempF;
                this.currentDay.nightTemp = this.currentDay.nightTempF;

                this.day1.dayTemp = this.day1.dayTempF;
                this.day1.nightTemp = this.day1.nightTempF;

                this.day2.dayTemp = this.day2.dayTempF;
                this.day2.nightTemp = this.day2.nightTempF;

                this.day3.dayTemp = this.day3.dayTempF;
                this.day3.nightTemp = this.day3.nightTempF;

                this.day4.dayTemp = this.day4.dayTempF;
                this.day4.nightTemp = this.day4.nightTempF;
            }

            return;
        },

        async getCelsiusTemps(tempF) {
            let tempC = null;
            tempC = (tempF - 32) * 5/9;
            return tempC;
        }
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
    }
}
</script>

<style scoped>

.five-day-forecast {
    color: white;
}

div.five-day-forecast > h1 {
    text-align: center;
    font-size: 32pt;
    text-shadow: 0 0px 5px rgb(0, 27, 48, .7);
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 1em;    
}

.forecast-info {
    max-height: 60vh;
    overflow-y: scroll;
    margin: 0;
}

.day {
    background: linear-gradient(to right, rgba(42, 75, 109, 0.9), rgba(24, 52, 75, 0.9));
    border: none;
    border: 2px solid #06293f;
    margin: 1%;
    margin-bottom: 5%;
    margin-top: 0;
    border-radius: 10px;
}

.day h2 {
    font-size: 20pt;
    text-shadow: 0 0px 5px rgba(0, 27, 48, 0.7);
    padding: 1% 2%;
    margin: 0;
    margin-bottom: 2%;
    border-bottom: 1px solid #06293f;
}

.day table {
    padding: 0 2%;
    color: #caddf4;
    width: 100%;
    text-align: center;
}

.day table th {
    font-size: 16pt;
    font-weight: 500;
}

.day table td {
    font-size: 15pt;
    color: white;
}

.day p {
    font-size: 13pt;
    margin-top: 2%;
    font-weight: 300;
    padding: 2%;
    text-align: center;
}

@media screen and (min-width: 700px) {
    div.five-day-forecast > h1 {
        font-size: 40pt;
    }

    .day {
        width: 90%;
        margin: 2% auto;
        margin-top: 0;
        margin-bottom: 5%;
    }

    .day h2 {
        font-size: 25pt;
    }

    .day table th {
        font-size: 20pt;
    }

    .day table td {
        font-size: 18pt;
    }

    .day p {
        font-size: 18pt;
    }
}

@media screen and (min-width: 1400px) {
    .day {
        width: 70%;
        margin-bottom: 3%;
    }

    .day h2 {
        font-size: 35pt;
    }

    .day table th {
        font-size: 28pt;
    }

    .day table td {
        font-size: 23pt;
    }

    .day p {
        font-size: 20pt;
    }
}

@media screen and (min-width: 1700px) {
    
    .forecast-info::-webkit-scrollbar {
        width: 10px;
    }

    .forecast-info::-webkit-scrollbar-track {
        background-color:transparent;
    }

    .forecast-info::-webkit-scrollbar-thumb {
        background-color: rgb(255, 255, 255, .5);
    }

    .day {
        width: 55%;
    }

    .day h2 {
        font-size: 30pt;
    }

    .day table th {
        font-size: 25pt;
    }

    .day table td {
        font-size: 20pt;
    }

    .day p {
        font-size: 18pt;
    }
}
</style>