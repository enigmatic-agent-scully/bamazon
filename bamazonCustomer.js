var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'bamazon'
});



function welcome() {
  inquirer.prompt({
    type: 'rawlist',
    name: 'shop',
    message: 'Welcome to BAMAZON! Would you like to [SHOP DEPARTMENTS] or [SHOP ALL PRODUCTS]?',
    choices: ['SHOP DEPARTMENTS', 'SHOP ALL PRODUCTS']
  }).then(answer => {
    if (answer.shop === 'SHOP DEPARTMENTS') {
      shopDepts();
    }
    else {
      //shopAll();
    }
  })
}

function shopDepts() {
  connection.query('SELECT dept FROM products', function (err, resp) {
    if (err) console.log(err);
    inquirer.prompt({
      type: 'rawlist',
      name: 'depts',
      message: 'which department would you like to browse?',
      choices: function () {
        var deptsArr = [];
        for (var i = 0; i < resp.length; i++) {
          if (!deptsArr.includes(resp[i].dept)) {
            deptsArr.push(resp[i].dept);
          }
        }
        return deptsArr;
      }
    })
      .then(ans => {
        connection.query(`SELECT itemname, price FROM products WHERE ?`, { dept: ans.depts }, function (err, resp) {
          for (var i = 0; i < resp.length; i++) {
            console.log(` - ${resp[i].itemname} || price: ${resp[i].price}`);
          }
            
      })
      }
  )
    .catch((err) => {
      console.log(err);
    })
})
}

welcome();