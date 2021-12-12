import { useContext } from "react";
import SettingsContext from "../context/Setting";

export default () => {
  
  const context = useContext(SettingsContext);

  return context;
};