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
      shopAll();
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
        connection.query(`SELECT id, itemname, price FROM products WHERE ?`, { dept: ans.depts }, function (err, resp) {
          for (var i = 0; i < resp.length; i++) {
            console.log(`${resp[i].id} - ${resp[i].itemname} || price: ${resp[i].price}`);
          }

        })
      }
      )
      .catch((err) => {
        console.log(err);
      })
  })
};

function shopAll() {
  connection.query('SELECT * FROM products', function (err, resp) {
    for (var i = 0; i < resp.length; i++) {
      console.log(`${resp[i].id} - ${resp[i].itemname} || price: ${resp[i].price}`);
    }
    inquirer.prompt([{
      type: 'input',
      name: 'itemid',
      message: 'What is the ID of the item you would like to purchase?',
      validate: function (resp) {
        if (isNaN(resp)) {
          return false;
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'How many units of this item would you like to purchase?',
      validate: function (resp) {
        if (isNaN(resp)) {
          return false;
        }
        return true;
      }
    }]).then(ans => {
      console.log(checkQuant(ans.itemid, ans.quantity));
      // if () {
      //   console.log('Sufficient quantity in stock!');
      //   // buyItem();
      // }
      // else {
      //   console.log('Insufficient quantity!');
      // }
    })
  })
}
welcome();

function checkQuant(id, q) {
  let isSufficient = true;
  connection.query('SELECT itemname, quant FROM products WHERE ?', { id: id }, (err, resp) => {
    
    var storeQ = resp[0].quant;
    if (q < storeQ) {
      // console.log(q, storeQ, 'sufficient');
      isSufficient = true;
    }
    else {
      // console.log(q, storeQ, 'insufficient');
      isSufficient = false;
    } 
  })
  return isSufficient;
}