import "./index.css";
import openJson from "../secretData/stockRecs/stockAdv/open.json";

interface StockRecommendations {
  portfolios: string[]; // e.g. ["@StockAdvisorTomInclusion", "@StockAdvisorDavidInclusion"]
  recs: StockRecommendation[];
}

interface StockRecommendation {
  returns: number; // e.g. 0.058763 // ---> not sure if dividend included
  open_date: string; // e.g. "2023-02-02T00:00:00"
  ticker_symbol: string;
}

const openRecommendations = openJson as StockRecommendations;

function App() {
  return <>Oh, hello! ✨</>;
}

export default App;
