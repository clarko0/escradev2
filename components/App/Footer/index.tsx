import { useState } from "react";
import MoonSVG from "../../../storage/Rendered/SVG/MoonSVG";
import SunSVG from "../../../storage/Rendered/SVG/SunSVG";
import {
  ChangeTheme,
  CheckTheme,
} from "../../../storage/utils/tools/LocalStorage";

const Footer = (props: any) => {
  const [isDark, setIsDark] = useState<boolean>(CheckTheme() === "dark");
  return (
    <div
      className="flex justify-center"
      style={{
        zIndex: "10",
        gap: "30%",
        marginTop: "325px",
        height: "250px",
        width: "100%",
        background: props.Styling.main,
        userSelect: "none",
        borderTop: `1px solid ${props.Styling.borderMain}`,
      }}
    >
      <div style={{ marginTop: "40px" }}>
        <div
          style={{
            color: props.Styling.fontMain,
            fontWeight: "600",
            fontSize: "24px",
          }}
        >
          ABOUT
        </div>
        <div style={{ color: props.Styling.grey, fontWeight: "600" }}>
          <div style={{ cursor: "pointer" }}>Contact</div>
          <div style={{ cursor: "pointer" }}>Community</div>
        </div>
      </div>
      <div style={{ marginTop: "40px" }}>
        <div
          style={{
            color: props.Styling.fontMain,
            fontWeight: "600",
            fontSize: "24px",
          }}
        >
          HELP
        </div>
        <div style={{ color: props.Styling.grey, fontWeight: "600" }}>
          <div style={{ cursor: "pointer" }}>Documentation</div>
          <div style={{ cursor: "pointer" }}>FAQ</div>
        </div>
      </div>
      <div style={{ marginTop: "40px" }}>
        <div
          style={{
            fontSize: "30px",
            fontWeight: "700",
            color: props.Styling.logo,
            textShadow: props.Styling.textGlow,
          }}
        >
          Escrade
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            border: `1px solid ${props.Styling.accent}`,
            borderRadius: "999px",
            height: "45px",
            marginTop: "20px",
            cursor: "pointer",
          }}
          onClick={() => {
            props.handleThemeChange();
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: "50px",
              height: "30px",
              borderRadius: "900px",
              background: !isDark ? props.Styling.accent : "",
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
              background: isDark ? props.Styling.accent : "",
            }}
          >
            <MoonSVG />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
