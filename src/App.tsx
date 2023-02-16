import "./index.css";
import openRecs from "../secretData/stockRecs/stockAdv/openRecs.json";
import closedRecs from "../secretData/stockRecs/stockAdv/closedRecs.json";
import { convertRate, RateInterval, xirr, XirrInput } from "node-irr";

// ---> TODO add small node app for generating obfuscated stock recs without any info besides returns n openDate n closeDate

interface StockRecommendationsWithMetadata {
  portfolios: Array<
    "@StockAdvisorTomInclusion" | "@StockAdvisorDavidInclusion"
  >; // e.g. ["@StockAdvisorTomInclusion", "@StockAdvisorDavidInclusion"]
  recs: StockRecommendation[];
}

interface StockRecommendation {
  returns: number; // e.g. 0.058763 // ---> not sure if dividend included
  open_date: string; // e.g. "2023-02-02T00:00:00"
  close_date: string | null;
  portfolio_id: "@StockAdvisorTomInclusion" | "@StockAdvisorDavidInclusion";
}

const stockRecs = [
  ...openRecs.recs,
  ...closedRecs.recs,
] as StockRecommendation[];

const tomStockRecs = stockRecs.filter(
  (rec) => rec.portfolio_id === "@StockAdvisorTomInclusion"
);
const davidStockRecs = stockRecs.filter(
  (rec) => rec.portfolio_id === "@StockAdvisorDavidInclusion"
);

function getXirr(recs: StockRecommendation[]): number {
  const stockBuys = recs.map(
    (rec) => ({ amount: -1, date: new Date(rec.open_date) } satisfies XirrInput)
  );
  const stockSells = recs.map((rec) => ({
    amount: 1 + rec.returns,
    date: rec.close_date ? new Date(rec.close_date) : new Date(),
  }));
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

function App() {
  return (
    <>
      <div>Overall Stock Advisor XIRR: {getXirr(stockRecs)}</div>
      <div>Team TOM XIRR: {getXirr(tomStockRecs)}</div>
      <div>Team David XIRR: {getXirr(davidStockRecs)}</div>
    </>
  );
}

export default App;
