//npm install request
//import request => js file
let req=require("request");

//require cheerio
let ch=require("cheerio");

req("https://www.espncricinfo.com/scores/series/8048/season/2020/indian-premier-league?view=results",requestans);
// file system -> inbuilt to use if you need to require
let fs = require("fs");
function requestans(err,res,html){
    //console.log(err);
    //console.log(res.statusCode);
    //console.log(html);
    if(err){
        console.log("Some error",err);
    }
    else{
        //data -> scrap
        console.log(html);
    }
    //fs.writeFileSync("index.html",html);
    //load file
    console.log("Received File");
    let STool = ch.load(html);
    let output = STool("div.summary");
    console.log(output.html());
    console.log(output.text());
    fs.writeFileSync("summary.html", output.text());
}

