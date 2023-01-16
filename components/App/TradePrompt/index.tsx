const TradePrompt = (props: any) => {
  return (
    <div
      className="flex items-center"
      style={{
        marginTop: "175px",
        flexDirection: "column",
        gap: "30px",
        zIndex: "1",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          color: props.Styling.logo,
          fontWeight: "600",
          userSelect: "none",
        }}
      >
        Ready to trade with somebody?
      </div>
      <div
        className="flex items-center justify-center"
        style={{
          width: "175px",
          height: "55px",
          background: props.Styling.accent,
          borderRadius: "3px",
          boxShadow: props.Styling.basicShadow,
          userSelect: "none",
          cursor: "pointer",
        }}
      >
        <div style={{ color: "white", fontWeight: "600" }}>Create Trade</div>
      </div>
    </div>
  );
};

export default TradePrompt;
