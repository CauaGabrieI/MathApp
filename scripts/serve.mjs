import http from 'node:http';
import worker from '../dist/server/index.js';
const server=http.createServer(async(req,res)=>{try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);const response=await worker.fetch(new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body}: {})}),process.env,{});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(e){console.error(e);res.writeHead(500);res.end('Erro interno');}});
const port=Number(process.env.PORT??4173);
server.listen(port,'0.0.0.0',()=>console.log(`Local: http://localhost:${port}`));
