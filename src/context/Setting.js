// Settings Context - src/context/Settings
import React, { useState } from "react";
import { auth, db } from "../../firebase";

const SettingsContext = React.createContext();

// const defaultSettings = {
//   languageIndex:0
// };

export const SettingsProvider = ({ children, settings }) => {
  // let settings = 0;
  // async function getDbValues() {
  //   const userInfo = db.collection("users").doc(auth.currentUser.uid);
  //   const doc = await userInfo.get();
  //   if (!doc.exists) {
  //     console.log("No such document!");
  //   } else {
  //     if (doc.data().language) {
  //       // history = doc.data().history;
  //       console.log("LANG : ", doc.data().language);
  //       if (doc.data().language === "Hungary") {
  //         settings = 1;
  //         setCurrentSettings(1);
  //       } else {
  //         settings = 0;
  //         setCurrentSettings(0);
  //       }
  //       // setLatePayment(doc.data().latePayment);
  //     }
  //   }
  // }

  // getDbValues();
  // console.log("LLLLLLLL");

  const [currentSettings, setCurrentSettings] = useState(settings);

  const saveSettings = (values) => {
    setCurrentSettings(values);
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
