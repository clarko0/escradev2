import Router from "next/router";
import { useEffect, useState } from "react";
import ChevronSVG from "../../../storage/Rendered/SVG/ChevronSVG";
import { genRanHex } from "../../../storage/utils/tools/MiscTools";
import {
  AbreviateAddress,
  GetAddress,
} from "../../../storage/utils/tools/Web3Tools";

interface NavLeftItem {
  id: string;
  key: string;
  label: string;
  hovered: boolean;
  menuItems: string[];
}

const NavbarInventory = (props: any) => {
  const [navItems, setNavItems] = useState<NavLeftItem[]>([
    {
      id: "item-1",
      key: "item-1",
      label: "Resources",
      hovered: false,
      menuItems: [
        "Help Center",
        "Tutorial",
        "Documentation",
        "FAQ",
        "Verified Projects",
      ],
    },
    {
      id: "item-2",
      key: "item-2",
      label: "Apply",
      hovered: false,
      menuItems: [
        "Apply for Project Verification",
        "Apply for Platform Verification",
      ],
    },
    {
      id: "item-3",
      key: "item-3",
      label: "Products",
      hovered: false,
      menuItems: ["Peer to Peer Trading"],
    },
  ]);

  useEffect(() => {
    const handleMouseEnter = (id: string) => {
      setNavItems((prevNavItems) =>
        prevNavItems.map((item) => {
          if (item.id === id) {
            return { ...item, hovered: true };
          }
          return item;
        })
      );
    };

    const handleMouseLeave = (id: string) => {
      setNavItems((prevNavItems) =>
        prevNavItems.map((item) => {
          if (item.id === id) {
            return { ...item, hovered: false };
          }
          return item;
        })
      );
    };

    navItems.forEach((item) => {
      const elementRef = document.getElementById(item.id);
      elementRef.addEventListener("mouseenter", () =>
        handleMouseEnter(item.id)
      );
      elementRef.addEventListener("mouseleave", () =>
        handleMouseLeave(item.id)
      );
    });

    return () => {
      navItems.forEach((item) => {
        const elementRef = document.getElementById(item.id);
        elementRef.removeEventListener("mouseenter", () =>
          handleMouseEnter(item.id)
        );
        elementRef.removeEventListener("mouseleave", () =>
          handleMouseLeave(item.id)
        );
      });
    };
  }, [navItems]);
  return (
    <div
      className="fixed flex items-center"
      style={{
        color: props.Styling.fontMain,
        fontSize: "24px",
        fontWeight: "600",
        height: "150px",
        zIndex: "9999",
        width: "100%",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="fixed"
        style={{
          fontSize: "50px",
          transform: "translate(-50%, 0%)",
          left: "50%",
          fontWeight: "bold",
          textShadow: props.Styling.textGlow,
          userSelect: "none",
          cursor: "pointer",
          color: props.Styling.logo,
        }}
        onClick={() => {
          Router.push("http://app.localhost:3000");
          window.location.reload();
        }}
      >
        Escrade
      </div>
      <div className="flex fixed" style={{ left: "10%", gap: "30px" }}>
        {navItems.map((item) => (
          <div className="flex items-center" style={{ gap: "5px" }}>
            <div
              id={item.id}
              key={item.id}
              style={{
                userSelect: "none",
                transition: "0.1s",
                cursor: "default",
                fontWeight: item.hovered ? "700" : "600",
              }}
            >
              {item.label}
              {item.hovered && (
                <div
                  className="fixed flex"
                  style={{
                    background: props.Styling.menuColour,
                    borderRadius: "10px",
                    padding: "30px",
                    flexDirection: "column",
                    gap: "20px",
                    fontSize: "16px",
                    boxShadow: props.Styling.basicShadow,
                  }}
                >
                  {item.menuItems.map((thing) => (
                    <div
                      style={{
                        color: props.Styling.menuFont,
                        cursor: "pointer",
                      }}
                      key={genRanHex(16)}
                    >
                      {thing}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              style={{
                transform: item.hovered ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.5s",
              }}
            >
              <ChevronSVG />
            </div>
          </div>
        ))}
      </div>
      <div className="flex fixed" style={{ right: "10%", gap: "30px" }}>
        <div style={{ cursor: "pointer", userSelect: "none" }}>
          Pending Trades
        </div>
        <div
          style={{
            userSelect: "none",
            textShadow: props.Styling.textGlow,
            color: props.Styling.secondaryFont,
          }}
        >
          Inventory
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            userSelect: "none",
            border: `1px solid ${props.Styling.accent}`,
            fontSize: "16px",
            fontWeight: "500",
            color: props.Styling.fontMain,
            borderRadius: "3px",
            width: "150px",
            gap: "10px",
            height: "40px",
          }}
        >
          <img
            src={props.userData.avatar}
            style={{
              width: "30px",
              borderRadius: "600px",
              marginLeft: "-5px",
            }}
          />
          {AbreviateAddress()}
        </div>
      </div>
    </div>
  );
};

export default NavbarInventory;
