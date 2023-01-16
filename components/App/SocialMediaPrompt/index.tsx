import DiscordSVG from "../../../storage/Rendered/SVG/DiscordSVG";
import MediumSVG from "../../../storage/Rendered/SVG/MediumSVG";
import TelegramSVG from "../../../storage/Rendered/SVG/TelegramSVG";
import TwitterSVG from "../../../storage/Rendered/SVG/TwitterSVG";

const SocialMediaPrompt = (props: any) => {
  return (
    <div
      className="flex items-center"
      style={{
        width: "490px",
        height: "210px",
        flexDirection: "column",
        backgroundColor: props.Styling.infoBox,
        zIndex: "10",
        borderRadius: "9px",
        border: `1px solid ${props.Styling.accent}`,
        boxShadow: props.Styling.basicShadow,
      }}
    >
      <div
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          marginTop: "25px",
          color: "#fff",
          userSelect: "none",
        }}
      >
        Connect with us
      </div>
      <div className="flex" style={{ gap: "30px", marginTop: "35px" }}>
        <div style={{ cursor: "pointer" }}>
          <TwitterSVG />
        </div>
        <div style={{ cursor: "pointer" }}>
          <TelegramSVG />
        </div>
        <div style={{ cursor: "pointer" }}>
          <DiscordSVG />
        </div>
        <div style={{ cursor: "pointer" }}>
          <MediumSVG />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPrompt;
