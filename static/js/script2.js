const url = "/genrereview";

function createChart(genres) {

    var labels = genres.map(function (game) {
        return game["Unnamed: 0"];
    });

    var data = genres.map(function (game) {
        return game["Mean_Ratio"];
    });

    var total = data.reduce(function (a, b) {
        return a + b;
    }, 0);

    // Calculate percentages
    var percentages = data.map(function (value) {
        return ((value / total) * 100).toFixed(2) + "%";
    });

    // Get the canvas element
    var ctx = document.getElementById('myPieChart').getContext('2d');

    // Create the pie chart

    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'red', 'blue', 'green', 'orange', 'purple', 'yellow', 'cyan'
                ], // Add more colors as needed
                hoverBackgroundColor: [
                    'red', 'blue', 'green', 'orange', 'purple', 'yellow', 'cyan'
                ]
            }]
        },
        options: {
            plugins: {
              datalabels: {
                formatter: function(value, context) {
                  return context.chart.data.labels[percentages];
                }
              }
            }
          }

    });
}


function getData(callback) {
    fetch(url)
        .then(response => response.json())
        .then((data) => {
            callback(data);
            console.log(data);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}


document.addEventListener('DOMContentLoaded', function () {


    getData((data) => {
        globalData = data;

        createChart(globalData);

    });

});