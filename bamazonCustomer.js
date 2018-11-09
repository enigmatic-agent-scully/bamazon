var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'bamazon'
});


const welcome = () => {
  inquirer.prompt({
    type: 'rawlist',
    name: 'shop',
    message: 'Welcome to BAMAZON! Would you like to SHOP DEPARTMENTS or SHOP ALL PRODUCTS?',
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

welcome();

const shopDepts = () => {
  connection.query('SELECT dept FROM products', function (err, resp) {
    if (err) console.log(err);
    inquirer.prompt({
      type: 'rawlist',
      name: 'depts',
      message: 'Which department would you like to browse?',
      choices: () => {
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
        connection.query(`SELECT id, itemname, price, quant FROM products WHERE ?`, { dept: ans.depts }, (err, resp) => {
          if (err) throw err;
          else {
            console.log(`You are now browsing ALL available products in the ${ans.depts} department.\n`);
            for (var i = 0; i < resp.length; i++) {
              console.log(`${resp[i].id} - ${resp[i].itemname} || price: $${resp[i].price}.00 || quantity: ${resp[i].quant}`);
            }
            inquirer.prompt([{
              type: 'input',
              name: 'itemid',
              message: 'What is the ID of the item you would like to purchase?',
              validate: (resp) => {
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
              validate: (resp) => {
                if (isNaN(resp)) {
                  return false;
                }
                return true;
              }
            }]).then(ans => {
              checkQuant(ans.itemid, ans.quantity);
            })
          }
        })
      }
      )
  })
};

const shopAll = () => {
  connection.query('SELECT * FROM products', function (err, resp) {
    console.log('You are now browsing ALL available products.\n');
    for (var i = 0; i < resp.length; i++) {
      console.log(`${resp[i].id} - ${resp[i].itemname} || price: $${resp[i].price}.00 || quantity: ${resp[i].quant}`);
    };
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
      checkQuant(ans.itemid, ans.quantity);
    })
  })
}



function checkQuant(id, q) {
  connection.query('SELECT itemname, quant FROM products WHERE ?', { id: id }, (err, resp) => {

    var storeQ = resp[0].quant;
    if (q <= storeQ) {
      makePurchase(id, q, storeQ);
    }
    else {
      console.log(q, storeQ, 'Insufficient quantity!');
    }
  })
}

const makePurchase = (x, y, z) => {
  var newQ = (z - y);

  connection.query('UPDATE products SET ? WHERE ?', [
    {
      quant: newQ
    },
    {
      id: x
    }
  ], (err, resp) => {
    if (err) throw err;
    else {
      console.log('Your order has been placed!\n\nThank you for shopping at BAMAZON!');
      welcome();

    }
  });
  if (newQ === 0) {
    connection.query('DELETE FROM products WHERE ?', [{
      quant: 0
    }], (err, resp) => {
      if (err) throw err;
    })
  }
}