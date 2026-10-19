import test from 'node:test';
import assert from 'node:assert/strict';
import { MODULE01_LESSONS } from '../content/review/module01.mjs';

const abs = value => value < 0n ? -value : value;
const gcd = (a, b) => { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a || 1n; };
const rational = (numerator, denominator = 1n) => {
  if (denominator === 0n) throw new Error('denominador zero');
  if (denominator < 0n) [numerator, denominator] = [-numerator, -denominator];
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};
const add = (a, b) => rational(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
const multiply = (a, b) => rational(a.numerator * b.numerator, a.denominator * b.denominator);
const sameRational = (a, b) => a.numerator === b.numerator && a.denominator === b.denominator;

function decimal(value) {
  let text = String(value).trim().replace(/−/g, '-').replace(/^-R\$\s*/, '-').replace(/^R\$\s*/, '').replace(/\s*(?:L|kg|cm|visitantes?)$/i, '').replace(/\s/g, '');
  const sign = text.startsWith('-') ? -1n : 1n;
  text = text.replace(/^[+-]/, '');
  if (!/^\d+(?:,\d+)?$/.test(text)) throw new Error(`literal numérico inválido: ${value}`);
  const [whole, fraction = ''] = text.split(',');
  return rational(sign * BigInt(whole + fraction), 10n ** BigInt(fraction.length));
}

function fraction(value) {
  const text = String(value).trim().replace(/−/g, '-').replace(/\s/g, '');
  const match = /^(-?\d+)\/(-?\d+)$/.exec(text);
  if (!match) throw new Error(`fração inválida: ${value}`);
  return rational(BigInt(match[1]), BigInt(match[2]));
}

const numeric = value => String(value).includes('/') ? fraction(value) : decimal(value);
const exactly = expected => choice => sameRational(numeric(choice), expected);
const reducedFraction = expected => choice => {
  const parsed = fraction(choice);
  return sameRational(parsed, expected) && gcd(abs(BigInt(String(choice).trim().split('/')[0])), BigInt(String(choice).trim().split('/')[1])) === 1n;
};
const sequence = expected => choice => {
  const values = String(choice).split(',').map(item => decimal(item));
  return values.length === expected.length && values.every((value, index) => sameRational(value, rational(BigInt(expected[index]))));
};
const integer = value => Number(decimal(String(value).replace(/\s/g, '')) .numerator);

function arithmetic(expression) {
  const source = String(expression).replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/[\[\]]/g, match => match === '[' ? '(' : ')').replace(/²/g, '^2').replace(/³/g, '^3');
  const tokens = source.match(/\d+(?:\.\d+)?|[()+\-*/%^]/g);
  if (!tokens || tokens.join('') !== source.replace(/\s/g, '')) throw new Error(`expressão inválida: ${expression}`);
  const values = [], operators = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 };
  const apply = () => {
    const operator = operators.pop(), right = values.pop(), left = values.pop();
    if (operator === '+') values.push(left + right);
    if (operator === '-') values.push(left - right);
    if (operator === '*') values.push(left * right);
    if (operator === '/') values.push(left / right);
    if (operator === '%') values.push(left % right);
    if (operator === '^') values.push(left ** right);
  };
  let expectingValue = true;
  for (const token of tokens) {
    if (/^\d/.test(token)) { values.push(Number(token)); expectingValue = false; continue; }
    if (token === '(') { operators.push(token); expectingValue = true; continue; }
    if (token === ')') { while (operators.at(-1) !== '(') apply(); operators.pop(); expectingValue = false; continue; }
    if (expectingValue && token === '-') { values.push(0); }
    while (operators.length && operators.at(-1) !== '(' && precedence[operators.at(-1)] >= precedence[token]) apply();
    operators.push(token); expectingValue = true;
  }
  while (operators.length) apply();
  if (values.length !== 1) throw new Error(`expressão não resolvida: ${expression}`);
  return values[0];
}

const operation = expected => choice => arithmetic(choice) === expected;
const relation = expected => choice => {
  const match = /^\s*(-?\d+)\s*([<>]=?|=)\s*(-?\d+)\s*$/.exec(String(choice).replace(/−/g, '-'));
  if (!match) return false;
  const left = Number(match[1]), right = Number(match[3]);
  return { '<': left < right, '>': left > right, '<=': left <= right, '>=': left >= right, '=': left === right }[match[2]] === expected;
};
const prime = value => { const n = Number(decimal(value).numerator); if (n < 2 || !Number.isInteger(n)) return false; for (let divisor = 2; divisor * divisor <= n; divisor++) if (n % divisor === 0) return false; return true; };
const divisibleBy = divisor => choice => Number(decimal(choice.replace(/\s/g, '')).numerator) % divisor === 0;
const divisorsOf = value => { const result = []; for (let divisor = 1; divisor <= value; divisor++) if (value % divisor === 0) result.push(divisor); return result; };
const divisorList = expected => choice => {
  const values = String(choice).replace(/\s+e\s+/g, ',').split(',').filter(Boolean).map(item => Number(item.trim()));
  return values.length === expected.length && values.every((value, index) => value === expected[index]);
};
const primeFactorization = expected => choice => {
  const factors = String(choice).replace(/²/g, '^2').replace(/³/g, '^3').replace(/\s/g, '').split('×');
  const actual = new Map();
  for (const factor of factors) {
    const match = /^(\d+)(?:\^(\d+))?$/.exec(factor);
    if (!match || !prime(match[1])) return false;
    const base = Number(match[1]), exponent = Number(match[2] ?? 1);
    actual.set(base, (actual.get(base) ?? 0) + exponent);
  }
  return actual.size === expected.size && [...expected].every(([base, exponent]) => actual.get(base) === exponent);
};
const time = expectedMinutes => choice => {
  const match = /^(\d{1,2})h(\d{2})$/.exec(String(choice).replace(/\s/g, ''));
  return !!match && Number(match[1]) * 60 + Number(match[2]) === expectedMinutes;
};
const truth = expected => choice => String(choice).startsWith(expected ? 'Sim' : 'Não');

const factorMap = value => {const result=new Map();for(let p=2;p<=value;p++){while(value%p===0){result.set(p,(result.get(p)??0)+1);value/=p;}}return result;};
const lcm=(a,b)=>a*b/Number(gcd(BigInt(a),BigInt(b)));
const numericInteger=value=>exactly(rational(BigInt(value)));
// Bounded, independent recomputation for these exact authored contexts. This
// does not parse pedagogical intent or replace the required human review.
const specs = {
 'math.m01.t01:1': numericInteger(3*100),
 'math.m01.t01:2': numericInteger(7000+500+6),
 'math.m01.t01:3': sequence([2090,2009,1999,2900].sort((a,b)=>a-b)),
 'math.m01.t01:4': numericInteger(7*100),
 'math.m01.t02:1': relation(true),
 'math.m01.t02:2': numericInteger(-18+7-4),
 'math.m01.t02:3': numericInteger(-2+5),
 'math.m01.t02:4': numericInteger(-35+50-12),
 'math.m01.t03:1': exactly(rational(3n,5n)),
 'math.m01.t03:2': exactly(add(rational(2n,3n),rational(1n,6n))),
 'math.m01.t03:3': reducedFraction(multiply(rational(3n,5n),rational(10n,9n))),
 'math.m01.t03:4': exactly(multiply(rational(24n),rational(2n,3n))),
 'math.m01.t04:1': exactly(add(rational(4n),rational(7n,100n))),
 'math.m01.t04:2': exactly(add(rational(1250n,100n),rational(-378n,100n))),
 'math.m01.t04:3': exactly(rational(3n,8n)),
 'math.m01.t04:4': exactly(multiply(rational(25n,10n),rational(8n))),
 'math.m01.t05:1': operation(5*9),
 'math.m01.t05:2': operation(864/8),
 'math.m01.t05:3': operation(428+175),
 'math.m01.t05:4': operation((4*18-10)/2),
 'math.m01.t06:1': operation(7+2*4),
 'math.m01.t06:2': operation(30-4*(2+3)),
 'math.m01.t06:3': numericInteger(5+4*3),
 'math.m01.t06:4': operation(2**3+18/(3+3)*4),
 'math.m01.t07:1': divisibleBy(8),
 'math.m01.t07:2': numericInteger(Math.max(...divisorsOf(24).filter(d=>d<24))),
 'math.m01.t07:3': numericInteger(72/9),
 'math.m01.t07:4': divisorList(divisorsOf(30)),
 'math.m01.t08:1': divisibleBy(10),
 'math.m01.t08:2': divisibleBy(9),
 'math.m01.t08:3': divisibleBy(8),
 'math.m01.t08:4': truth(2418%6===0),
 'math.m01.t09:1': prime,
 'math.m01.t09:2': primeFactorization(factorMap(60)),
 'math.m01.t09:3': operation(2**3*5),
 'math.m01.t09:4': primeFactorization(factorMap(126)),
 'math.m01.t10:1': choice=>{const g=Number(gcd(24n,36n));return (/^MDC/.test(choice)?g:/^MMC/.test(choice)?lcm(24,36):arithmetic(choice))===g;},
 'math.m01.t10:2': exactly(rational(gcd(28n,42n))),
 'math.m01.t10:3': numericInteger(lcm(8,12)),
 'math.m01.t10:4': time(8*60+lcm(15,20)),
};

test('os 40 exercícios do módulo 01 têm exatamente um gabarito matemático recomputado', () => {
  const exercises = Object.values(MODULE01_LESSONS).flatMap(lesson => lesson.exercises.map((exercise, index) => ({ exercise, key: `${lesson.id}:${index + 1}` })));
  assert.equal(exercises.length, 40);
  assert.equal(Object.keys(specs).length, 40);
  for (const { exercise, key } of exercises) {
    const spec = specs[key];
    assert.ok(spec, `falta recomputação independente para ${key}`);
    const matches = exercise.choices.filter(spec);
    assert.equal(matches.length, 1, `${key} tem ${matches.length} alternativa(s) matematicamente equivalente(s): ${matches.join(' | ')}`);
    assert.equal(spec(exercise.correctAnswer), true, `${key} correctAnswer não resolve o contexto`);
  }
});

test('contraprovas impedem os três duplicados corrigidos de voltarem', () => {
  const target = rational(2n, 3n);
  assert.equal(sameRational(fraction('30/45'), target), true);
  assert.equal(gcd(30n, 45n), 15n);
  assert.equal(reducedFraction(target)('30/45'), false);
  assert.equal(sameRational(fraction('3/6'), rational(1n, 2n)), true);
  assert.equal(sameRational(fraction('3/6'), rational(5n, 6n)), false);
  assert.equal(sameRational(decimal('4,70'), decimal('4,7')), true);
  assert.equal(sameRational(decimal('4,70'), decimal('4,07')), false);
});
