const http=require('http');
const fs=require('fs');
const url=require('url');
const child=require('child_process');


const fileStream=fs.readFileSync('index.html');
//const myCommand='ping';
//const myArgs=['/?'];

const server=http.createServer((req,res)=>{
    if(url.parse(req.url).pathname==='/'){
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(fileStream);
    }else{
        res.writeHead(404,{'Content-Type':'text/plain'});
        res.end('Not Found/ Não encontrado /Bom Dia Tapita!');
    }
}).listen(3000);
const io=require('socket.io')(server);

function execPing(args){

    const ping=child.spawn('ping',['-c 5',args]);
    ping.stdout.on('data',(data)=>{
        io.emit('output',data.toString());
    })
    ping.stderr.on('data',(data)=>{
        io.emit('output',data.toString());
    })
    ping.on('error',(err)=>{
        io.emit('output',err.message);
    })

    ping.on('close',(code)=>{
        io.emit('process exited with code/processo finalizado com '+code);

    });

}

io.on('connection',(socket)=>{
    socket.on('command',(data)=>execPing(data));
})




