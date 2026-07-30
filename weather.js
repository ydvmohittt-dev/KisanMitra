let button=document.querySelector(".submit-btn");

button.addEventListener("click",(e)=>{
e.preventDefault();
let state=document.getElementById("state").value;
let village=document.getElementById("village").value;
let city=document.getElementById("city").value;
async function fetchweather(){
  let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ce8e9c81e304ee883dd5159d1a7c99d6&units=metric`)
let data=await response.json(); 
return data;
}
async function getWeather(){
let weather= await fetchweather();
console.log(weather);
document.querySelector(".weather-header h2").textContent=`${village}, ${city}, ${state}`;
const date = new Date(weather.dt * 1000);

const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
});
document.querySelector(".weather-header p").textContent=`Today, ${formattedDate}`;
document.querySelector(".temperature-box h1").textContent=`${weather.main.temp}°C`


}
getWeather();
})





















