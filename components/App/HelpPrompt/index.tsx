const HelpPrompt = (props: any) => {
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
        Need help?
      </div>
      <div
        className="flex items-center justify-center"
        style={{
          background: props.Styling.btnGradient,
          width: "345px",
          height: "50px",
          color: "white",
          fontWeight: "600",
          borderRadius: "8px",
          marginTop: "35px",
          cursor: "pointer",
          boxShadow: props.Styling.basicShadow,
        }}
      >
        Read Documentation {">"}
      </div>
    </div>
  );
};

export default HelpPrompt;
