// npm install request=>. npm playstore => local machine 
// console.log("hello");
// use => require
// include import require 
// /logic => implementation => libraray => function 
let request=require("request");
// npm install cheerio 
let cheerio=require("cheerio");
// preinstalled
let fs=require("fs");
const { dir } = require("console");
//  input => url , fn
let path = require("path");
let xlsx = require("xlsx");
const { AsyncLocalStorage } = require("async_hooks");
request("https://www.espncricinfo.com/scores/series/8048/season/2020/indian-premier-league?view=results",getAMUrl);
function getAMUrl(err,resp,html){
    let sTool = cheerio.load(html);
    let allmatchUrlElem = sTool("a[data-hover='Scorecard']");
    for(let i=0;i<allmatchUrlElem.length;i++){
        let href = sTool(allmatchUrlElem[i]).attr("href");
        let fUrl ="https://www.espncricinfo.com"+href;
        findDataofMatch(fUrl);
        //fs.writeFileSync("Scorecard.xlsx", );
    }
}

function findDataofMatch(url){
request(url,whenDataArrive);
function whenDataArrive(err,resp,html){
    // console.log(html);
    // create file => content 
    console.log("recieved html");
    // function => speceific paramater => data
    // browser=> parse => ui show 
    // nodejs => parse => extract 
    
    // single entry
//   let resultElem=sTool("div.desc.text-truncate");

//   console.log(resultElem.text());
// /html => element
// css syntax 
let sTool= cheerio.load(html);
let tableElem=sTool("div.card.content-block.match-scorecard-table .Collapsible");
console.log(tableElem.length);
// let Inninghtml="<table>";
let count=0;
for(let i=0;i<tableElem.length;i++){
    // text ,cheerio=> wrap
    // html => element html
  let teamName= sTool(tableElem[i]).find("h5.header-title.label").text();
  let rowsOfATeam=sTool(tableElem[i]).find(".table.batsman").find("tbody tr");
  let teamStrArr= teamName.split("Innings");
  teamName = teamStrArr[0].trim();
  console.log(teamName);
for(let j=0;j<rowsOfATeam.length;j++){
   let  rCols=sTool(rowsOfATeam[j]).find("td"); 
   let isBatsManRow= sTool(rCols[0]).hasClass("batsman-cell");
    if(isBatsManRow==true){
count++;
    let pName= sTool(rCols[0]).text().trim();
    let runs= sTool(rCols[2]).text().trim();
    let balls= sTool(rCols[3]).text().trim();
    let fours= sTool(rCols[5]).text().trim();
    let sixes= sTool(rCols[6]).text().trim();
    let sr= sTool(rCols[7]).text().trim();
    //console.log(`pName: ${pName}  Runs: ${runs}  Balls: ${balls}  Fours: ${fours}  Sixes: ${sixes}  SR: ${sr}`);
    processPlayer(teamName,pName,runs,balls,fours,sixes,sr);
    }
}
console.log("No of batsman of in a team",count);
console.log(teamName);
count=0;
//   console.log(cInning.html());
//   Inninghtml+=psOfATeam;
  console.log("```````````````````````````````````````````````````````````");
}
// fs.writeFileSync("batsman.html",Inninghtml);

//   Eliminator (N), Abu Dhabi, Nov 6 2020, Indian Premier League
    // nodejs => file save => file read => data extract 
    // fs.writeFileSync("abc.html",html);
//    parse -> tool -> extract
 
}
}

function processPlayer(team,name,runs,balls,fours,sixes,sr){
    let dirPath = team;
    let pMatchesStats={
        Team:team,
        Name:name,
        Balls:balls,
        Fours:fours,
        Sixes:sixes,
        Sr:sr,
        Runs:runs
    }
    if(fs.existsSync(dirPath)){
        //File Exist
        //console.log("Folder Exist")
    }
    else{
        //Create Folder
        //Create file
        //Add data
        fs.mkdirSync(dirPath);
    }
    let playerFilePath = path.join(dirPath,name+".xlsx");
    let pData = [];
    if(fs.existsSync(playerFilePath)){
        pData = excelreader(playerFilePath,name)
        pData.push(pMatchesStats);
    }
    else{
        //create file
        console.log("File of Player",playerFilePath,"created");
        pData[pMatchesStats];
    }
    excelwriter(playerFilePath,pData,name);

}

function excelreader(filePath,name){
    if(!fs.existsSync(filePath)){
        return null;
    }
    else{
        //worbook => excel
        let wt = xlsx.readFile(filePath);
        //get data from workbook
        let excelData = wt.Sheets[name];
        //convert excel format to json format => array of obj
        let ans = xlsx.utils.sheet_to_json(excelData);
        //console.log(ans);
        return ans;
    }
}

function excelwriter(filePath,json,name){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWS,name);
    xlsx.writeFile(newWB,filePath);
}
