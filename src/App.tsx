import "./index.css";
import openRecs from "../secretData/stockRecs/stockAdv/openRecs.json";
import closedRecs from "../secretData/stockRecs/stockAdv/closedRecs.json";

interface StockRecommendationsWithMetadata {
  portfolios: string[]; // e.g. ["@StockAdvisorTomInclusion", "@StockAdvisorDavidInclusion"]
  recs: StockRecommendation[];
}

interface StockRecommendation {
  returns: number; // e.g. 0.058763 // ---> not sure if dividend included
  open_date: string; // e.g. "2023-02-02T00:00:00"
  close_date: string;
  ticker_symbol: string;
}

const stockRecommendations = [
  ...openRecs.recs,
  ...closedRecs.recs,
] as StockRecommendation[];

function App() {
  return <>Oh, hello! ✨</>;
}

export default App;
