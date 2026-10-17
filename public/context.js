import {expressionParts,formatNumber,questionId} from './core.js?v=flow18';
const n=formatNumber;
const templates={
 '+':[
  (a,b)=>({topic:'Livros e leitura',story:`Uma biblioteca tinha ${n(a)} livros disponíveis para empréstimo. Nesta semana, recebeu uma doação de mais ${n(b)} livros, que também ficaram disponíveis.`,ask:'Quantos livros ficaram disponíveis para empréstimo ao todo?'}),
  (a,b)=>({topic:'Na papelaria',story:`Uma papelaria vendeu ${n(a)} cadernos pela manhã e ${n(b)} cadernos à tarde.`,ask:'Quantos cadernos foram vendidos nesse dia?'}),
  (a,b)=>({topic:'Organizando uma coleção',story:`Lia tinha ${n(a)} figurinhas em sua coleção. Em uma troca, recebeu mais ${n(b)} figurinhas que ainda não possuía.`,ask:'Com quantas figurinhas Lia ficou?'}),
  (a,b)=>({topic:'No jardim',story:`Uma escola plantou ${n(a)} mudas no primeiro dia de um projeto de jardinagem. No segundo dia, os estudantes plantaram mais ${n(b)} mudas.`,ask:'Quantas mudas foram plantadas nos dois dias?'}),
  (a,b)=>({topic:'Planejando uma viagem',story:`Para chegar ao destino, um ônibus percorreu ${n(a)} quilômetros até uma parada e depois mais ${n(b)} quilômetros até o fim da viagem.`,ask:'Qual foi a distância total percorrida, em quilômetros?'}),
  (a,b)=>({topic:'Uma campanha solidária',story:`Uma turma arrecadou ${n(a)} peças de roupa para uma campanha. Outra turma contribuiu com mais ${n(b)} peças. Todas as peças foram reunidas para doação.`,ask:'Quantas peças de roupa foram reunidas?'}),
  (a,b)=>({topic:'Produção na padaria',story:`Uma padaria preparou ${n(a)} pães em uma fornada e ${n(b)} pães em outra. Todos os pães foram colocados à venda.`,ask:'Quantos pães foram colocados à venda ao todo?'}),
  (a,b)=>({topic:'Ingressos para o evento',story:`Um evento vendeu ${n(a)} ingressos pela internet e ${n(b)} ingressos na bilheteria. Nenhum ingresso foi cancelado.`,ask:'Quantos ingressos foram vendidos ao todo?'}),
 ],
 '−':[
  (a,b)=>({topic:'Cuidando do dinheiro',story:`Uma conta bancária estava com saldo de R$ ${n(a)},00. Depois, foi debitado um pagamento de R$ ${n(b)},00. A conta permite saldo negativo e não houve cobrança de taxas.`,ask:'Qual ficou sendo o saldo da conta, em reais?'}),
  (a,b)=>({topic:'Pontuação no jogo',story:`Em um jogo, Rafael tinha ${n(a)} pontos. Ao perder uma rodada, recebeu uma penalidade de ${n(b)} pontos. Nesse jogo, a pontuação pode ficar negativa.`,ask:'Com quantos pontos Rafael ficou após a penalidade?'}),
  (a,b)=>({topic:'Balanço de um projeto',story:`Um projeto recebeu R$ ${n(a)},00 em contribuições e teve uma despesa de R$ ${n(b)},00. Para calcular o balanço, a equipe subtrai as despesas do valor recebido.`,ask:'Qual é o balanço do projeto, em reais? Um valor negativo indica prejuízo.'}),
  (a,b)=>a>=b?({topic:'Estoque da loja',story:`Uma loja tinha ${n(a)} camisetas em estoque. Durante o dia, foram vendidas ${n(b)} camisetas, e não houve reposição.`,ask:'Quantas camisetas sobraram no estoque?'}):({topic:'Planejando o estoque',story:`Uma loja tem ${n(a)} camisetas em estoque e precisa entregar ${n(b)} camisetas. O controle calcula o saldo subtraindo a quantidade a entregar da quantidade disponível.`,ask:'Qual é o saldo do estoque? Um saldo negativo indica quantas camisetas faltam.'}),
  (a,b)=>a>=b?({topic:'Lanche da escola',story:`A cozinha de uma escola preparou ${n(a)} lanches. No primeiro intervalo, os estudantes retiraram ${n(b)} lanches.`,ask:'Quantos lanches ainda estão disponíveis?'}):({topic:'Orçamento do passeio',story:`Uma turma arrecadou R$ ${n(a)},00 para um passeio, mas o transporte custa R$ ${n(b)},00. O saldo é calculado pelo valor arrecadado menos o custo.`,ask:'Qual é o saldo do orçamento, em reais? Um valor negativo significa que ainda falta dinheiro.'}),
  (a,b)=>a>=b?({topic:'Separando encomendas',story:`Uma livraria recebeu ${n(a)} livros. Desses, ${n(b)} foram separados para entregar encomendas já feitas.`,ask:'Quantos livros ficaram disponíveis na livraria?'}):({topic:'Pontos em uma competição',story:`Uma equipe começou uma etapa com ${n(a)} pontos. Por descumprir uma regra, perdeu ${n(b)} pontos. O regulamento permite resultados negativos.`,ask:'Qual foi a pontuação da equipe após a perda?'}),
 ],
 '×':[
  (a,b)=>({topic:'Preparando encomendas',story:`Uma loja montou ${n(a)} caixas. Em cada caixa, colocou exatamente ${n(b)} canetas.`,ask:'Quantas canetas foram usadas para montar todas as caixas?'}),
  (a,b)=>({topic:'No viveiro',story:`Um viveiro organizou ${n(a)} bandejas de mudas. Cada bandeja contém ${n(b)} mudas.`,ask:'Quantas mudas há nessas bandejas ao todo?'}),
  (a,b)=>({topic:'Ingressos para a sessão',story:`Um cinema vendeu ${n(a)} ingressos para uma sessão. Cada ingresso custou R$ ${n(b)},00.`,ask:'Quanto o cinema arrecadou com esses ingressos, em reais?'}),
  (a,b)=>({topic:'Organizando o depósito',story:`Um depósito recebeu ${n(a)} pacotes de cadernos. Todos os pacotes têm a mesma quantidade: ${n(b)} cadernos.`,ask:'Quantos cadernos o depósito recebeu ao todo?'}),
  (a,b)=>({topic:'Kits para os estudantes',story:`Para uma atividade, uma escola preparou ${n(a)} kits. Cada kit tem ${n(b)} peças de papel colorido.`,ask:'Quantas peças de papel foram usadas no total?'}),
  (a,b)=>({topic:'Uma pequena fábrica',story:`Uma fábrica produziu ${n(a)} lotes de peças. Cada lote contém exatamente ${n(b)} peças.`,ask:'Quantas peças foram produzidas nesses lotes?'}),
  (a,b)=>({topic:'Compra para o escritório',story:`Um escritório comprou ${n(a)} itens iguais. Cada item custou R$ ${n(b)},00, sem descontos ou taxas adicionais.`,ask:'Qual foi o valor total da compra, em reais?'}),
  (a,b)=>({topic:'Organizando uma feira',story:`Uma feira terá ${n(a)} estandes. Cada estande receberá ${n(b)} etiquetas para identificar os produtos.`,ask:'Quantas etiquetas precisam ser separadas para todos os estandes?'}),
 ]};
export function contextualQuestion(q){const p=expressionParts(q.question);if(!p)throw new Error('Esta questão não pode ser contextualizada');const key=questionId(q);let hash=0;for(const c of key)hash=(Math.imul(hash,31)+c.charCodeAt(0))|0;const pool=templates[p.operator];return pool[(hash>>>0)%pool.length](p.left,p.right);}
