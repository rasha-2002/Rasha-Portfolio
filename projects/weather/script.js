async function getWeather() {

    const cityInput = document.getElementById("city-input");
    const result = document.getElementById("weather-result");

    const city = cityInput.value.trim();

    if (city === "") {
        result.innerHTML = `
            <p class="message">
                Please enter a city name.
            </p>
        `;
        return;
    }

    result.innerHTML = `
        <p class="message">Loading...</p>
    `;

    try {

        // Find the city
        const locationResponse = await fetch(
            https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            result.innerHTML = `
                <p class="message">City not found.</p>
            `;
            return;
        }

        const location = locationData.results[0];

        // Get weather information
        const weatherResponse = await fetch(
            https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        const temperature = current.temperature_2m;
        const humidity = current.relative_humidity_2m;
        const windSpeed = current.wind_speed_10m;
        const weatherCode = current.weather_code;

        // Weather condition
        const weather = getWeatherCondition(weatherCode);

        result.innerHTML = `
            <div class="weather-info">

                <div class="weather-icon">
                    ${weather.icon}
                </div>

                <h2>${location.name}</h2>

                <p class="condition">
                    ${weather.text}
                </p>

                <p class="temperature">
                    ${temperature}°C
                </p>

                <div class="weather-details">

                    <p>
                        💧 Humidity
                        <strong>${humidity}%</strong>
                    </p>

                    <p>
                        💨 Wind
                        <strong>${windSpeed} km/h</strong>
                    </p>

                </div>

            </div>
        `;

    } catch (error) {

        result.innerHTML = `
            <p class="message">
                Something went wrong. Please try again.
            </p>
        `;

        console.error(error);
    }
}


function getWeatherCondition(code) {

    if (code === 0) {
        return {
            text: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code >= 1 && code <= 3) {
        return {
            text: "Partly Cloudy",
            icon: "⛅"
        };
    }

    if (code >= 45 && code <= 48) {
        return {
            text: "Foggy",
            icon: "🌫️"
        };
    }

    if (code >= 51 && code <= 67) {
        return {
            text: "Rainy",
            icon: "🌧️"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            text: "Snowy",
            icon: "❄️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            text: "Rain Showers",
            icon: "🌦️"
        };
    }

    if (code >= 95) {
        return {
            text: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        text: "Unknown",
        icon: "🌤️"
    };
}