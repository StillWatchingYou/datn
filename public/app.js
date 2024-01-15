async function fetchData() {
    const response = await fetch('/api/data');
    const data = await response.json();

    const dataBody = document.getElementById('dataBody');
    dataBody.innerHTML = '';

    data.forEach(entry => {
        const row = document.createElement('tr');

        const timeCell = document.createElement('td');
        timeCell.textContent = entry.timestamp;

        const humidityCell = document.createElement('td');
        humidityCell.textContent = entry.humidity;

        const temperatureCell = document.createElement('td');
        temperatureCell.textContent = entry.temperature;

        row.appendChild(timeCell);
        row.appendChild(humidityCell);
        row.appendChild(temperatureCell);

        dataBody.appendChild(row);
    });
}

setInterval(() => { fetchData() }, 500);