import { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";

export default function Deadlines() {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    loadActions();
    const interval = setInterval(updateLiveTime, 1000); // Auto-update live time countdown
    return () => clearInterval(interval);
  }, []);

  const loadActions = () => {
    const storedActions = JSON.parse(localStorage.getItem("actions")) || [];
    setActions(storedActions);
  };

  const updateLiveTime = () => {
    setActions((prevActions) =>
      prevActions.map((action) => ({
        ...action,
        liveTime: calculateLiveTime(action.deadline),
      }))
    );
  };

  const calculateLiveTime = (deadline) => {
    if (!deadline) return "No deadline";
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffMs = dueDate - now;

    if (diffMs <= 0) return "⏳ Expired";

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <PanelBar>
      <PanelBarItem title="⏳ Deadlines">
        <Grid data={actions} style={{ width: "100%" }}>
          <GridColumn field="name" title="📝 Action" />
          <GridColumn
            field="deadline"
            title="📅 Due Date"
            width="180px"
            cell={(props) => (
              <td>
                {props.dataItem.deadline
                  ? new Date(props.dataItem.deadline).toLocaleString()
                  : "No deadline"}
              </td>
            )}
          />
          <GridColumn
            field="liveTime"
            title="⏳ Live Time"
            width="150px"
            cell={(props) => <td>{calculateLiveTime(props.dataItem.deadline)}</td>}
          />
        </Grid>
      </PanelBarItem>
    </PanelBar>
  );
}
