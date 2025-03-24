import { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { PanelBar, PanelBarItem } from "@progress/kendo-react-layout";

export default function Action() {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = () => {
    const storedActions = JSON.parse(localStorage.getItem("actions")) || [];
    setActions(storedActions);
  };

  const saveActions = (updatedActions) => {
    setActions(updatedActions);
    localStorage.setItem("actions", JSON.stringify(updatedActions));
  };

  const addAction = () => {
    const newAction = { id: Date.now(), name: "New Action", done: false };
    saveActions([...actions, newAction]);
  };

  const toggleDone = (id) => {
    const updatedActions = actions.map((action) =>
      action.id === id ? { ...action, done: !action.done } : action
    );
    saveActions(updatedActions);
  };

  const deleteAction = (id) => {
    const updatedActions = actions.filter((action) => action.id !== id);
    saveActions(updatedActions);
  };

  return (
    <PanelBar>
      <PanelBarItem title="⚡ Action Tracker">
        <Button themeColor="primary" onClick={addAction} style={{ marginBottom: 10 }}>
          ➕ Add Action
        </Button>

        <Grid data={actions} style={{ width: "100%" }}>
          <GridColumn
            field="done"
            title=" Done"
            width="100px"
            cell={(props) => (
              <td>
                <input
                  type="checkbox"
                  checked={props.dataItem.done}
                  onChange={() => toggleDone(props.dataItem.id)}
                />
              </td>
            )}
          />
          <GridColumn field="name" title="Action Name" />
          <GridColumn
            field="delete"
            title="Remove"
            width="100px"
            cell={(props) => (
              <td>
                <Button
                  themeColor="error"
                  onClick={() => deleteAction(props.dataItem.id)}
                  icon="trash"
                />
              </td>
            )}
          />
        </Grid>
      </PanelBarItem>
    </PanelBar>
  );
}
