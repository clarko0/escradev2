const Statistics = (props: any) => {
  return (
    <div
      className="flex"
      style={{
        width: "60%",
        border: `1px solid ${props.Styling.borderMain}`,
        height: "120px",
        marginTop: "300px",
        borderRadius: "9px",
        boxShadow: props.Styling.basicShadow,
        color: props.Styling.fontMain,
        userSelect: "none",
        zIndex: "1",
      }}
    >
      <div
        className="flex items-center"
        style={{ width: "33.33%", flexDirection: "column" }}
      >
        <div
          style={{
            fontSize: "40px",
            fontWeight: "700",
            marginTop: "15px",
            color: props.Styling.logo,
          }}
        >
          0
        </div>
        <div style={{ fontSize: "16px", fontWeight: "500", marginTop: "-5px" }}>
          Trades Completed
        </div>
      </div>
      <div
        className="flex items-center"
        style={{ width: "33.33%", flexDirection: "column" }}
      >
        <div
          style={{
            fontSize: "40px",
            fontWeight: "700",
            marginTop: "15px",
            color: props.Styling.logo,
          }}
        >
          0
        </div>
        <div style={{ fontSize: "16px", fontWeight: "500", marginTop: "-5px" }}>
          Items Traded
        </div>
      </div>
      <div
        className="flex items-center"
        style={{ width: "33.33%", flexDirection: "column" }}
      >
        <div
          style={{
            fontSize: "40px",
            fontWeight: "700",
            marginTop: "15px",
            color: props.Styling.logo,
          }}
        >
          0
        </div>
        <div style={{ fontSize: "16px", fontWeight: "500", marginTop: "-5px" }}>
          Trades Pending
        </div>
      </div>
    </div>
  );
};

export default Statistics;
