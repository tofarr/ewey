import { useTranslation } from "react-i18next";
import FormControl from "@mui/material/FormControl";
import EweyField from "../eweyField/EweyField";
import Typography from "@mui/material/Typography";

const PersistyImgRefWrapper = () => {
  const PersistyImgRef: EweyField<string> = ({ value, onSetValue }) => {
    const { t } = useTranslation()
    debugger;
    if (!onSetValue) {
      return (
        <Typography variant="body2">PERSISTY IMG REF</Typography>
      )
    }
    return (
      <FormControl style={{width: "100%"}}>
        <Typography variant="body2">PERSISTY IMG REF</Typography>
      </FormControl>
    );
  };
  return PersistyImgRef;
};

export default PersistyImgRefWrapper;
