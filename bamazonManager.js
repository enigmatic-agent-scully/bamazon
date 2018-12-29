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
        'Hello Bamazon Manager. Welcome to the Manager Portal. Please choose from the following options:',
      choices: [
        'View Inventory',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product'
      ]
    })
    .then(ans => {
      switch (ans.menu) {
        case 'View Inventory':
          viewAll();
          break;
        case 'View Low Inventory':
          viewLow();
          break;
        case 'Add to Inventory':
          addStock();
          break;
        case 'Add New Product':
          addNew();
          break;
      }
    });
};

const viewAll = () => {
  var query = connection.query('SELECT * FROM products');
  console.log('\nYou are now browsing ALL available products.\n');
  query
    .on('error', err => {
      console.log(err);
    })
    .on('result', resp => {
      console.log(
        `${resp.id} - ${resp.itemname} || price: $${
          resp.price
        }.00 || quantity: ${resp.quant}`
      );
    })
    .on('end', () => {
      whatNext();
    });
};

const whatNext = () => {
  inquirer
    .prompt({
      type: 'rawlist',
      name: 'next',
      message: '\nWhat would you like to do next?',
      choices: ['Add to inventory', 'Add new stock', 'Return to main menu']
    })
    .then(ans => {
      switch (ans.next) {
        case 'Add to inventory':
          addStock();
          break;
        case 'Add new stock':
          addNew();
          break;
        case 'Return to main menu':
          menu();
          break;
      }
    });
};

const viewLow = () => {
  connection.query('SELECT * FROM products', (err, resp) => {
    console.log('\nYou are now browsing LOW inventory.\n');
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
    '\nWelcome to the Add Stock Wizard. The Add Stock Wizard will walk you through adding stock to your inventory.\n'
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
          message: `\nWhat is the ID of the item to which you'd like to add stock?`,
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
            '\nHow many units of this item would you like to add to your inventory?',
          validate: resp => {
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

        connection.query(sql, (err, resp) => {
          if (err) throw err;
          console.log(
            `Stock added! The quantity of Item No. ${ans.id} is now ${
              ans.addQ
            }.`
          );
        });
      });
  });
};

const addNew = () => {
  console.log(
    '\nWelcome to the Add New Inventory Wizard. The Add New Inventory Wizard will walk you through adding new items to your inventory.'
  );
  connection.query('SELECT dept FROM products', (err, resp) => {
    if (err) throw err;
    else {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'newItem',
            message: `\nWhat is the name of the new item you'd like to add to the inventory?`,
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
            message: '\nInto which department should this new item be added?',
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
            message: `\nWhat is the item's list price?`,
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
              '\nHow many units of this item would you like to add to your inventory?',
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
