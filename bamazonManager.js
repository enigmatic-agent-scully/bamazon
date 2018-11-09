var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'bamazon'
});

const menu = () => {
  inquirer.prompt({
    type: 'rawlist',
    name: 'menu',
    message: 'Hello Bamazon Manager. Welcome to your Manager Portal. Please choose from the following options:',
    choices: ['View Inventory', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
  })
    .then(ans => {
      if (ans.menu === 'View Inventory') {
        viewAll();
      }
      else if (ans.menu === 'View Low Inventory') {
        viewLow();
      }
      else if (ans.menu === 'Add to Inventory') {
        addStock();
      }
      else if (ans.menu === 'Add New Product') {
        //addNew();
      }
    })
}

const viewAll = () => {
  connection.query('SELECT * FROM products', function (err, resp) {
    console.log('You are now browsing ALL available products.\n');
    for (var i = 0; i < resp.length; i++) {
      console.log(`${resp[i].id} - ${resp[i].itemname} || price: $${resp[i].price}.00 || quantity: ${resp[i].quant}`);
    }
  })
}

const viewLow = () => {
  connection.query('SELECT * FROM products', function (err, resp) {
    console.log('You are now browsing LOW inventory.\n');
    var count = [];
    for (var i = 0; i < resp.length; i++) {
      if (resp[i].quant <= 5) {
        console.log(`${resp[i].id} - ${resp[i].itemname} || price: $${resp[i].price}.00 || quantity: ${resp[i].quant}`);
        count.push(resp[i].id);
      }
    }
    if (count.length === 0) {
      console.log('You have no low inventory items at this time.')
    }
  })
}

const addStock = () => {
  console.log('Welcome to the Add Stock Wizard. The Add Stock Wizard will walk you through adding stock to your inventory.');
  connection.query('SELECT id, itemname, quant FROM products', (err, resp) => {
    if (err) throw err;
    for (var i = 0; i < resp.length; i++) {
      console.log(`${resp[i].id} - ${resp[i].itemname} || quantity: ${resp[i].quant}`);
    };
    inquirer.prompt([{
      type: 'input',
      name: 'id',
      message: `What is the ID of the item to which you'd like to add stock?`,
      validate: function (resp) {
        if (isNaN(resp)) {
          return false;
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'addQ',
      message: 'How many units of this item would you like to add to your inventory?',
      validate: function (resp) {
        if (isNaN(resp)) {
          return false;
        }
        return true;
      }
    }]).then(ans => {
      connection.query('UPDATE products SET ? WHERE ?', {
        quantity: ans.addQ
      },
        {
          id: ans.id
        })
    }
    )
  })

}

menu();