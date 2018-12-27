var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'bamazon'
});

const menu = () => {
  inquirer
    .prompt({
      type: 'rawlist',
      name: 'menu',
      message:
        'Hello Bamazon Manager. Welcome to your Manager Portal. Please choose from the following options:',
      choices: [
        'View Inventory',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product'
      ]
    })
    .then(ans => {
      if (ans.menu === 'View Inventory') {
        viewAll();
      } else if (ans.menu === 'View Low Inventory') {
        viewLow();
      } else if (ans.menu === 'Add to Inventory') {
        addStock();
      } else if (ans.menu === 'Add New Product') {
        addNew();
      }
    });
};

const viewAll = () => {
  connection.query('SELECT * FROM products', function(err, resp) {
    console.log('You are now browsing ALL available products.\n');
    for (var i = 0; i < resp.length; i++) {
      console.log(
        `${resp[i].id} - ${resp[i].itemname} || price: $${
          resp[i].price
        }.00 || quantity: ${resp[i].quant}`
      );
    }
  });
};

const viewLow = () => {
  connection.query('SELECT * FROM products', function(err, resp) {
    console.log('You are now browsing LOW inventory.\n');
    var count = [];
    for (var i = 0; i < resp.length; i++) {
      if (resp[i].quant <= 5) {
        console.log(
          `${resp[i].id} - ${resp[i].itemname} || price: $${
            resp[i].price
          }.00 || quantity: ${resp[i].quant}`
        );
        count.push(resp[i].id);
      }
    }
    if (count.length === 0) {
      console.log('You have no low inventory items at this time.');
    }
  });
};

const addStock = () => {
  console.log(
    'Welcome to the Add Stock Wizard. The Add Stock Wizard will walk you through adding stock to your inventory.'
  );
  connection.query('SELECT id, itemname, quant FROM products', (err, resp) => {
    if (err) throw err;
    for (var i = 0; i < resp.length; i++) {
      console.log(
        `${resp[i].id} - ${resp[i].itemname} || quantity: ${resp[i].quant}`
      );
    }
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'id',
          message: `What is the ID of the item to which you'd like to add stock?`,
          validate: resp => {
            if (isNaN(resp)) {
              return false;
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'addQ',
          message:
            'How many units of this item would you like to add to your inventory?',
          validate: function(resp) {
            if (isNaN(resp)) {
              return false;
            }
            return true;
          }
        }
      ])
      .then(ans => {
        var sql = 'UPDATE products SET ?? = ? WHERE ?? = ?';
        var inserts = ['quant', ans.addQ, 'id', ans.id];
        sql = mysql.format(sql, inserts);
        console.log(sql);

        connection.query(sql, (err, resp) => {
          if (err) throw err;
          console.log('Stock added!');
        });
        menu();
      });
  });
};

const addNew = () => {
  console.log(
    'Welcome to the Add New Inventory Wizard. The Add New Inventory Wizard will walk you through adding new items to your inventory.'
  );
  connection.query('SELECT dept FROM products', (err, resp) => {
    if (err) throw err;
    else {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'newItem',
            message: `What is the name of the new item you'd like to add to the inventory?`,
            validate: res => {
              if (!isNaN(res)) {
                return false;
              }
              return true;
            }
          },
          {
            type: 'rawlist',
            name: 'dept',
            message: 'Into which department should this new item be added?',
            choices: () => {
              var deptsArr = [];
              for (var i = 0; i < resp.length; i++) {
                if (!deptsArr.includes(resp[i].dept)) {
                  deptsArr.push(resp[i].dept);
                }
              }
              return deptsArr;
            }
          },
          {
            type: 'input',
            name: 'price',
            message: `What is the item's list price?`,
            validate: res => {
              if (isNaN(res)) {
                return false;
              }
              return true;
            }
          },
          {
            type: 'input',
            name: 'quant',
            message:
              'How many units of this item would you like to add to your inventory?',
            validate: res => {
              if (isNaN(res)) {
                return false;
              }
              return true;
            }
          }
        ])
        .then(ans => {
          var sql = `INSERT INTO products (??, ??, ??, ??) VALUES (?, ?, ?, ?)`;
          var inserts = [
            'itemname',
            'dept',
            'price',
            'quant',
            ans.newItem,
            ans.dept,
            ans.price,
            ans.quant
          ];
          sql = mysql.format(sql, inserts);
          connection.query(sql, (err, resp) => {
            if (err) throw err;
            console.log('New inventory item added!');
          });
        });
    }
  });
};

menu();
