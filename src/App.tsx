import "./index.css";
import Table from "rc-table";
import { getRecCompanyStatistics, getXirr } from "./statisticsCalculations";
import {
  davidStockRecs,
  stockRecs,
  StockRecWithDate,
  tomStockRecs,
} from "./stockRecs";
import "rc-table/assets/index.css";

// ---> TODO add small node app for generating obfuscated stock recs without any info besides returns n openDate n closeDate

const columns = [
  {
    title: "Ticker",
    dataIndex: "ticker",
    key: "ticker",
    width: 100,
  },
  {
    title: "% of portfolio current value",
    dataIndex: "percentOfPortfolioCurrentValue",
    key: "percentOfPortfolioCurrentValue",
    width: 100,
  },
  {
    title: "Xirr in %",
    dataIndex: "xirr",
    key: "xirr",
    width: 100,
  },
  {
    title: "Rec count",
    dataIndex: "recCount",
    key: "recCount",
    width: 100,
  },
  {
    title: "First rec",
    dataIndex: "firstRecDate",
    key: "firstRecDate",
    width: 100,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 150,
  },
  {
    title: "Sector",
    dataIndex: "sector",
    key: "sector",
    width: 200,
  },
];

function getFormattedXirr(recs: StockRecWithDate[]): string {
  const xirr = getXirr(recs);
  return `${(xirr * 100).toFixed(2)}%`;
}

const stockAdvisorXirr = getFormattedXirr(stockRecs);
const teamTomXirr = getFormattedXirr(tomStockRecs);
const teamDavidXirr = getFormattedXirr(davidStockRecs);
const openPositionCompanyStatistics = getRecCompanyStatistics(stockRecs)
  .sort(
    (a, b) =>
      b.percentOfPortfolioCurrentValue - a.percentOfPortfolioCurrentValue
  )
  .map((company) => ({
    ...company,
    key: company.ticker,
    percentOfPortfolioCurrentValue:
      company.percentOfPortfolioCurrentValue.toFixed(2),
    xirr: (company.xirr * 100).toFixed(2),
    recCount: company.recs.length,
  }));

function App() {
  return (
    <>
      <div>Overall Stock Advisor XIRR*: {stockAdvisorXirr}</div>
      <div>Team TOM XIRR*: {teamTomXirr}</div>
      <div>Team David XIRR*: {teamDavidXirr}</div>
      <div>
        *dividends not included, but they are probably miniscule either way
      </div>
      <Table
        columns={columns}
        data={openPositionCompanyStatistics}
        style={{ color: "black !important", borderColor: "grey !important" }}
      />
    </>
  );
}

export default App;
