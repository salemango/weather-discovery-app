'use client'
import axios from 'axios';


let searchQuery = '';

async function getData(query) {
    query = formatQuery(query);

    searchQuery = query;

    var geocodingResults = await geocodingCall(searchQuery);
    return geocodingResults;
}

async function geocodingCall(searchQuery) {
    var geocodingResults;
    var apiKey = '79159695d5493548f7e48890afac0eb2';
    var geocodingPrefix = 'http://api.openweathermap.org/geo/1.0/direct?q=';

    await axios 
    .get(`${geocodingPrefix}${searchQuery}&limit=1&appid=${apiKey}`)
    .then((response => {
        geocodingResults = response.data;
        geocodingResults = geocodingResults[0];           
    }));

    return geocodingResults;
}

async function getWeatherData(lat, long) {
    var weatherData = null;
    var oneCallPrefix = 'https://api.openweathermap.org/data/3.0/onecall?lat=';
    var apiKey = '79159695d5493548f7e48890afac0eb2';

    
    weatherData = await weatherCall(oneCallPrefix, apiKey, lat, long);
    return weatherData;
}

async function weatherCall(oneCallPrefix, apiKey, lat, long) {
    var weatherData;

    await axios 
    .get(`${oneCallPrefix}${lat}&lon=${long}&units=imperial&appid=${apiKey}`)
    .then((response => {
        weatherData = response.data;
    }));   

    return weatherData;
}

function formatQuery(query) { // Replace spaces in query with dash -- works as intended
    return query.replace(/ /g, "-");
}

export {
    getData, getWeatherData, searchQuery
}

