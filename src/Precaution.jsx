import { useState, useEffect } from "react";
import { Card, CardContent } from "@progress/kendo-react-layout";
import { askGPT } from "./gptAPI";

export default function Precautions({ disease }) {
  const [precaution, setPrecaution] = useState("Loading AI recommendations...");

  useEffect(() => {
    if (disease) {
      fetchPrecaution(disease);
    }
  }, [disease]);

  const fetchPrecaution = async (disease) => {
    const prompt = `Give detailed precautions to prevent and control ${disease} in crops.`;
    const aiResponse = await askGPT(prompt);
    setPrecaution(aiResponse);
  };

  return (
    <Card style={{ width: "100%", padding: "20px", margin: "20px 0", backgroundColor: "#f8f9fa" }}>
      <CardContent>
        <h2>🛡️ AI Precautions</h2>
        <p><strong>Disease:</strong> {disease || "N/A"}</p>
        <p>{precaution}</p>
      </CardContent>
    </Card>
  );
}
