import { useEffect, useState } from "react";
import { STYLES } from "../../storage/constants/StylingConstants";
import ItemsPNG from "../../storage/Rendered/PNG/ItemsPNG";
import TreasurePNG from "../../storage/Rendered/PNG/TreasurePNG";
import MetaMaskLoadingSVG from "../../storage/Rendered/SVG/MetaMaskLoadingSVG";
import MetamaskSVG from "../../storage/Rendered/SVG/MetamaskSVG";
import MoonSVG from "../../storage/Rendered/SVG/MoonSVG";
import SunSVG from "../../storage/Rendered/SVG/SunSVG";
import WalletConnectSVG from "../../storage/Rendered/SVG/WalletConnectSVG";
import {
  ChangeTheme,
  CheckTheme,
} from "../../storage/utils/tools/LocalStorage";
import {
  GetAddress,
  MetaMaskConnect,
} from "../../storage/utils/tools/Web3Tools";
import Router from "next/router";
import { isDocked } from "../../storage/utils/tools/WindowMethods";
import { GetUser } from "../../storage/utils/api/user.api";

interface StylingObject {
  [key: string]: any;
}

const Login = () => {
  const [Styling, setStyling] = useState<StylingObject>(STYLES[CheckTheme()]);
  const [isDark, setIsDark] = useState<boolean>(CheckTheme() === "dark");
  const [connecting, setIsConnecting] = useState<boolean>(false);

  const handleThemeChange = () => {
    ChangeTheme();
    setStyling(CheckTheme());
    window.location.reload();
  };

  useEffect(() => {
    if (isDocked()) {
      if (GetAddress() !== null) {
        Router.push("http://app.localhost:3000");
        window.location.reload();
      }
    }
  }, []);

  return (
    <div style={{ background: Styling.main, height: "100vh", margin: "0" }}>
      <div
        className="flex items-center fixed"
        style={{ marginTop: "100px", marginLeft: "75px", zIndex: "10" }}
      >
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: Styling.fontMain,
            userSelect: "none",
            marginLeft: "100px",
          }}
        >
          Login With
        </div>
        <div
          className="flex fixed items-center justify-center"
          style={{
            border: `1px solid ${Styling.accent}`,
            borderRadius: "999px",
            height: "45px",
            right: "150px",
            width: "125px",
            cursor: "pointer",
            zIndex: "10",
          }}
          onClick={() => {
            handleThemeChange();
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: "50px",
              height: "30px",
              borderRadius: "900px",
              background: !isDark ? Styling.accent : "",
            }}
          >
            <SunSVG />
          </div>
          <div
            className="flex items-center justify-center"
            style={{
              width: "50px",
              height: "30px",
              borderRadius: "900px",
              background: isDark ? Styling.accent : "",
            }}
          >
            <MoonSVG />
          </div>
        </div>
      </div>
      <div
        className="flex fixed items-center justify-center"
        style={{
          flexDirection: "column",
          width: "100vw",
          height: "100vh",
          userSelect: "none",
          gap: "10px",
          zIndex: "1",
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            color: "#FFA500",
            border: "1px solid #FFA500",
            borderRadius: "9px",
            width: "300px",
            fontSize: "24px",
            fontWeight: "600",
            height: "80px",
            cursor: "pointer",
            gap: "20px",
          }}
          onClick={async () => {
            try {
              await setIsConnecting(true);
              await MetaMaskConnect();
              if ((await (await GetUser()).data.status) === undefined) {
                await Router.push("http://app.localhost:3000");
                await window.location.reload();
              } else {
                await Router.push(
                  "http://app.localhost:3000/login/create-account"
                );
              }
            } catch (e) {
              setIsConnecting(false);
            }
          }}
        >
          {!connecting && (
            <>
              <div>
                <MetamaskSVG />
              </div>
              <div>MetaMask</div>
            </>
          )}
          {connecting && (
            <>
              <MetaMaskLoadingSVG />
            </>
          )}
        </div>
        <div
          style={{
            fontSize: "60px",
            color: Styling.fontMain,
            fontWeight: "700",
          }}
        >
          or
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            color: "#3B99FC",
            border: "1px solid #3B99FC",
            borderRadius: "9px",
            width: "300px",
            fontSize: "24px",
            fontWeight: "600",
            height: "80px",
            cursor: "pointer",
            gap: "20px",
          }}
        >
          <div>
            <WalletConnectSVG />
          </div>
          <div style={{}}>WalletConnect</div>
        </div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: Styling.fontMain,
          }}
        >
          By continuing, you agree to our{" "}
          <span
            style={{
              color: "#3B99FC",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Terms of Use
          </span>
        </div>
      </div>
      <div
        className="absolute"
        style={{ bottom: "0px", left: "0px", zIndex: "0" }}
      >
        <TreasurePNG />
      </div>
      <div
        className="absolute"
        style={{ bottom: "0px", right: "0px", zIndex: "0" }}
      >
        <ItemsPNG />
      </div>
    </div>
  );
};

export default Login;
