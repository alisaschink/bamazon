var mysql = require('mysql');
var inquirer = require('inquirer');

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
  console.log(results);
  console.log('\n');

  // asks user if they would like to make a purchase
  inquirer.prompt([
    {type: "input",
      name: "purchase",
      message: "Would you like to make a purchase?"}
      ]).then(function(data){
        if (data.purchase == 'yes') {
          // asks user what table they would like to select from
          inquirer.prompt([
          {type: "input",
          name: "product_id",
          message: "What is the id of the product you would like to purchase?"}
          ]).then(function(data){
            var product = data.product_id;
            inquirer.prompt([
              {type: "input",
              name: "units",
              message: "What is quantity that you would like to purchase?"}
              ]).then(function(data){
                var units = data.units;
                // logs a summary of what is being purchased
                console.log("you are purchasing " + units + " " + results[product - 1].product_name + "s");
                // checks if there is sufficient quantity left in stock for sale
                if(results[product - 1].stock_quantity >= units){
                  console.log("purchase approved");
                } else{
                  console.log("Insufficient quantity! Try again.");
                }
  
              });

          });
          
          
      } else{
          console.log("come back when you want to spend money");
        }

  });

});

 




connection.end();

// function insertIntoTable(name, type, abv, table){
//   connection.query("INSERT INTO " + table + " SET ?", {
//       name: name,
//       type: type,
//       abv: abv
//     }, function(err, res) { console.log('completed!')});
// }

// function deleteFromTable(id, table){
//  connection.query("DELETE FROM " + table + " WHERE ?", {
//      id: id
//    }, function(err, res) { 
//      if (err) return console.log(err);
//      console.log('delete completed!')
//    });
// }

// //write update function
// function updateTable(id, table){
//  connection.query("UPDATE " + table + " SET ? WHERE ?", [{
//    name : 'bruno beer'
//    }, {
//      id : id
//    }], function(err, res) { 
//      if (err) return console.log(err);
//      console.log('update completed!')
//    });
// }

// //write delete function


// // insertIntoTable('beer', 'i dont know beer', 100, 'beers');
// // deleteFromTable(7, 'beers');
// updateTable(1, 'beers');

