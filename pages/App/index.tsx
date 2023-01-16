import Router from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import Footer from "../../components/App/Footer";
import HelpPrompt from "../../components/App/HelpPrompt";
import Navbar from "../../components/App/Navbar";
import SocialMediaPrompt from "../../components/App/SocialMediaPrompt";
import Statistics from "../../components/App/Statistics";
import TradePrompt from "../../components/App/TradePrompt";
import { STYLES } from "../../storage/constants/StylingConstants";
import ItemsPNG from "../../storage/Rendered/PNG/ItemsPNG";
import TreasureChestDarkPNG from "../../storage/Rendered/PNG/TreasureChestDarkPNG";
import TreasurePNG from "../../storage/Rendered/PNG/TreasurePNG";
import { GetItems, GetUser } from "../../storage/utils/api/user.api";
import {
  ChangeTheme,
  CheckTheme,
} from "../../storage/utils/tools/LocalStorage";
import {
  GetAddress,
  WalletListener,
} from "../../storage/utils/tools/Web3Tools";
import { isDocked } from "../../storage/utils/tools/WindowMethods";

interface StylingObject {
  [key: string]: any;
}

const App = () => {
  const [Styling, setStyling] = useState<StylingObject>(STYLES[CheckTheme()]);
  const [userData, setUserData] = useState<any>({
    avatar: "https://ynnovate.it/wp-content/uploads/2015/04/default-avatar.png",
  });
  const [items, setItems] = useState<any>(null);

  const handleThemeChange = () => {
    ChangeTheme();
    setStyling(CheckTheme());
    window.location.reload();
  };

  useEffect(() => {
    if (isDocked()) {
      if (GetAddress() === null) {
        Router.push("http://app.localhost:3000/login");
      }
      WalletListener();
    }
  }, []);

  useLayoutEffect(() => {
    GetUser().then((res) => {
      setUserData(res.data);
    });
  }, []);
  return (
    <>
      <div
        className="flex items-center"
        style={{
          backgroundColor: `${Styling.main}`,
          width: "100vw",
          height: "2080px",
          flexDirection: "column",
          zIndex: "0",
        }}
      >
        <Navbar Styling={Styling} userData={userData} />
        <Statistics Styling={Styling} />
        <TradePrompt Styling={Styling} />
        <div
          className="flex"
          style={{
            marginLeft: "1000px",
            flexDirection: "column",
            gap: "100px",
            marginTop: "270px",
          }}
        >
          <SocialMediaPrompt Styling={Styling} />
          <HelpPrompt Styling={Styling} />
        </div>
        <Footer Styling={Styling} handleThemeChange={handleThemeChange} />
      </div>
      <div
        className="absolute"
        style={{ zIndex: "0", top: "0px", userSelect: "none" }}
      >
        <TreasureChestDarkPNG />
      </div>
    </>
  );
};

export default App;
