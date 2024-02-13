// Function to fetch data from a specified endpoint and log it to the console
function fetchDataAndPopulateTableAndChart(endpoint) {
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            populateTable(data);
            generatePlotlyChart(data, endpoint);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to populate the table based on the data
function populateTable(data) {
    var table = $('#dataTable').DataTable();
    table.clear();
    table.destroy(); // Destroy the existing table instance

    // Dynamically create table headers based on the first row of data
    const thead = $('#dataTable thead');
    thead.empty(); // Clear existing headers

    const headerRow = $('<tr>');
    Object.keys(data[0]).forEach(key => {
        headerRow.append($('<th>').text(key));
    });

    thead.append(headerRow);

    // Reinitialize the DataTable
    table = $('#dataTable').DataTable();

    // Add rows to the table based on the data
    data.forEach(row => {
        var rowData = Object.values(row);
        table.row.add(rowData);
    });

    table.draw();
}

// Function to generate a Plotly chart
function generatePlotlyChart(data, endpoint) {
    const fields = Object.keys(data[0]);
    let chartData;

    if (endpoint === '/top10gamespercountry') {
        chartData = createMultipleTraces(data, fields);
    } else {
        chartData = [transformDataForPlotly(data, fields, endpoint)];
    }

    // Define layout for the chart, including axis titles
    let layout = {
        title: 'Dynamic Chart',
        xaxis: {
            title: getAxisTitle(fields, endpoint, 'x') // Set x-axis title
        },
        yaxis: {
            title: getAxisTitle(fields, endpoint, 'y') // Set y-axis title
        }
    };

    Plotly.newPlot('myPlotlyChart', chartData, layout);
}

// Helper function to determine the axis title based on the endpoint and axis type ('x' or 'y')
function getAxisTitle(fields, endpoint, axisType) {
    switch (endpoint) {
        case '/top10gamespercountry':
            return axisType === 'x' ? fields[1] : fields[2];
        case '/genrereview':
            return axisType === 'x' ? fields[2] : fields[0];
        case '/genre_totals':
            return axisType === 'x' ? fields[0] : fields[1];
        case '/ccu_ratio':
            return axisType === 'x' ? fields[4] : fields[2];
        case '/api/adventure':
        case '/api/action':
        case '/api/indie':
        case '/api/rpg':
        case '/api/simulation':
        case '/api/sports':
        case '/api/strategy':
            return axisType === 'x' ? fields[9] : fields[3];
        default:
            return ''; // Default or unknown endpoint
    }
}

function createMultipleTraces(data, fields) {
    // Filter data to include only items with "Global" in column 0
    const globalData = data.filter(item => item[fields[0]] === 'Global');

    // Group the original data by the unique values in column 0
    let groupedData = {};
    data.forEach(item => {
        const key = item[fields[0]];
        if (!groupedData[key]) {
            groupedData[key] = [];
        }
        groupedData[key].push(item);
    });

    // Create traces
    let traces = [];

    // Trace for 'Global' items
    if (globalData.length > 0) {
        traces.push({
            x: globalData.map(item => item[fields[1]]),
            y: globalData.map(item => item[fields[2]]),
            type: 'scatter',
            mode: 'lines',
            name: 'Global',
            line: {
                color: 'black' // Distinct color for 'Global'
            }
        });
    }

    // Dots for other items
    Object.keys(groupedData).forEach((key, index) => {
        if (key !== 'Global') {
            traces.push({
                x: groupedData[key].map(item => item[fields[1]]),
                y: groupedData[key].map(item => item[fields[2]]),
                type: 'scatter',
                mode: 'markers', // Represent as dots
                name: key,
                marker: {
                    color: getRandomColor(index) // Assign a unique color
                }
            });
        }
    });

    return traces;
}

function getRandomColor(index) {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'brown', 'pink', 'grey', 'black']; // Extend with more colors if needed
    return colors[index % colors.length];
}

// Updated transformDataForPlotly function to include logic for specific endpoints
function transformDataForPlotly(data, fields, endpoint) {
    let x, y;

    // Function to get top 10 items based on a field (descending order)
    function getTop10Items(data, field) {
        return data
            .sort((a, b) => b[field] - a[field]) // Sort in descending order
            .slice(0, 10); // Get top 10 items
    }

    switch (endpoint) {
        case '/top10gamespercountry':
            // Random selection logic (make sure pickRandomItems is defined)
            const randomData = pickRandomItems(data);
            x = randomData.map(item => item[fields[1]]);
            y = randomData.map(item => item[fields[2]]);
            break;
        case '/genrereview':
            // Standard mapping
            x = data.map(item => item[fields[2]]);
            y = data.map(item => item[fields[0]]);
            break;
        case '/genre_totals':
            // Standard mapping
            x = data.map(item => item[fields[0]]);
            y = data.map(item => item[fields[1]]);
            break;
        case '/ccu_ratio':
            const top10CCURatioItems = getTop10Items(data, fields[2]);
            x = top10CCURatioItems.map(item => item[fields[4]]);
            y = top10CCURatioItems.map(item => item[fields[2]]);
            break;
        case '/api/adventure':
        case '/api/action':
        case '/api/indie':
        case '/api/rpg':
        case '/api/simulation':
        case '/api/sports':
        case '/api/strategy':
            const top10GenreItems = getTop10Items(data, fields[12]);
            x = top10GenreItems.map(item => item[fields[9]]);
            y = top10GenreItems.map(item => item[fields[3]]);
            break;
        default:
            // Default mapping
            x = data.map(item => item[fields[0]]);
            y = data.map(item => item[fields[1]]);
            break;
    }

    return {
        x: x,
        y: y,
        type: 'scatter' // Assuming scatter as default chart type
    };
}

document.addEventListener('DOMContentLoaded', function () {
    // DataTable initialization
    $('#dataTable').DataTable();

    let defaultValue = "/top10gamespercountry";

    fetchDataAndPopulateTableAndChart(defaultValue);

    updateCardBodyText(defaultValue.substring(1));

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function (event) {
            let endpoint = event.target.getAttribute('data-value');
            document.getElementById('tableTitle').textContent = event.target.textContent;

            // Update the card body text based on the dropdown selection
            updateCardBodyText(endpoint);

            // Correctly format the endpoint for the API call
            if (endpoint === 'adventure' || endpoint === 'action' || endpoint === 'indie' || endpoint === 'rpg' || endpoint === 'simulation' || endpoint === 'sports' || endpoint === 'strategy') {
                endpoint = '/api/' + endpoint;
            } else {
                endpoint = '/' + endpoint;
            }

            fetchDataAndPopulateTableAndChart(endpoint);
        });
    });

    // Function to update text in the card body based on the selected endpoint
    function updateCardBodyText(endpoint) {
        const cardBodyTextDiv = document.querySelector('.card-body .chart-pie');
        switch (endpoint) {
            case 'top10gamespercountry':
                cardBodyTextDiv.textContent = 'Top 10 per Country: This table presents data about the top 10 video games in various countries. The purpose of this table is to show which games are most popular or have the highest sales in different countries.';
                break;
            case 'genrereview':
                cardBodyTextDiv.textContent = 'Genre Review Ratios: This table displays data related to the review ratios of different game genres. It includes the mean & median rations for each genre. This information is useful for understanding which genres are best received by the audience or critics.';
                break;
            case 'genre_totals':
                cardBodyTextDiv.textContent = 'This table aggregates data by game genre, showing totals of key metrics. These metrics include Genre and Total Concurrent Users. It provides a comprehensive view of the performance or popularity of each genre.';
                break;
            case 'ccu_ratio':
                cardBodyTextDiv.textContent = 'CCU Ratio: The "CCU Ratio" stands for Concurrent User Ratio. This table show data related to the number of concurrent users for different games. This includes information on the Games, Concurrent User and Price.';
                break;
            case 'adventure':
                cardBodyTextDiv.textContent = 'Adventure Games: This table specifically focuses on adventure genre games. It display various statistics or information specific to adventure games, such as release dates, developers, sales figures, or user ratings.';
                break;
            case 'action':
                cardBodyTextDiv.textContent = 'Action Games: This table specifically focuses on action genre games. It display various statistics or information specific to action games, such as release dates, developers, sales figures, or user ratings.';
                break;
            case 'indie':
                cardBodyTextDiv.textContent = 'Indie Games: This table specifically focuses on indie genre games. It display various statistics or information specific to indie games, such as release dates, developers, sales figures, or user ratings.';
                break;
            case 'rpg':
                cardBodyTextDiv.textContent = 'RPG Games: This table specifically focuses on RPG genre games. It display various statistics or information specific to RPG games, such as release dates, developers, sales figures, or user ratings.';
                break;
            case 'simulation':
                cardBodyTextDiv.textContent = 'Simulation Games: This table specifically focuses on simulation genre games. It display various statistics or information specific to simulation games, such as release dates, developers, sales figures, or user ratings.';
                break;
            case 'sports':
                cardBodyTextDiv.textContent = 'Sports Games: This table specifically focuses on sports genre games. It display various statistics or information specific to sports games, such as release dates, developers, sales figures, or user ratings.';
                break;
            case 'strategy':
                cardBodyTextDiv.textContent = 'Strategy Games: This table specifically focuses on strategystrategy genre games. It display various statistics or information specific to strategy games, such as release dates, developers, sales figures, or user ratings.';
                break;
            default:
                cardBodyTextDiv.textContent = 'Select an option to display data';
        }
    }
});

