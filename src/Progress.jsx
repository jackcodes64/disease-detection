import { useState, useEffect } from "react";
import { ProgressBar } from "@progress/kendo-react-progressbars";
import { Card, CardHeader, CardBody } from "@progress/kendo-react-layout";
import "@progress/kendo-theme-default/dist/all.css";

export default function Progress() {
  const [progress, setProgress] = useState(0);

  // Save test actions in localStorage on component mount
  useEffect(() => {
    localStorage.setItem(
      "actions",
      JSON.stringify([
        { name: "Buy CAN fertilizer", completed: true },
        { name: "Prune fruit trees", completed: false },
        { name: "Contact customers", completed: true },
        { name: "Order storage sacs", completed: false },
        { name: "Check soil pH", completed: true },
        { name: "Water crops", completed: true },
        { name: "Weed farm", completed: false },
        { name: "Schedule harvest", completed: false },
      ])
    );
    console.log("Test actions added to localStorage");
  }, []); // Runs once on mount

  // Calculate progress
  useEffect(() => {
    calculateProgress();
    window.addEventListener("storage", calculateProgress);

    return () => {
      window.removeEventListener("storage", calculateProgress);
    };
  }, []);

  const calculateProgress = () => {
    const storedActions = JSON.parse(localStorage.getItem("actions")) || [];
    const totalTasks = storedActions.length;
    const completedTasks = storedActions.filter((task) => task.completed).length;

    const progressValue = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setProgress(progressValue);
    console.log("Progress Updated:", progressValue); // Debugging log
  };

  return (
    <Card style={{ padding: "20px", maxWidth: "600px", textAlign: "center" }}>
      <CardHeader>
        <h3 style={{ marginBottom: "20px", color: "#5caf2c" }}>
          Your Progress In Activities
        </h3>
      </CardHeader>
      <CardBody>
        <ProgressBar value={progress} labelVisible={true} style={{ height: "40px", borderRadius: "8px" }} />
        <p style={{ marginTop: "10px", fontWeight: "bold" }}>{Math.round(progress)}% Complete</p>
      </CardBody>
    </Card>
  );
  
}
