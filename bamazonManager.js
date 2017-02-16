var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var colors = require('colors');

//connects to bamazon database
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '782x2291',
  database : 'bamazon_db',
});

connection.connect();

// asks user if they would like to make a purchase
function mainMenu(){
  inquirer.prompt([
    {type: "list",
      name: "menu",
      message: "Select a menu option".yellow.bold,
      choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add To Inventory",
            "Add New Product",
            "Quit"
        ]}
      ]).then(function(data){
        if (data.menu == "View Products for Sale") {
          showProducts(); 
        } else if (data.menu == "View Low Inventory") {
          viewLow();
        } else if (data.menu == "Add To Inventory") {
          addInventory();
        } else if (data.menu == "Add New Product") {
          addProduct();
        } else if (data.menu == "Quit") { 
          connection.end();
        }

  });
};

mainMenu();

 // asks user if they would like to make a purchase
 function returnMenu(){
  inquirer.prompt([
    {type: "input",
      name: "return",
      message: "Would you like to return to the main menu (yes/no)?".yellow.bold}
      ]).then(function(data){
        if (data.return == 'yes') {
          mainMenu();
        } else{
          console.log("Have a nice day");
          connection.end();
        }

  });
}


//logs product info
function showProducts(){
  connection.query('SELECT * FROM products', function (error, results, fields){
    var table = new Table({
      head: ['Id'.yellow.bold, 'Product Name'.yellow.bold, 'Price'.yellow.bold],
    });
    console.log('Products Available:'.cyan.bold);
    for (var i = 0; i < results.length; i++) {
      table.push([results[i].id, results[i].product_name, results[i].price]);
    }
    console.log(table.toString());
     console.log('\n');  
  });
  returnMenu();
};

//logs product info with low inventory
function viewLow(){
  connection.query('SELECT * FROM lowInventory', function (error, results, fields){
    var table = new Table({
      head: ['Id'.yellow.bold, 'Product Name'.yellow.bold, 'Price'.yellow.bold],
    });
    console.log('Low Inventory:'.cyan.bold);
    for (var i = 0; i < results.length; i++) {
      table.push([results[i].id, results[i].product_name, results[i].price]);
    }
    console.log(table.toString());
     console.log('\n');  
  });
  returnMenu();
};

//adds to inventory
function addInventory(){
// asks user what product they would like to add to
    inquirer.prompt([{
      type: "input",
      name: "product_id",
      message: "What is the id of the product you would like to add to?"}
    ]).then(function(data){
      var product = data.product_id;
      //asks for quantity they would like to add
      inquirer.prompt([{
        type: "input",
        name: "units",
        message: "What is quantity that you would like to add?"}
      ]).then(function(data){
        var units = data.units;
        var item = results[product - 1];

        // logs a summary of what is added
        console.log((" you are adding " + units + " " + item.product_name + "s").magenta.bold);

        // updates stock quantity after sale
        connection.query("UPDATE products SET stock_quantity=" + units + " WHERE id=" + product, function(err, res) { 
          if (err) return console.log(err);
        });

        inquirer.prompt([{
          type: "input",
          name: "new_addition",
          message: "Would you like to add to another product (yes/no)?".yellow.bold}
        ]).then(function(data){
          if (data.new_purchase == 'yes') {
            addInventory();
        } else{
          returnMenu();
        }
      });
    });
  });
};



//adds to inventory
function addProduct(){
// asks user what product they would like to add to
    inquirer.prompt([{
      type: "input",
      name: "product_name",
      message: "What is the name of the product you would like to add?"}
    ]).then(function(data){
      var product = data.product_name;
      //asks for quantity they would like to add
      inquirer.prompt([{
        type: "input",
        name: "units",
        message: "What is quantity that you would like to add?"}
      ]).then(function(data){
        var units = data.units;
        var item = results[product - 1];
        inquirer.prompt([{
          type: "input",
          name: "department",
          message: "What is the department id?"}
        ]).then(function(data){
          var department = data.department;
          inquirer.prompt([{
            type: "input",
            name: "price",
            message: "What is the department id?"}
          ]).then(function(data){
          var price = data.price;

          // logs a summary of what is added
          console.log((" you are adding " + units + " " + item.product_name + "s").magenta.bold);

         // updates stock quantity after sale
          connection.query("INSERT INTO products (product_name, department_id, price, stock_quantity) VALUES (" + product + ", " + department + ", " + price + ", " + units + ");", function(err, res) { 
            if (err) return console.log(err);
          });

          inquirer.prompt([{
            type: "input",
            name: "new_addition",
            message: "Would you like to add to another product (yes/no)?".yellow.bold}
          ]).then(function(data){
            if (data.new_purchase == 'yes') {
              addInventory();
          } else{
            returnMenu();
          }
          });
        });
      });
    });
  });
};

};



