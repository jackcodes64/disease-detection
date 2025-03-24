import { useState, useEffect } from "react";
import { Card, CardContent } from "@progress/kendo-react-layout";
import { askGPT } from "./gptAPI";

export default function Predictions() {
  const [prediction, setPrediction] = useState("Gathering AI insights...");

  useEffect(() => {
    generatePrediction();
  }, []);

  const generatePrediction = async () => {
    const storedData = JSON.parse(localStorage.getItem("market_trends")) || [];
    const crops = storedData.map(item => item.crop).join(", ") || "various crops";

    const prompt = `Based on past trends and AI analysis, predict the best farming decision for ${crops}.`;
    const aiResponse = await askGPT(prompt);
    setPrediction(aiResponse);
  };

  return (
    <Card style={{ width: "100%", padding: "20px", margin: "20px 0", backgroundColor: "#eef2f3" }}>
      <CardContent>
        <h2>🔮 AI Foresight</h2>
        <p>{prediction}</p>
      </CardContent>
    </Card>
  );
}
