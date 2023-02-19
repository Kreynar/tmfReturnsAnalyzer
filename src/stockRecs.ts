import openRecs from "../data/secret/tmf/stockAdvisor/openRecs.json";
import closedRecs from "../data/secret/tmf/stockAdvisor/closedRecs.json";

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

  ticker_symbol: string;
  company_name: string;
  sector: string;
}

export interface StockRecWithDate
  extends Omit<StockRecommendation, "open_date" | "close_date"> {
  openDate: Date;
  closeDate: Date | null;
}

export const stockRecs = (
  [...openRecs.recs, ...closedRecs.recs] as StockRecommendation[]
).map<StockRecWithDate>((rec) => ({
  ...rec,
  openDate: new Date(rec.open_date),
  closeDate: rec.close_date ? new Date(rec.close_date) : null,
}));

export const tomStockRecs = stockRecs.filter(
  (rec) => rec.portfolio_id === "@StockAdvisorTomInclusion"
);
export const davidStockRecs = stockRecs.filter(
  (rec) => rec.portfolio_id === "@StockAdvisorDavidInclusion"
);
