import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import EweyField from "./EweyField";

const ListWrapper = (ItemComponent: EweyField<any>, createItem?: () => any) => {
  const ListComponent: EweyField<any[]> = ({ path, value, onSetValue }) => {
    if (!value) {
      value = [];
    }

    function renderItem(v: any, index: number) {
      let onSetItemValue = undefined;
      if (onSetValue) {
        onSetItemValue = (val: any) => {
          if (value) {
            const newValue = value.slice();
            newValue[index] = val;
            onSetValue?.(newValue);
          }
        };
      }
      const itemPath = [ ...(path || []), index.toString()]
      
      function handleRemoveItem() {
        const newValue = value?.splice(index, 1);
        onSetValue?.(newValue);
      }

      return (
        <ListItem key={index}>
          <Grid container spacing={2}>
            <Grid item xs>
              <ItemComponent path={itemPath} value={v} onSetValue={onSetItemValue} />
            </Grid>
            {onSetValue && (
              <Grid item>
                <Box pt={1}>
                  <IconButton aria-label="delete" onClick={handleRemoveItem}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            )}
          </Grid>
        </ListItem>
      );
    }

    function renderCreateButton() {
      if (!createItem || !onSetValue) {
        return null;
      }

      function handleAppend() {
        if (value) {
          const newValue = value.slice();
          newValue.push((createItem as any)());
          onSetValue?.(newValue);
        }
      }

      return (
        <IconButton aria-label="delete" onClick={handleAppend}>
          <AddIcon />
        </IconButton>
      );
    }

    if ((!value || !value.length) && !createItem) {
      return null;
    }

    return (
      <Paper>
        <Box textAlign="left">
          <List>{value.map(renderItem)}</List>
        </Box>
        {renderCreateButton()}
      </Paper>
    );
  };

  return ListComponent;
};

export default ListWrapper;
