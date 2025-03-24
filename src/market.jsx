import { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { askGPT } from "./gptAPI.js"; // AI insights
import "./App.css"; // Add styles if needed
import "@progress/kendo-theme-default/dist/all.css";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";


export default function MarketTrend({ crop }) {
  const [localMarket, setLocalMarket] = useState([]);
  const [countryMarket, setCountryMarket] = useState([]);
  const [globalMarket, setGlobalMarket] = useState([]);
  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    // Simulated market data (Replace with actual API calls)
    setLocalMarket([
      { rank: 1, name: "AgroMart", price: 150 },
      { rank: 2, name: "FarmFresh", price: 140 },
      { rank: 3, name: "GreenHarvest", price: 135 },
      { rank: 4, name: "LocalGoods", price: 130 },
      { rank: 5, name: "FarmHub", price: 125 },
    ]);

    setCountryMarket([
      { rank: 1, name: "KenyaAgro", price: 180 },
      { rank: 2, name: "FarmPro", price: 170 },
      { rank: 3, name: "Agrimarket", price: 165 },
      { rank: 4, name: "GreenKen", price: 160 },
      { rank: 5, name: "HarvestNation", price: 150 },
    ]);

    setGlobalMarket([
      { rank: 1, name: "GlobalAgro", price: 220 },
      { rank: 2, name: "WorldFarmers", price: 210 },
      { rank: 3, name: "AgriGlobal", price: 205 },
      { rank: 4, name: "IntHarvest", price: 200 },
      { rank: 5, name: "GlobalFresh", price: 190 },
    ]);

    // Generate AI insight based on crop and market data
    generateAIInsight(crop);
  }, [crop]);

  const generateAIInsight = async (crop) => {
    const prompt = `Based on market trends, which is the best market for selling ${crop}?`;
    const insight = await askGPT(prompt);
    setAiInsight(insight);
  };

  return (
    <div className="market-container">
      <h2 className="marketh2"  >📈 Market Trend</h2>

      <PanelBar>
        {/* Local Market */}
        <PanelBarItem title="🌿 Local Market">
          <Grid data={localMarket}>
            <GridColumn field="rank" title="Rank" width="50px" />
            <GridColumn field="name" title="Market Name" />
            <GridColumn field="price" title="Price (Ksh)" />
          </Grid>
        </PanelBarItem>

        {/* Country Market */}
        <PanelBarItem title="🌍 Country Market">
          <Grid data={countryMarket}>
            <GridColumn field="rank" title="Rank" width="50px" />
            <GridColumn field="name" title="Market Name" />
            <GridColumn field="price" title="Price (Ksh)" />
          </Grid>
        </PanelBarItem>

        {/* International Market */}
        <PanelBarItem title="🌎 International Market">
          <Grid data={globalMarket}>
            <GridColumn field="rank" title="Rank" width="50px" />
            <GridColumn field="name" title="Market Name" />
            <GridColumn field="price" title="Price (USD)" />
          </Grid>
        </PanelBarItem>
      </PanelBar>

      {/* AI Closing Note */}
      <div className="ai-insight">
        <h3 className="marketh3"> Our Insight</h3>
        <p>{aiInsight || "Analyzing market trends..."}</p>
      </div>
    </div>
  );
}