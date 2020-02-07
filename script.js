$(document).ready(function () {
    function show(data) {
        return "<h2>" + data.name + moment().format(" (MM/DD/YYYY)") + "</h2>" +
            `
        <p><strong>Temperature</strong>: ${data.main.temp} °F</p>
        <p><strong>Humidity</strong>: ${data.main.humidity}%</p>
        <p><strong>Wind Speed</strong>: ${data.wind.speed} MPH</p>
        `
    }
    function displayCities(cityList) {
        $(".city-list").empty();
        let list = localStorage.getItem("cityList");
        cityList = (JSON.parse(list));
        if (list) {
            for (let i = 0; i < cityList.length; i++) {
                let container = $("<div class=card></div>").text(cityList[i]);
                $(".city-list").prepend(container);
            }
        }
    }

    function showForecast(data) {
        let forecast = data.list; 
        let currentForecast = [];
        
        for (let i = 0; i < forecast.length; i++) {

            let currentObject = forecast[i];
            let dt_time = currentObject.dt_txt.split(' ')[1] 
            if (dt_time === "12:00:00") {
                let main = currentObject.main;
                let temp = main.temp; 
                let humidity = main.humidity;
                let date = moment(currentObject.dt_txt).format('l'); 
                let icon = currentObject.weather[0].icon;
                let iconurl = "https://openweathermap.org/img/w/" + icon + ".png";

                let htmlTemplate = `
            <div class="col-sm currentCondition">
            <div class="card">
                <div class="card-body 5-day">
                    <p><strong>${date}</strong></p>
                    <div><img src=${iconurl} /></div>
                    <p>Temp: ${temp} °F</p>
                    <p>Humidity: ${humidity}%</p>
                    
                </div>
            </div> 
        </div>`;
                currentForecast.push(htmlTemplate);
            }

        }
        $("#forecast").html(currentForecast.join(''));

    }
    
    let store = localStorage.getItem("cityList")
    if (store) {
        cityList = JSON.parse(store)
    } else {
        cityList = []
    }
    
    $('#search-button').click(function (event) {
        event.preventDefault();
        let city = $('#city').val();
        cityList.push(city);
        localStorage.setItem("cityList", JSON.stringify(cityList));
        
        displayCities(cityList);
        if (city != '') {

            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
                type: "GET",
                success: function (data) {
                    let display = show(data);
                    $("#today").html(display);
                }
            });

            $.ajax({
                url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + "&APPID=5650ba04d76cc8ddc64d65a07cda4c4a",
                type: "GET",
                success: function (data) {
                    let showWeek = showForecast(data);
                    $("#forecast").html(showWeek);
                    
                }
            });

        } else {
            $('#error').html('Enter city');
        }
    });

    displayCities(cityList);

});