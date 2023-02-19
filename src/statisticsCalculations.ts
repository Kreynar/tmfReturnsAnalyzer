import { convertRate, RateInterval, xirr, XirrInput } from "node-irr";
import { StockRecWithDate } from "./stockRecs";

function getStockFlows(recs: StockRecWithDate[]) {
  const stockBuys = recs.map(
    (rec) => ({ amount: -1, date: rec.openDate } satisfies XirrInput)
  );
  const stockSells = recs.map(
    (rec) =>
      ({
        amount: 1 + rec.returns,
        date: rec.closeDate ?? new Date(),
      } satisfies XirrInput)
  );
  const stockBuysAndSells = [...stockBuys, ...stockSells];
  const sortedStockBuysAndSells = [...stockBuysAndSells].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  ) satisfies XirrInput[];
  return sortedStockBuysAndSells;
}

function getFirstRecDate(recs: StockRecWithDate[]) {
  const sortedStockRecs = [...recs].sort(
    (a, b) => a.openDate.getTime() - b.openDate.getTime()
  );
  return sortedStockRecs[0].openDate.getFullYear();
}

export function getRecCompanyStatistics(recs: StockRecWithDate[]) {
  const openRecs = recs.filter((rec) => !rec.closeDate);
  interface OpenRecCompany {
    ticker: string;
    name: string;
    sector: string;
    recs: StockRecWithDate[];
  }
  type OpenRecCompanyMap = Record</* ticker */ string, OpenRecCompany>;
  interface OpenRecCompanyWithXirr extends OpenRecCompany {
    xirr: number;
    currentValue: number;
  }
  interface OpenRecCompanyWithXirrAndPortfolioPercent
    extends OpenRecCompanyWithXirr {
    percentOfPortfolioCurrentValue: number;
    recCount: number;
    firstRecDate: number;
  }
  const openRecCompanyMap = openRecs.reduce((companyMap, rec) => {
    return {
      ...companyMap,
      [rec.ticker_symbol]: {
        ticker: rec.ticker_symbol,
        name: rec.company_name,
        sector: rec.sector,
        recs: [...(companyMap[rec.ticker_symbol]?.recs ?? []), rec],
      },
    };
  }, {} as OpenRecCompanyMap);
  const openRecCompaniesWithXirr = Object.values(openRecCompanyMap).map(
    (company) =>
      ({
        ...company,
        xirr: getXirr(company.recs),
        currentValue: getPositionCurrentValue(company.recs),
      } satisfies OpenRecCompanyWithXirr)
  );
  const totalCurrentValue = openRecCompaniesWithXirr.reduce(
    (totalCurrentValue_, company) => totalCurrentValue_ + company.currentValue,
    0
  );
  const eachUsdEqualsPercentageOfTotalCurrentValue = 100 / totalCurrentValue;
  const companies = openRecCompaniesWithXirr.map(
    (company) =>
      ({
        ...company,
        percentOfPortfolioCurrentValue:
          company.currentValue * eachUsdEqualsPercentageOfTotalCurrentValue,
        recCount: company.recs.length,
        firstRecDate: getFirstRecDate(company.recs),
      } satisfies OpenRecCompanyWithXirrAndPortfolioPercent)
  );
  return companies;
}

function getPositionCurrentValue(recs: StockRecWithDate[]): number {
  const value = recs.reduce((value_, rec) => value_ + 1 + rec.returns, 0);
  return value;
}

export function getXirr(recs: StockRecWithDate[]): number {
  const stockFlows = getStockFlows(recs);
  const dailyRateOfReturn = xirr(stockFlows);
  const annualRateOfReturn = convertRate(
    dailyRateOfReturn.rate,
    RateInterval.Year
  );
  return annualRateOfReturn;
}
