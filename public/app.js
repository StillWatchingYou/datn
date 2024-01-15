async function fetchData() {
    try {
        const response = await fetch('/api/data/fetch');

        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const data = await response.json();
        updateTable(data);
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

function updateTable(data) {
    const dataBody = document.getElementById('dataBody');

    // Clear existing rows
    dataBody.innerHTML = '';

    // Keep track of displayed rows
    const displayedRows = data.slice(-5);

    displayedRows.forEach(entry => {
        const row = document.createElement('tr');

        const timeCell = createTableCell(entry.timestamp);
        const humidityCell = createTableCell(entry.humidity);
        const temperatureCell = createTableCell(entry.temperature);

        row.appendChild(timeCell);
        row.appendChild(humidityCell);
        row.appendChild(temperatureCell);

        dataBody.appendChild(row);
    });
}

function createTableCell(content) {
    const cell = document.createElement('td');
    cell.textContent = content;
    return cell;
}

// Fetch data every 500 milliseconds
setInterval(fetchData, 500);
