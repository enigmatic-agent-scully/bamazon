# Bamazon

> Bamazon is a MySQL-backed, Amazon-like storefront app that uses Node.js to create a command line interface (CLI) that takes in orders from customers and depletes stock from the store's inventory. There is also a Manager's Portal that allows managers to update stock quantities or add new inventory.

## Usage

#### Bamazon Customer Portal

The gif below illustrates typical customer interactions in bamazonCustomer.js.

![Bamazon Customer Gif](https://github.com/enigmatic-agent-scully/bamazon/blob/master/bamazonCustomer.gif?raw=true 'bamazon customer gif')

#### Bamazon Manager Portal

The gif below illustrates typical manager interactions in bamazonManager.js.

![Bamazon Manager Gif](https://github.com/enigmatic-agent-scully/bamazon/blob/master/bamazonManager.gif?raw=true 'bamazon manager gif')

## Install

The following instructions will get you a copy of the project up and running on your local machine for development pourposes.

### Prerequisites

To install this Bamazon app on your local machine, you need:

#### MySQL

You will need to have MySQL installed. Use the provided `bamazonSchema.sql` to set up a database called 'bamazon' with a table called 'products'.

#### Dependencies

This app requires the following npm packages:

- [mysql](https://www.npmjs.com/package/mysql)
- [inquirer](https://www.npmjs.com/package/inquirer)

With [npm](https://npmjs.org/) installed, run

```
$ npm i --save mysql inquirer
```

#### Fork or Download

Now that you've installed everything above, you're ready to either fork or download a zip file of the project from gitHub and run it on your local machine! Happy coding!

## See Also

- This README.md was created with [`noffle/common-readme`](https://github.com/noffle/common-readme)

## License

ISC
