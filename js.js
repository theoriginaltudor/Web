var apiKey = 'c7a51e915daab2f279b969ecbed75c11';
var result = document.getElementById("result"),
    amount = document.getElementById("amount"),
    curr = document.getElementById("currency"),
    bani,
    table = document.getElementById('table');

$(document).ready(function () {
    info();
    listOffers();
    setInterval(info, 1000);
    setInterval(listOffers, 10000);
    // setInterval(sell, 5000);

});

function info() {
    $.ajax({
        'url': 'http://52.57.228.6/man2API/php/BankPhp.php',
        'type': 'GET',
        'data': {
            'what': 'account_info',
            'apikey': apiKey
        },
        'success': function (dataString) {
            var data = JSON.parse(dataString);
            amount.innerHTML = data.data[0].amount;
            bani = data.data[0].amount;
            curr.innerHTML = data.data[0].currency;
        }
    });
}

function listOffers() {
    $.ajax({
        'url': 'http://52.57.228.6/man2API/php/BankPhp.php',
        'type': 'GET',
        'data': {
            'what': 'offers',
            'apikey': apiKey
        },
        'success': function (dataString) {
            var data = JSON.parse(dataString);
            exchangeTable(data.data);
        },
        'error': function (errorString) {
            console.log(errorString);
        }
    })
}

function exchangeTable(dataOffers) {
    result.innerHTML = '';
    table.innerHTML = '';
    dataOffers.forEach(function (el) {
        $.ajax({
            'url': 'http://52.57.228.6/man2API/php/BankPhp.php',
            'type': 'GET',
            'data': {
                'what': 'exchange_rate',
                'from': curr.innerHTML,
                'to': el.currency,
                'apikey': apiKey
            },
            'success': function (dataString) {
                var dataX = JSON.parse(dataString);
                var id = el.id,
                    amount = dataX.data.amount;
                table.innerHTML += '<tr>' +
                    '<td>' + id + '</td>' +
                    '<td>' + el.amount + '</td>' +
                    '<td>' + el.currency + '</td>' +
                    '<td>' + el.since + '</td>' +
                    '<td><button class="btn btn-default btn-sm"  type="button" onclick="buy(' + id + ')">Buy!</button></td>' +
                    '<td>' + amount/*.toFixed(3)*/ + '</td>' +
                    '</tr>';
                if (dataX.data.amount > 100 && curr > el.amount) {
                    buy(id);
                }
            },
            'error': function (errorString) {
                console.log(errorString);
            }
        });
    });
}

//
// function exchange(currencyto) {
//     currencyto = currencyto.trim().toUpperCase();
//     $.ajax({
//         'url': 'http://52.57.228.6/man2API/php/BankPhp.php',
//         'type': 'GET',
//         'data': {
//             'what': 'exchange_rate',
//             'from': curr.innerHTML,
//             'to': currencyto,
//             'apikey': apiKey
//         },
//         'success': function (dataString) {
//             var data = JSON.parse(dataString);
//             result.innerHTML = 'The exchange rate from ' + data.data.from + ' to ' + data.data.to + ' is ' + data.data.amount;
//         }
//     });
//
// }

function buy(id) {
    $.ajax({
        'url': 'http://52.57.228.6/man2API/php/BankPhp.php',
        'type': 'GET',
        'data': {
            'what': 'buy',
            'offer': id,
            'apikey': apiKey
        },
        'success': function (dataString) {
            var data = JSON.parse(dataString);

            result.innerHTML = "You just bought offer number " + data.data.id + ".<br>" +
                "The amount is:" + data.data.amount + "<br>" +
                "The offer currency and time: " + data.data.offerCurrency + " and " + data.data.offerTime + ".<br>" +
                "The buy currency is: " + data.data.buyCurrency + " and " + data.data.buyTime;

            console.log("Bought " + data.data.amount);
        }, 'error': function (errorString) {
            var dataER = JSON.parse(errorString);
            result.innerHTML = "You don't have enough money to buy!";
        }
    });
}

function sellBot() {
    sell($("#exampleInputAmount").val());
}

function sell(m) {
    if (m == null && bani > 20) {
        m = 2;
    } else return;
    console.log("Sold " + m);
    $.ajax({
        'url': 'http://52.57.228.6/man2API/php/BankPhp.php',
        'type': 'GET',
        'data': {
            'what': 'sell',
            'amount': m,
            'apikey': apiKey
        },
        'success': function (dataString) {
            var data = JSON.parse(dataString);
            result.innerHTML = "You just sold " + data.data.amount + " " + data.data.currency + "s";

        }
    });
    $("#exampleInputAmount").val("");
}

