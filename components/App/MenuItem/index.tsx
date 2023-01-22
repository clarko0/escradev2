import ItemIcon from "../InventoryCard/ItemIcon";

const MenuItem = (props: any) => {
  return (
    <div
      className="flex items-center"
      style={{ height: "80px", userSelect: "none" }}
    >
      <div style={{ width: "80px", height: "80px" }}>
        <picture style={{ overflow: "hidden", inset: "0px" }}>
          <img
            src={props.image}
            alt="item"
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        </picture>
      </div>
      <div className="flex justify-center" style={{ flexDirection: "column" }}>
        <div style={{ fontSize: "10px", color: "#777E90" }}>
          {props.projectName}
        </div>
        <div style={{ color: "#D9D9D9", fontWeight: "600" }}>
          {props.name}#{props.id}
        </div>
        <div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 14 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.69944 3.83857L3.31548 3.03421L7.07992 0.833374L10.8554 3.03421L9.47144 3.83857L7.07992 2.45328L4.69944 3.83857ZM11.8408 5.22387V6.84379L13.2248 6.03943V4.41951L11.8408 3.60397L10.4568 4.40835L11.8408 5.22387ZM5.69592 4.41951L7.07992 5.22387L8.46392 4.41951L7.07992 3.60397L5.69592 4.41951ZM10.8554 5.80479L9.47144 5.00043L7.07992 6.38575L4.69944 5.00043L3.31548 5.80479V7.42471L5.69592 8.80999V11.5806L7.07992 12.3849L8.46392 11.5806V8.80999L10.8554 7.42471V5.80479ZM11.8408 10.7762L9.46039 12.1615V13.7814L13.2359 11.5806V7.19011L11.8408 8.00563V10.7762ZM9.46039 11.0108L10.8444 10.2065V8.57539L9.46039 9.37975V11.0108ZM5.69592 12.7425V14.3623L7.07992 15.1667L8.46392 14.3623V12.7425L7.07992 13.5468L5.69592 12.7425ZM0.92392 6.03943L2.30791 6.84379V5.22387L3.69192 4.41951L2.31898 3.60397L0.934992 4.40835V6.03943H0.92392ZM2.31898 8.00563L0.934992 7.20127V11.5918L4.71052 13.7926V12.1727L2.31898 10.7762V8.00563ZM4.69944 9.39095L3.31548 8.58659V10.2065L4.69944 11.0108V9.39095Z"
              fill="#fff"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
export default MenuItem;
