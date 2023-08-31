
const http = require("http");
const fs = require('fs').promises;
const bicycles = require('./data/data.json');


const server = http.createServer( async (req, res) => {

    if(req.url === "/favicon.ico") return ;
  

    const myURL = new URL(req.url, 'http://localhost:8000');

    const pathName = myURL.pathname;

    const id = myURL.searchParams.get('id');
    console.log(req.url);


    if(pathName === '/'){

      let data = await fs.readFile('./view/bicycles.html','utf-8');
      const AllMainBicycles = await fs.readFile('./view/main/bmain.html','utf-8');

        let allTheBicycles = '';
        for( let index = 0; index < 6; index++){
            allTheBicycles = allTheBicycles  + replaceTemplate(AllMainBicycles,bicycles[index]);
        }

        data = data.replace(/<%AllMainBicycles%>/g, allTheBicycles);;
      res.writeHead(200,{"Content-Type":"text/html"});
      res.end(data);

    } else if(pathName === '/bicycle' && id >= 0 && id <= 5){

      let data = await fs.readFile('./view/overview.html','utf-8');
      res.writeHead(200,{"Content-Type":"text/html"});
      const bicycle = bicycles.find((b) => b.id === id);
      
      data = replaceTemplate(data,bicycle);

     

      res.end(data); 

    } else if(/\.(png)$/i.test(req.url)){
        const image = await fs.readFile(`./public/image/${req.url.slice(1)}`);

        res.writeHead(200,{"Content-Type":"image/png"});
        res.end(image);

    } else if(/\.(css)$/i.test(req.url)){
        const css = await fs.readFile(`./public/css/index.css`);

        res.writeHead(200,{"Content-Type":"text/css"});
        res.end(css);
    } else if(/\.(svg)$/i.test(req.url)){
        const svg = await fs.readFile(`./public/image/icons.svg`);

        res.writeHead(200,{"Content-Type":"image/svg+xml"});
        res.end(svg);
    }
    else {
        res.writeHead(400, {"Content-Type": "text/html"});
        res.end("<div><h1>This Page Not Found</h1></div>")
    }

});


const PORT = 8000;
server.listen(PORT);

function replaceTemplate(data,bicycle){
    data = data.replace(/<%IMAGE%>/g, bicycle.image);
    data = data.replace(/<%NAME%>/g, bicycle.name);
    
    let price = bicycle.originalPrice;

    if(bicycle.hasDiscount){
      price = (price * (100 - bicycle.discount)) / 100;
    }

    data = data.replace(/<%NEWPRICE%>/g, `$${price}.00`);
    data = data.replace(/<%OLDPRICE%>/g, `$${bicycle.originalPrice}.00`);
    data = data.replace(/<%ID%>/g, bicycle.id);

    if(bicycle.hasDiscount){
        data = data.replace(/<%DISCOUNTRATE%>/g, `<div class="discount__rate"><p>${bicycle.discount}% Off</p></div>`)
    }  else {
        data = data.replace(/<%DISCOUNTRAME%>/g, '');
    }
    for(let index = 0 ; index < bicycle.star; index++){
        data = data.replace(/<%START%>/, 'checked')
    }
    data = data.replace(/<%START%>/g, '')

    return data
}
