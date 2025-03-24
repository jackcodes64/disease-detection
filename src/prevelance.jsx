import { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";
import { askGPT } from "./gptAPI.js"; // AI for insights

export default function Prevalence() {
  const [diseases, setDiseases] = useState([]);
  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    loadPrevalenceData();
    generateAIInsight();
  }, []);

  const loadPrevalenceData = () => {
    const storedDiseases = JSON.parse(localStorage.getItem("diseases")) || [];
    setDiseases(storedDiseases);
  };

  const generateAIInsight = async () => {
    const prompt = "Analyze the disease prevalence data and provide insights.";
    const insight = await askGPT(prompt);
    setAiInsight(insight);
  };

  return (
    <div>
    <PanelBar>
      <PanelBarItem title="🦠 Disease Prevalence">
        {diseases.length > 0 ? (
          <Grid data={diseases}>
            <GridColumn field="name" title="Disease Name" />
            <GridColumn field="prevalence" title="Prevalence (%)" />
          </Grid>
        ) : (
          <p>No disease data found in storage.</p>
        )}
      </PanelBarItem>
    </PanelBar>

    {/* AI Closing Note */}
    <div className="ai-insight">
    <h3 className="marketh3"> Our Insight</h3>
    <p>{aiInsight || "Analyzing common diseases"}</p>
  </div>
  </div>
  );
}
