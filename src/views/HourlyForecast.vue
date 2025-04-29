
<template>
    <div class="hourly-forecast">
        <h1>Hourly Forecast</h1>
        <div class="hourly-info">
            <ul class="select-graph">
                <li :class="{ active : tempF}" @click="getGraphType(1)">Temperature (F)</li>
                <li :class="{ active : tempC}" @click="getGraphType(2)">Temperature (C)</li>
                <li :class=" { active: precipitation } " @click="getGraphType(3)">Precipitation</li>
            </ul>
            <div class="chartAreaWrapper">
                <div class="chartArea"> 
                    <Line id="hourly-F-chart" :key="key" :data="temperatureFChartData" :options="ChartOptions" v-if="loaded && tempF"/>

                    <Line id="hourly-C-chart" :key="key" :data="temperatureCChartData" :options="ChartOptions" v-if="loaded && tempC"/>

                    <Line id="precipitation" :key="key" :data="precipitationData" :options="ChartOptions" v-if="loaded && precipitation"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js'


ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default {
    name: 'HourlyForecast',
    data() {
        return {
            temperatureFChartData: {
                labels: [ ],
                datasets: [
                    {
                        label: 'Fahrenheit Temperature',
                        data: []
                    }
                ]
            },
            temperatureCChartData: {
                labels: [ ],
                datasets: [
                    {
                        label: 'Celsius Temperature',
                        data: []
                    }
                ]
            },
            precipitationData: {
                labels: [ ],
                datasets: [{
                    label: 'Precipitation Amount',
                    data: [ ]
                }]
            },
            ChartOptions: {
                borderColor: '#06293f',
                color: '#06293F',
                backgroundColor: '#06293f',
                indexAxis: this.getGraphAlignment(),
                aspectRatio: .75,
                maintainAspectRatio: false,
                borderWidth: 2,
                tension: .25,
                pointRadius: 2,
                pointHitRadius: 10,
                stepSize: 5,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        backgroundColor: '#fff',
                        titleColor: '#06293f',
                        titleFont: {
                            size: 20,
                        },
                        bodyColor: '#06293f',
                        bodyFont: {
                            size: 15,
                        },
                        usePointStyle: true,
                        boxPadding: 5,
                    }
                },
                scales: {
                    x: {
                        position: 'top',
                        grid: {
                            color: '#caddf4',
                            lineWidth: 2,
                        },
                        ticks: {
                            color: '#06293f',
                            padding: 5,
                            font: {
                                size: 18,
                                family: 'Open Sans',
                            }
                        },
                    },
                    y: {
                        grid: {
                            color: '#caddf4',
                            lineWidth: 2,
                            drawTicks: true,
                        },
                        ticks: {
                            color: '#06293f',
                            padding: 5,
                            font: {
                                size: 18,
                                family: 'Open Sans', 
                            }
                        }
                    },
                }
            },
            labels: null,
            
            tempF: true,
            tempC: false,
            precipitation: false,

            weatherInfo: null,
            timezone: null,
            loaded: false,
            darkTheme: null,
            key: 1
        }
    },
    computed: {
        
    },
    props: {
        weatherData: Object,
    },
    components: { Line },
    methods: {
        async getData() {
            await this.getLabels();
            await this.getFTemperatures();
            await this.getCTemperatures();
            await this.getPrecip();
            await this.finishLoading();
            return;
        },  
        async getLabels() { 
            let i;
            this.timezone = this.weatherInfo.timezone_offset;
            let date, hours, minutes;
            let labelArray = [];

            // get hourly labels
            for (i = 0; i < 24; i++) {
                labelArray[i] = ((this.weatherInfo.hourly[i].dt  + this.timezone) * 1000);
                date = new Date(labelArray[i]);
                hours = date.getUTCHours();
                minutes = date.getUTCMinutes();
                if (minutes == 0) {
                    minutes = '00';
                }
                if (hours == 0) {
                    hours = 12;
                }
                if (hours > 12) {
                    hours = hours - 12;
                }
                labelArray[i] = hours + ":" + minutes;
            } 

            this.temperatureFChartData.labels = labelArray;
            this.temperatureCChartData.labels = labelArray;
            this.precipitationData.labels = labelArray;

            return;
        },
        
        async getFTemperatures() { // Get hourly temperatures for next 24 hours
            let i;
            let tempFArray = [];

            // get hourly temps 
            for (i = 0; i < 24; i++) {
                tempFArray[i] = this.weatherInfo.hourly[i].temp;
                tempFArray[i] = parseInt(tempFArray[i]);
            } 

            this.temperatureFChartData.datasets[0].data = tempFArray;

            return;
        },

        async getCTemperatures() {
            let i; 
            let tempCArray= [];

            for (i = 0; i < 24; i++) {
                tempCArray[i] = this.weatherInfo.hourly[i].temp;
                tempCArray[i] = this.FtoC(tempCArray[i]);
                tempCArray[i] = parseInt(tempCArray[i]);
            }

            this.temperatureCChartData.datasets[0].data = tempCArray;
            return;
        },

        async getPrecip() {
            let i;
            let precipArray = [];

            for (i = 0; i < 24; i++) {
                if (this.weatherInfo.hourly[i].rain) {
                    precipArray[i] = this.weatherInfo.hourly[i].rain['1h'];
                    console.log(precipArray[i]);
                }
                else if ( this.weatherInfo.hourly[i].snow) {
                    precipArray[i] = this.weatherInfo.hourly[i].snow['1h'];
                }
                else {
                    precipArray[i] = 0;
                }
                
                this.precipitationData.datasets[0].data = precipArray;
            }

            return;
        },  
        
        FtoC(temp) {
            temp = (temp - 32) * 5/9;
            return temp;
        },

        async finishLoading() {
            this.loaded = true;
        },
        
        getGraphAlignment() {
            let window = screen.width;

            if (window >= 1440) {
                return 'x'
            }
            else {
                return 'y'
            }
        },

        getGraphType(type) {
            
            if (type == 1) {
                this.tempF = true;
                this.tempC = false;
                this.precipitation = false;
            }
            else if ( type == 2 ) {
                this.tempC = true;
                this.tempF = false;
                this.precipitation = false;
            }
            else {
                this.precipitation = true;
                this.tempF = false;
                this.tempC = false;
            }
        }
    },
    mounted() {
        window.addEventListener('resize', this.getGraphAlignment);
    },
    watch: {
        weatherData: {
            async handler (newValue) {
                if (newValue) {
                    this.weatherInfo = await newValue;
                    this.key++;
                    await this.getData();
                }
            },
            immediate: true
        },
    }
}
</script>

<style scoped>

.hourly-forecast {
    color: white;
}

.hourly-forecast > h1 {
    font-size: 32pt;
    text-shadow: 0 0px 5px rgb(0, 27, 48, .7);
    margin-top: 20px;
    margin-bottom: 10px;
    line-height: 1em;
    text-align: center;
}

.select-graph {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin: 0;
    margin-bottom: 20px;
}

.select-graph li {
    list-style-type: none;
    padding: 0;
    margin: 0;
    font-size: 13pt;
    color: #fff;
    background-color: #264c78;
    padding: 1.5% 2%;
    font-weight: 300;
    border-radius: 5px;
    cursor: pointer;
}

.select-graph li.active {
    background-color: #06293f;
}

.chartAreaWrapper {
    position: relative;
    height: 60vh;
    overflow-y: scroll;
    padding: 2% 0;
    margin: 0 2%;
    border: 2px solid #caddf4;
    background-color: rgb(202, 221, 244, .5);
}

.chartArea {
    height: 200%;
    padding: 0;
    margin: 0;
    width: 100%;
}

#hourly-F-chart, #hourly-C-chart, #precipitation {
    color: #06293f;
    position: absolute;
    padding: 2% 0;
    top: 0;
    left: 0;
}

@media screen and (min-width: 700px) {
    
    .select-graph li {
        font-size: 15pt;
        padding: 1.5% 5%;
    }
    
    .chartAreaWrapper {
        height: 65vh;
    }
}

@media screen and (min-width: 1000px) {
    
    .chartAreaWrapper {
        overflow-y: scroll;
        height: 70vh;
    }
    
    .chartAreaWrapper::-webkit-scrollbar {
        background: none;
        width: 10px;
    }

    .chartAreaWrapper::-webkit-scrollbar-track {
        background-color: transparent;
    }

    .chartAreaWrapper::-webkit-scrollbar-thumb {
        background-color: white;
    }

}

@media screen and (min-width: 1400px) {
 
    .select-graph {
        justify-content: center;
        gap: 2%;
    }
   
    .select-graph li {
        padding: 1% 5%;
    }
    
    .chartAreaWrapper {
        height: 55vh;
        margin: 0 5%;
        padding: 0; 
    }

    .chartArea {
        padding: 0;
        margin: 0;
        height: 100%;
    }

    #hourly-F-chart, #hourly-C-chart, #precipitation {
        padding: 1.5%;
    }

}

@media screen and (min-width: 1700px) {
    .select-graph li {
        padding: .5% 2%;
    }
}

</style>