const express = require("express");
const app =express();
var Airtable = require('airtable');

var bodyparser= require("body-parser");

var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('app0uXuLQqKzUYz8w');

var base = Airtable.base('app0uXuLQqKzUYz8w');
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname+"/public"));

app.get('/',function(req,res) {
  
  var dataObj={};
  base('Stock Price').select({
    // Selecting the first 50 records in Grid view:
    maxRecords: 50,
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
  
      records.forEach(function(record) {
        console.log(record.get('id'));
        dataObj[record.get('Date')]=record.get('Price');
          
      });
    
      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();
  
  }, function done(err) {
      if (err) { console.error(err); return; }
      console.log(dataObj);
      res.render('index.ejs',{dataObj:JSON.stringify(dataObj)});
  });
  
  
});

app.post('/',function(req,res) {
  
  //post functionality will be adressed here
  //testing the find method to retrieve particular fields
  //------------------------------------------------------
  
  base('Stock Price').create({
    "Date": req.body.date,
    "Price": parseInt(req.body.price),
  }, function(err, record) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("record created : "+record);
    res.redirect("/");
  });
  
  
  
});



app.listen(process.env.PORT, process.env.IP, function(req,res){
  console.log('listening on'+process.env.PORT);
});