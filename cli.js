#!/usr/bin/env node

import moment from "moment-timezone";
import fetch from "node-fetch";
import minimist from "minimist";

const args = minimist(process.argv.slice(2))

if (args.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.
    `);
    process.exit(0);
}

let latitude;
let longitude;
let timezone;
let days;   
let string;

if (args.n) {
    latitude = args.n;
} else if (args.s) {
    latitude = args.s * -1;
} else {
    console.log("Latitude must be in range");
    process.exit(0);
}

if(args.e) {
    longitude = args.e;
} else if(args.w) {
    longitude = -args.w;
} else {
    console.log("Longitude must be in range");
    process.exit(0);
} 

if (args.t) {
    timezone = args.t;
} else {
    timezone = moment.tz.guess();
}

if ("d" in args) {
    days = args.d 
} else {
    days = 1;
}

const url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&timezone=" + timezone + "&daily=precipitation_hours";
const response = await fetch(url);
const data = await response.json();

if(args.j) {
    console.log(data);
    process.exit(0)
}



if(data.daily.precipitation_hours[days] > 0) {
    string = "It's raining ";
} else {
    string = "It's sunny ";}
if (days == 0) {
    string += "today.";
} else if (days > 1) {
    string += "in " + days + " days.";
} else {
    string += "tomorrow.";
}  



console.log(string); 