// Settings Context - src/context/Settings
import React, { useState } from "react";

const SettingsContext = React.createContext();

// const defaultSettings = {
//   languageIndex:0
// };

export const SettingsProvider = ({ children, settings }) => {
  const [currentSettings, setCurrentSettings] = useState(
    settings
  );

  const saveSettings = (values) => {
   setCurrentSettings(values)
  };

  return (
    <SettingsContext.Provider
      value={{ settings: currentSettings, saveSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;

export default SettingsContext;