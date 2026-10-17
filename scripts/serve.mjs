import http from 'node:http';
import worker from '../dist/server/index.js';
const server=http.createServer(async(req,res)=>{try{const response=await worker.fetch(new Request(`http://${req.headers.host}${req.url}`,{method:req.method}),process.env,{});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(e){console.error(e);res.writeHead(500);res.end('Erro interno');}});
server.listen(4173,'0.0.0.0',()=>console.log('Local: http://localhost:4173'));
