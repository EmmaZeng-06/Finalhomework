// Gets Date and formats it. Day of week, Month, Day, Year.
function NowDate(){
	let today = new Date();
	let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	let Day = days[today.getDay()];
	let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	let Month = months[today.getMonth()];
	let day= today.getDate();
	let year = today.getFullYear();
	
	let TodayDate = Day + " " + Month + " " + day + ", " + year;
	
document.getElementById("date").innerHTML=`${TodayDate}`;
}

//run NowDate function when page finishes loading and calls API with Paris as default city.
document.addEventListener('DOMContentLoaded', function(event) {
	NowDate();
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=paris&units=metric&appid=c97872f5d15e19929c3893fba1d07718`;
	axios.get(apiUrl)
	.then(showTemp);

	let apiUrlDaily = `http://api.weatherapi.com/v1/forecast.json?key=38ffb6f2f8b2456f88943110202911&q=paris&days=10`;
	axios.get(apiUrlDaily)
	.then(showDailyC);	

})

//calls API.
function API(cityInput) {
	let apiKey = "c97872f5d15e19929c3893fba1d07718";
	let cityRaw = document.getElementById('city_form').elements['city_text'].value;
	let city = cityRaw.replace(/\s/g, '+'); // Replaces space with + for URL. For Example: Los Angeles = Los+Angeles.
	let unit = "metric"; // Units of measurement; standard, metric, imperial.
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
	axios.get(apiUrl)
	.then(showTemp);
}

//Response of the API Call.
function showTemp(response){
	
	NowDate();
	
	let cityName = response.data.name;
	document.getElementById("location_city").innerHTML=`${cityName}`;

	let forecast = response.data.weather[0].main;
	document.getElementById("forecast").innerHTML=`${forecast}`;

	let humidityRaw = response.data.main.humidity;
	let humidity = "Humidity: " + humidityRaw + "%"
	document.getElementById("humidity").innerHTML=`${humidity}`;

	let windRaw = response.data.wind.speed;
	let windConvert = windRaw * 3.6;
	let wind = "Wind: " + windConvert.toFixed(0) + " km/h"
	document.getElementById("wind").innerHTML=`${wind}`;


	let tempRaw = response.data.main.temp;
	let tempDecimal = tempRaw.toFixed(0);
	let temp = tempDecimal + "&#176;";
	document.getElementById("temp").innerHTML=`${temp}`;
	
	
	let Class = document.getElementById("temp").className;
	let RemoveClass = document.getElementById("temp").removeAttribute("class");
	let tempClass = document.getElementById("temp").classList.add(tempDecimal);
	document.getElementById("celsius").removeEventListener("click", FtoC);
	document.getElementById("fahrenheit").addEventListener("click", CtoF);
	
}

//Calls API when user clicks submits the form.
let ClickEvent = document.getElementById("city_search").addEventListener("click", API);

//Convert C to F.
function CtoF(){

	let Cel = document.getElementById("temp").className;
	let ctoF = (Cel * 9/5) + 32; 
	let ctoFFixed = ctoF.toFixed(0) + "&#176;";

	document.getElementById("temp").innerHTML=`${ctoFFixed}`;
	
	let RemoveClass = document.getElementById("temp").removeAttribute("class");
	
	let tempClass = document.getElementById("temp").classList.add(ctoF.toFixed(0));
	let CtoFEventRemove = document.getElementById("fahrenheit").removeEventListener("click", CtoF);
	document.getElementById("celsius").addEventListener("click", FtoC);
	DailyF();
}

function FtoC(){
	let Cel = document.getElementById("temp").className;
	let FtoCel = (Cel - 32) * 5/9;
	let FtoCFixed = FtoCel.toFixed(0) + "&#176;";
	document.getElementById("temp").innerHTML=`${FtoCFixed}`;
	

	let RemoveClass = document.getElementById("temp").removeAttribute("class");
	
	let tempClass = document.getElementById("temp").classList.add(FtoCel.toFixed(0));
	
	document.getElementById("celsius").removeEventListener("click", FtoC);
	document.getElementById("fahrenheit").addEventListener("click", CtoF);
	DailyC();
}


//Geo coordinates  API
let GeoClickEvent = document.getElementById("current").addEventListener("click", getCurrentPosition);

function showPosition(position){
	let GeoApiKey = "c97872f5d15e19929c3893fba1d07718";
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;
	let GeoApiUrl = `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${GeoApiKey}`;
	
	axios.get(GeoApiUrl)
	.then(GeoShowTemp);
}

function getCurrentPosition(){
	navigator.geolocation.getCurrentPosition(showPosition) ;
}

function GeoShowTemp(response){
	NowDate();
	
	let cityName = response.data.name;
	document.getElementById("location_city").innerHTML=`${cityName}`;
	
	let forecast = response.data.weather[0].main;
	document.getElementById("forecast").innerHTML=`${forecast}`;
	
	let humidityRaw = response.data.main.humidity;
	let humidity = "Humidity: " + humidityRaw + "%"
	document.getElementById("humidity").innerHTML=`${humidity}`;
	
	let windRaw = response.data.wind.speed;
	let windConvert = windRaw * 3.6;
	let wind = "Wind: " + windConvert.toFixed(0) + " km/h"
	document.getElementById("wind").innerHTML=`${wind}`;
	
	
	let tempRaw = response.data.main.temp;
	let tempDecimal = tempRaw.toFixed(0);
	let temp = tempDecimal + "&#176;";
	document.getElementById("temp").innerHTML=`${temp}`;
	
	let Class = document.getElementById("temp").className;
	let stripClass = Class.replace(/\D/g, '');
	let RemoveClass = document.getElementById("temp").classList.remove(stripClass);
	let tempClass = document.getElementById("temp").classList.add(tempDecimal);

}




//7 Day Forecast

let ClickEventDaily = document.getElementById("city_search").addEventListener("click", DailyC);

function DailyF(){
	
	let cityRaw = document.getElementById('city_form').elements['city_text'].value;
	let city = cityRaw.replace(/\s/g, '_'); // Replaces space with + for URL. For Example: Los Angeles = Los+Angeles.
	
	let apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=38ffb6f2f8b2456f88943110202911&q=${city}&days=10`;
	axios.get(apiUrl)
	.then(showDailyF);	
}

function DailyC(){
	
	let cityRaw = document.getElementById('city_form').elements['city_text'].value;
	let city = cityRaw.replace(/\s/g, '_'); // Replaces space with + for URL. For Example: Los Angeles = Los+Angeles.
	
	let apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=38ffb6f2f8b2456f88943110202911&q=${city}&days=10`;
	axios.get(apiUrl)
	.then(showDailyC);	
}



function showDailyF(response){
	let _00 = response.data.forecast.forecastday[0].hour[0].temp_f;
	let _04 = response.data.forecast.forecastday[0].hour[4].temp_f;
	let _08 = response.data.forecast.forecastday[0].hour[8].temp_f;
	let _12 = response.data.forecast.forecastday[0].hour[12].temp_f;
	let _16 = response.data.forecast.forecastday[0].hour[16].temp_f;
	let _20 = response.data.forecast.forecastday[0].hour[20].temp_f;
	
	let temp_00 = _00.toFixed(0) + "&#176;";
	let temp_04 = _04.toFixed(0) + "&#176;";
	let temp_08 = _08.toFixed(0) + "&#176;";
	let temp_12 = _12.toFixed(0) + "&#176;";
	let temp_16 = _16.toFixed(0) + "&#176;";
	let temp_20 = _20.toFixed(0) + "&#176;";
	
	document.getElementById("_00").innerHTML=`${temp_00}`;
	document.getElementById("_04").innerHTML=`${temp_04}`;
	document.getElementById("_08").innerHTML=`${temp_08}`;
	document.getElementById("_12").innerHTML=`${temp_12}`;
	document.getElementById("_16").innerHTML=`${temp_16}`;
	document.getElementById("_20").innerHTML=`${temp_20}`;
	
	let icon_00 = response.data.forecast.forecastday[0].hour[0].condition.icon;
	let icon_04 = response.data.forecast.forecastday[0].hour[4].condition.icon;
	let icon_08 = response.data.forecast.forecastday[0].hour[8].condition.icon;
	let icon_12 = response.data.forecast.forecastday[0].hour[12].condition.icon;
	let icon_16 = response.data.forecast.forecastday[0].hour[16].condition.icon;
	let icon_20 = response.data.forecast.forecastday[0].hour[20].condition.icon;
	
	let src_00 = icon_00.slice(35);
	let src_04 = icon_04.slice(35);
	let src_08 = icon_08.slice(35);
	let src_12 = icon_12.slice(35);
	let src_16 = icon_16.slice(35);
	let src_20 = icon_20.slice(35);
	
	document.getElementById("IMG_00").src = "weather/" + src_00;
	document.getElementById("IMG_04").src = "weather/" + src_04;
	document.getElementById("IMG_08").src = "weather/" + src_08;
	document.getElementById("IMG_12").src = "weather/" + src_12;
	document.getElementById("IMG_16").src = "weather/" + src_16;
	document.getElementById("IMG_20").src = "weather/" + src_20;
	
}

function showDailyC(response){
	let _00 = response.data.forecast.forecastday[0].hour[0].temp_c;
	let _04 = response.data.forecast.forecastday[0].hour[4].temp_c;
	let _08 = response.data.forecast.forecastday[0].hour[8].temp_c;
	let _12 = response.data.forecast.forecastday[0].hour[12].temp_c;
	let _16 = response.data.forecast.forecastday[0].hour[16].temp_c;
	let _20 = response.data.forecast.forecastday[0].hour[20].temp_c;
	
	let temp_00 = _00.toFixed(0) + "&#176;";
	let temp_04 = _04.toFixed(0) + "&#176;";
	let temp_08 = _08.toFixed(0) + "&#176;";
	let temp_12 = _12.toFixed(0) + "&#176;";
	let temp_16 = _16.toFixed(0) + "&#176;";
	let temp_20 = _20.toFixed(0) + "&#176;";
	
	document.getElementById("_00").innerHTML=`${temp_00}`;
	document.getElementById("_04").innerHTML=`${temp_04}`;
	document.getElementById("_08").innerHTML=`${temp_08}`;
	document.getElementById("_12").innerHTML=`${temp_12}`;
	document.getElementById("_16").innerHTML=`${temp_16}`;
	document.getElementById("_20").innerHTML=`${temp_20}`;
	
	let icon_00 = response.data.forecast.forecastday[0].hour[0].condition.icon;
	let icon_04 = response.data.forecast.forecastday[0].hour[4].condition.icon;
	let icon_08 = response.data.forecast.forecastday[0].hour[8].condition.icon;
	let icon_12 = response.data.forecast.forecastday[0].hour[12].condition.icon;
	let icon_16 = response.data.forecast.forecastday[0].hour[16].condition.icon;
	let icon_20 = response.data.forecast.forecastday[0].hour[20].condition.icon;
	
	let src_00 = icon_00.slice(35);
	let src_04 = icon_04.slice(35);
	let src_08 = icon_08.slice(35);
	let src_12 = icon_12.slice(35);
	let src_16 = icon_16.slice(35);
	let src_20 = icon_20.slice(35);
	
	document.getElementById("IMG_00").src = "weather/" + src_00;
	document.getElementById("IMG_04").src = "weather/" + src_04;
	document.getElementById("IMG_08").src = "weather/" + src_08;
	document.getElementById("IMG_12").src = "weather/" + src_12;
	document.getElementById("IMG_16").src = "weather/" + src_16;
	document.getElementById("IMG_20").src = "weather/" + src_20;
	
}


//Geo Location API Call
