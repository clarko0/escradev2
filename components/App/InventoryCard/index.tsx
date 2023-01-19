import { useEffect, useState } from "react";
import LightItems from "../../../public/light-default_item.png";
import ItemIcon from "./ItemIcon";

const InventoryCard = (props: any) => {
  const [projectInfo, setProjectInfo] = useState<any>("");
  const [icons, setIcons] = useState<any>([]);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [verifiedHovered, setVerifiedHovered] = useState<boolean>(false);

  useEffect(() => {
    const temp = [];
    try {
      setProjectInfo(props.verifed.project_name);
    } catch (e) {
      setProjectInfo(props.projectName);
    }
    temp.push(<ItemIcon type={props.chainId} />);
    temp.push(<ItemIcon type={props.type} />);
    setIcons(temp);
  }, []);
  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={(event) => {}}
      style={{
        userSelect: "none",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          transition: "0.1s ease-in-out",
          background: props.Styling.itemGradient,
          opacity: props.isSelected ? "0.5" : "1",
          border: props.isSelected ? "3px solid orange" : "0px solid orange",
          width: "250px",
          height: "250px",
          borderRadius: "16px",
          filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
          overflow: "hidden",
        }}
      >
        <picture
          className="flex items-center justify-center"
          style={{
            transition: "0.5s",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            transform: isHovered ? "scale(1.2)" : "scale(1.01)",
          }}
        >
          <img
            src={props.image ? props.image : LightItems.src}
            style={{
              transition: "0.5s",
              width: "100%",
              height: "100%",
              borderStyle: "none",
              display: "block",
              objectFit: "contain",
              filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
            }}
          />
        </picture>
      </div>
      <div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#777E90",
            marginTop: "10px",
          }}
        >
          <div className="flex items-center" style={{ gap: "5px" }}>
            {projectInfo}
            {props.isVerifed && (
              <div
                className="flex items-center justify-center"
                onMouseEnter={() => {
                  setVerifiedHovered(true);
                }}
                onMouseLeave={() => {
                  setVerifiedHovered(false);
                }}
              >
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  focusable="false"
                >
                  <path
                    d="M22 12.469c0 .699-.168 1.347-.504 1.941a3.594 3.594 0 01-1.351 1.383c.015.105.023.27.023.492 0 1.059-.355 1.957-1.059 2.7-.707.745-1.558 1.117-2.554 1.117-.446 0-.871-.082-1.274-.247a3.873 3.873 0 01-1.351 1.551A3.358 3.358 0 0112 22a3.39 3.39 0 01-1.941-.582 3.787 3.787 0 01-1.34-1.563 3.332 3.332 0 01-1.274.247c-.996 0-1.851-.372-2.566-1.118-.715-.742-1.07-1.644-1.07-2.699 0-.117.015-.281.043-.492A3.622 3.622 0 012.5 14.41 3.917 3.917 0 012 12.47c0-.742.188-1.426.559-2.043a3.443 3.443 0 011.496-1.371 3.863 3.863 0 01-.246-1.34c0-1.055.355-1.957 1.07-2.7.715-.742 1.57-1.117 2.566-1.117.446 0 .871.082 1.274.247a3.874 3.874 0 011.351-1.551A3.388 3.388 0 0112 2c.7 0 1.344.2 1.93.59.586.394 1.039.91 1.351 1.55a3.331 3.331 0 011.274-.245c.996 0 1.847.37 2.554 1.117.707.746 1.059 1.644 1.059 2.699 0 .492-.074.937-.223 1.34a3.443 3.443 0 011.496 1.37c.372.622.559 1.306.559 2.048zM11.574 15.48l4.13-6.183a.717.717 0 00.1-.535.654.654 0 00-.3-.446.76.76 0 00-.535-.113.685.685 0 00-.469.29l-3.637 5.468-1.675-1.672a.665.665 0 00-.512-.21.79.79 0 00-.512.21c-.133.133-.2.3-.2.504 0 .2.067.367.2.504l2.3 2.3.114.09c.133.09.27.133.402.133a.655.655 0 00.594-.34z"
                    fill="rgb(55, 114, 255)"
                  ></path>
                </svg>
                <div
                  className="flex items-center justify-center absolute"
                  style={{
                    transition: "0.5s",
                    background: "#353945",
                    color: "#fff",
                    opacity: verifiedHovered ? "1" : "0",
                    fontWeight: "500",
                    height: verifiedHovered ? "35px" : "0px",
                    marginTop: "-60px",
                    width: verifiedHovered ? "250px" : "0px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                    zIndex: "10",
                  }}
                  onMouseEnter={() => {
                    setVerifiedHovered(false);
                  }}
                  onMouseLeave={() => {
                    setVerifiedHovered(true);
                  }}
                >
                  This project is verified by Escrade.
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: props.Styling.secondaryFont,
            marginTop: "2px",
          }}
        >
          {props.name ? props.name : "#" + props.id}
        </div>
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "#777E90",
            marginTop: "7px",
          }}
        ></div>
        <div
          className="flex"
          style={{ marginTop: "7px", marginLeft: "3px", gap: "10px" }}
        >
          {icons}
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
