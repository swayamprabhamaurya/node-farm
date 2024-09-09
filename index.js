const obj =require("fs");
const http =require('http');
const url =require('url'); 
const replaceTemplate=require('./starter/modules/replaceTemplate')
//////FILE SYSTEM///////////

//Blocking , synchronous way
//syncronous nature of nodejs that is blocking model bcz it uses single thread for all the users.
/*
const textIn = obj.readFileSync("./starter/txt/input.txt","utf-8");
console.log(textIn);

const textOut=`This is what wew know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
obj.writeFileSync("./starter/txt/output.txt",textOut);
console.log("File written!");
*/

//non Blocking , asynchronous way using callback function
/*
obj.readFile("./starter/txt/start.txt","utf-8",(err,data) =>{
    console.log(data);
});
console.log("File read!");
*/

/*obj.readFile("./starter/txt/start.txt","utf-8",(err,data1) =>{   // error here uses the disk keyword from the parent function i.e. leical keyword
    if (err) return console.log("ERROR!");
    obj.readFile(`./starter/txt/${data1}.txt`,"utf-8",(err,data2) =>{
        console.log(data2);
        obj.readFile("./starter/txt/append.txt","utf-8",(err,data3) =>{
            console.log(data3);
            obj.writeFile("./starter/txt/final.txt",`${data2}\n${data3}`,"utf-8",err =>{
                console.log("Your file has beeen written!");
            })
        });
    });
});
console.log("File read!");
// we can also write function (err,data){...........}, which is the traditionl approach also err here take its own disk keyword 
*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////SERVER/////////
//we can not write below three line in callback function bez it will be call each time the request is made and every time it will be blocked

const tempOverview=obj.readFileSync('./starter/templates/template-overview.html',"utf-8") /// (`${__dirname}/dev-data/data.json`    to find the exact directory
const tempCard=obj.readFileSync('./starter/templates/template-card.html',"utf-8") /// (`${__dirname}/dev-data/data.json`    to find the exact directory
const tempProduct=obj.readFileSync('./starter/templates/template-product.html',"utf-8") /// (`${__dirname}/dev-data/data.json`    to find the exact directory

const data=obj.readFileSync('./starter/dev-data/data.json',"utf-8") /// (`${__dirname}/dev-data/data.json`    to find the exact directory
const dataObj=JSON.parse(data) //to convert to javascript format not json format here data is a string

const server=http.createServer((req,res) => { 
    //console.log(req); // we will be able to see bunch of requst when we handle the request in here
    //console.log(req.url); // to monitor routing i.e. diff url has diff task
    //const pathname=req.url //indicates root directary or "/"
    
    const {query,pathname}=url.parse(req.url,true);
    
    //Overview page
    
    if (pathname==='/' || pathname==='/overview'){
        res.writeHead(200,{
            'Content-type':'text/html'
        })

        const cardsHtml=dataObj.map(e=>replaceTemplate(tempCard,e)).join("")
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(output)

    //Product page

    }else if (pathname==='/product'){
        res.writeHead(200,{'Content-type':'text/html'})
        const product=dataObj[query.id]
        const output=replaceTemplate(tempProduct,product)
        res.end(output)

    //API

    }else if (pathname==='/api'){
        //now here we are telling server that we are sending json this time
        res.writeHead(200,{
            'Content-type':'application/json'
        })
        res.end(data)//for displaying data as request
    
    //Page Not Found 

    }else{
        //these headers and status should always sent before the response
        //res.writeHead(404)//status code to the respond of file not found
        res.writeHead(404, { //for more http hearder,header is  piece of information about the respond that we send back  
            'Content-type':'text/html',//this will need html code in the response so we chnage it too
            'my-own-header':'hello-sam'//foe defining our own header
        })
        //res.end("Page not found!")
        res.end("<h1>Page not found!</h1>")
    }
})
server.listen(8000,"127.0.0.1",()=>{
    console.log("Listening to request on local server(127.0.0.1) on port: 8000")
})
//NOTE: Ctrl D or .exit for repl but for program to finish use Ctrl C

//API is a service from which we request some data











