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

//logs product info
connection.query('SELECT * FROM products', function (error, results, fields)
{
  var table = new Table({
            head: ['Id'.yellow.bold, 'Product Name'.yellow.bold, 'Price'.yellow.bold],
        });
        console.log('Products Available:'.cyan.bold);
        for (var i = 0; i < results.length; i++) {
            table.push([results[i].id, results[i].product_name, results[i].price]);
        }
        console.log(table.toString());
         console.log('\n');

  // asks user if they would like to make a purchase
  inquirer.prompt([
    {type: "input",
      name: "purchase",
      message: "Would you like to make a purchase (yes/no)?".yellow.bold}
      ]).then(function(data){
        if (data.purchase == 'yes') {
          newPurchase();
        } else{
          console.log("come back when you want to spend money");
          connection.end();
        }

  });

  function newPurchase(){
    // asks user what product they would like to purchase
    inquirer.prompt([{
      type: "input",
      name: "product_id",
      message: "What is the id of the product you would like to purchase?"}
    ]).then(function(data){
      var product = data.product_id;
      //asks for quantity they would like to purchase
      inquirer.prompt([{
        type: "input",
        name: "units",
        message: "What is quantity that you would like to purchase?"}
      ]).then(function(data){
        var units = data.units;
        var item = results[product - 1];
        var total = units * (item.price);
        var newStock = item.stock_quantity - units;

        // logs a summary of what is being purchased
        console.log((" you are purchasing " + units + " " + item.product_name + "s").magenta.bold);

        // checks if there is sufficient quantity left in stock for sale
        if(item.stock_quantity >= units){
          // updates stock quantity after sale
          connection.query("UPDATE products SET stock_quantity=" + newStock + " WHERE id=" + item.id, function(err, res) { 
            if (err) return console.log(err);
          });

          // adds sale to sales table
          connection.query("INSERT INTO sales (product_id, quantity_purchased) VALUES (" + item.id + ", " + units + " )", function(err, res) { 
            if (err) return console.log(err);
          });

          var total = units * (item.price);
          console.log(" purchase approved!".green.bold);
          console.log(" ----------------------------------------".green.bold);
          console.log((" | Your sales total today is " + total + " dollars |").green.bold);
          console.log(" ----------------------------------------".green.bold);
          inquirer.prompt([{
            type: "input",
            name: "new_purchase",
            message: "Would you like to continue shopping (yes/no)?".yellow.bold}
          ]).then(function(data){
            if (data.new_purchase == 'yes') {
              newPurchase();
            } else{
              console.log("Thank you for Shopping! Have a nice day!");
              connection.end();
            }
          });
        } else{
          console.log("Insufficient quantity! Try again.".red.bold);
        }
  
      });

    });
  }

});


