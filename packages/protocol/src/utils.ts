export function getScore(goodBalances: any[], badBalances: any[]) {
  const coeff = [0.2, 0.2, 0.25, 0.05, 0.05, 0.05];
  let score = 0.0;
  for (let i = 0; i < coeff.length; i++) {
    if (goodBalances[i] === 0 && badBalances[i] === 0) {
      continue;
    }
    score += coeff[i] * (goodBalances[i] > badBalances[i] ? 1 : -1);
  }
  return score;
}
