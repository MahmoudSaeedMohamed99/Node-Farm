const fs = require('fs');
const http1 = require('http');
const url = require('url');

const replaceHTML = require('./modules/replaceHTML');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html` , 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html` , 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html` , 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json` , 'utf-8');
const procData = JSON.parse(data);

const server = http1.createServer((req , res) => {
    const { query , pathname } = url.parse(req.url , true);
    
    //Overview Page
    if(pathname === '/overview' || pathname === '/') {
        res.writeHead(200 , {'Content-type':'text/html'});

        const cardsHtml = procData.map(el => replaceHTML(tempCard , el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARD%}' , cardsHtml);
        res.end(output);

    //Prodcut Page
    }else if (pathname === '/product'){
        res.writeHead(200 , {'Content-type':'text/html'});

        const product = procData[query.id];
        const output = replaceHTML(tempProduct , product)

        res.end(output);

    //Api Page
    }else if (pathname === '/api') {
        res.writeHead(200 , {'Content-type':'application/json'});
        res.end(data);

    //Not Found Page
    } else {
        res.writeHead(404 , {
            'Content-type': 'text/html'
        });
        res.end('<h1>Page Is Not Found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listeing to requests on port 8000');
});