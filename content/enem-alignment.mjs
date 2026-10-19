// Editorial interpretation, not an official Inep mapping of individual lessons.
// H1–H4 were consulted in the indexed excerpt of the official pedagogical report.
export const INEP_NUMERIC_REFERENCE = 'https://download.inep.gov.br/publicacoes/institucionais/avaliacoes_e_exames_da_educacao_basica/relatorio_pedagogico_enem_2009_2010.pdf';
const LINKS = {
  1: [['H1','Ler e decompor valores posicionais relaciona diferentes representações de números naturais.']],
  2: [['H1','Temperaturas e saldos dão significado contextual aos inteiros.'],['H3','Os problemas combinam variações numéricas para encontrar um saldo final.']],
  3: [['H1','Frações equivalentes são representações diferentes do mesmo racional.'],['H3','Receitas e contagens exigem interpretar e calcular partes de um todo.']],
  4: [['H1','Frações e escrita decimal representam o mesmo número racional.'],['H3','Compras e medidas exigem calcular com unidades e partes da unidade.']],
  5: [['H3','O aluno escolhe operações para resolver situações com grupos e repartições.'],['H4','Estimativa e operação inversa ajudam a conferir se um resultado é plausível.']],
  6: [['H3','A estrutura de expressões numéricas representa situações com várias operações.']],
  7: [['H2','Múltiplos e pares de divisores revelam padrões na contagem de grupos.'],['H3','O aluno usa divisões exatas em situações de organização.']],
  8: [['H2','Critérios identificam padrões nos algarismos para testar divisibilidade.']],
  9: [['H2','A decomposição prima organiza relações multiplicativas entre naturais.']],
  10: [['H3','Repartições e coincidência de ciclos exigem selecionar MDC ou MMC a partir do contexto.']],
};
export function module01Alignment(id) {
  return (LINKS[Number(id.split('.t')[1])] ?? []).map(([skill,reason]) => ({skill,reason,kind:'editorial_non_official',reference:INEP_NUMERIC_REFERENCE}));
}
