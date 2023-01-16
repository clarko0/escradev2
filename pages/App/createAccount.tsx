import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import { STYLES } from "../../storage/constants/StylingConstants";
import ShieldPNG from "../../storage/Rendered/PNG/ShieldPNG";
import AccountSVG from "../../storage/Rendered/SVG/AccountSVG";
import AddSVG from "../../storage/Rendered/SVG/AddSVG";
import MoonSVG from "../../storage/Rendered/SVG/MoonSVG";
import SunSVG from "../../storage/Rendered/SVG/SunSVG";
import Web3 from "web3";
import {
  ChangeTheme,
  CheckTheme,
} from "../../storage/utils/tools/LocalStorage";
import {
  GetAddress,
  WalletListener,
} from "../../storage/utils/tools/Web3Tools";
import { isDocked } from "../../storage/utils/tools/WindowMethods";
import { AccountCreation } from "../../storage/utils/tools/AuthTools";
import { convertImgToB64 } from "../../storage/utils/tools/MiscTools";

interface StylingObject {
  [key: string]: any;
}

const CreateAccount = () => {
  const [Styling, setStyling] = useState<StylingObject>(STYLES[CheckTheme()]);
  const [isDark, setIsDark] = useState<boolean>(CheckTheme() === "dark");
  const [picture, setPicture] = useState<any>(null);
  const [userName, setUserName] = useState<string>("");
  const [canPost, setCanPost] = useState<boolean>(false);

  const handleThemeChange = () => {
    ChangeTheme();
    setStyling(CheckTheme());
    window.location.reload();
  };

  useEffect(() => {
    if (isDocked()) {
      if (GetAddress() === null) {
        Router.push("http://app.localhost:3000/login");
        window.location.reload();
      }
      WalletListener();
    }
  }, []);

  const handleFocus = (event: any) => {
    event.target.style.outline = "none";
  };

  const handleChange = (event: any) => {
    const file = event.target.files[0];
    setPicture(file);
  };

  const fileInputRef: any = useRef();

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleUsername = (event: any) => {
    setUserName(event.target.value);
  };

  return (
    <>
      <div
        style={{
          background: Styling.main,
          width: "100%",
          height: "100vh",
          color: Styling.secondaryFont,
          zIndex: "2",
        }}
      >
        <div
          className="flex fixed items-center"
          style={{ marginTop: "100px", marginLeft: "75px", zIndex: "10" }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: Styling.secondaryFont,
              userSelect: "none",
              marginLeft: "100px",
              zIndex: "2",
            }}
          >
            It looks like you're new
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
          className="flex items-center justify-center"
          style={{
            height: "100%",
            userSelect: "none",
            flexDirection: "column",
            gap: "60px",
            zIndex: "2",
          }}
        >
          <div
            className="flex items-center"
            style={{
              border: `1px solid #787EFF`,
              width: "250px",
              flexDirection: "column",
              height: "75px",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                background: Styling.main,
                width: "110px",
                marginTop: "-12px",
                textAlign: "center",
                color: "#777E90",
                fontWeight: "600",
              }}
            >
              USERNAME
            </div>
            <input
              type="text"
              placeholder="Choose a username"
              onFocus={handleFocus}
              style={{
                background: "transparent",
                color: Styling.secondaryFont,
                textAlign: "center",
                height: "100%",
                zIndex: "2",
                marginTop: "-10px",
              }}
              onChange={(event) => {
                if (event.target.value.length >= 5) {
                  setCanPost(true);
                } else {
                  setCanPost(false);
                }
                handleUsername(event);
              }}
            />
          </div>
          <div
            className="flex items-center justify-center"
            style={{
              width: "125px",
              height: "125px",
              borderRadius: "800px",
              border: "1px solid #787EFF",
              flexDirection: "column",
              cursor: "pointer",
            }}
            onClick={() => {
              handleClick();
            }}
          >
            <div
              style={{
                background: Styling.main,
                width: "110px",
                marginTop: "-12px",
                textAlign: "center",
                color: "#777E90",
                fontWeight: "600",
                zIndex: "0",
              }}
            >
              AVATAR
            </div>
            <div style={{ zIndex: "2", cursor: "pointer" }}>
              {picture === null ? (
                <AccountSVG isDark={isDark} />
              ) : (
                <img
                  src={URL.createObjectURL(picture)}
                  style={{
                    borderRadius: "600px",
                    width: "125px",
                  }}
                />
              )}
            </div>
            <div
              style={{ marginBottom: "-12px", zIndex: "2", cursor: "pointer" }}
            >
              <AddSVG Styling={Styling} />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleChange}
              style={{ display: "none" }}
            />
          </div>
          <div
            className="flex items-center justify-center"
            style={{
              cursor: canPost ? "pointer" : "default",
              width: "250px",
              background: canPost ? Styling.btnGradient : "grey",
              fontWeight: "600",
              height: "50px",
              color: "white",
              borderRadius: "6px",
            }}
            onClick={async () => {
              if (canPost) {
                await AccountCreation({
                  username: userName,
                  image: picture,
                });
                await Router.push("http://app.localhost:3000");
                window.location.reload();
              }
            }}
          >
            Create Account
          </div>
        </div>
      </div>
      <div
        className="absolute"
        style={{ zIndex: "0", bottom: "0px", userSelect: "none" }}
      >
        <ShieldPNG />
      </div>
    </>
  );
};

export default CreateAccount;
