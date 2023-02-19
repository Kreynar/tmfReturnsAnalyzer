import { convertRate, RateInterval, xirr } from "node-irr";

export function getApproximateSnp500Xirr(): number {
  function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const startingYear = 1990;
  const endingYear = 2022;
  const approximateAnnualizedRoiWithDividends = 0.09;
  const years = [];
  for (let i = startingYear; i < endingYear; i++) {
    years.push(i);
  }
  const stockBuys = years.map((year) => ({
    date: new Date(`${year}`),
    amount: -1,
  }));
  const stockSells = years.map((year) => ({
    date: new Date(`${endingYear}`),
    amount:
      (1 +
        approximateAnnualizedRoiWithDividends +
        getRandomArbitrary(-0.1, 0.1)) **
      (endingYear - year),
  }));
  console.log(stockSells.map((s) => s.amount));
  const stockBuysAndSells = [...stockBuys, ...stockSells];
  const sortedStockBuysAndSells = [...stockBuysAndSells].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  const dailyRateOfReturn = xirr(sortedStockBuysAndSells);
  const annualRateOfReturn = convertRate(
    dailyRateOfReturn.rate,
    RateInterval.Year
  );
  return annualRateOfReturn;
}
