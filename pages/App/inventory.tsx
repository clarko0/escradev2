import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import Footer from "../../components/App/Footer";
import InventoryCard from "../../components/App/InventoryCard";
import Navbar from "../../components/App/Navbar";
import NavbarInventory from "../../components/App/NavbarInventory";
import { STYLES } from "../../storage/constants/StylingConstants";
import ChevronSVG from "../../storage/Rendered/SVG/ChevronSVG";
import SearchSVG from "../../storage/Rendered/SVG/SearchSVG";
import { GetItems, GetUser } from "../../storage/utils/api/user.api";
import { delay, genRanHex } from "../../storage/utils/tools/MiscTools";
import {
  ChangeTheme,
  CheckTheme,
} from "../../storage/utils/tools/LocalStorage";
import { GetAddress } from "../../storage/utils/tools/Web3Tools";
import MenuItem from "../../components/App/MenuItem";

interface StylingObject {
  [key: string]: any;
}

interface FilterOptions {
  type: string;
  platform: string;
}

const Inventory = (props: any) => {
  const [Styling, setStyling] = useState<StylingObject>(STYLES[CheckTheme()]);
  const [userData, setUserData] = useState<any>({
    avatar: "https://ynnovate.it/wp-content/uploads/2015/04/default-avatar.png",
  });
  const [items, setItems] = useState<any>(null);
  const [currentPlatformFilter, setCurrentPlatformFilter] =
    useState<string>("All Platforms");
  const [currentGearFilter, setCurrentGearFilter] =
    useState<string>("All Types");
  const [isPlatformFilter, setIsPlatformFilter] = useState<boolean>(false);
  const [isGearFilter, setIsGearFilter] = useState<boolean>(false);
  const [itemData, setItemData] = useState<any[]>([]);
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const [isSendMenu, setIsSendMenu] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<FilterOptions>({
    type: "",
    platform: "",
  });
  const ethAddressPattern = /^0x[0-9a-fA-F]{40}$/;
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [verified, setVerified] = useState<boolean>(false);
  const [createMenuHovered, setCreateMenuHovered] = useState<boolean>(false);
  const [inSelectMode, setInSelectMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [sendAddress, setSendAddress] = useState<string>("");
  const [addressWarning, setAddressWarning] = useState<boolean>(false);
  const [canSend, setCanSend] = useState<boolean>(false);

  const handleThemeChange = () => {
    ChangeTheme();
    setStyling(CheckTheme());
    window.location.reload();
  };
  const handleFocus = (event: any) => {
    event.target.style.outline = "none";
  };

  const handleAddressInput = (event: any) => {
    if (event.target.value.length === 0) {
      setAddressWarning(false);
      setCanSend(false);
      return;
    }
    if (ethAddressPattern.test(event.target.value)) {
      setSendAddress(event.target.value);
      setAddressWarning(false);
      setCanSend(true);
    } else {
      setAddressWarning(true);
      setCanSend(false);
    }
  };

  const handleSelect = (event: any, data: any) => {
    if (!inSelectMode) {
      return;
    }
    const newItemData = itemData.map((item) => {
      if (item.object_id === data.object_id) {
        return {
          ...item,
          is_selected: !item.is_selected,
        };
      }
      return item;
    });
    setItemData(newItemData);
    let newSelectedData;
    if (data.is_selected) {
      newSelectedData = selectedItems.filter((item) => {
        if (item.object_id === data.object_id) {
          return false;
        }
        return true;
      });
    } else {
      data.is_selected = true;
      newSelectedData = [...selectedItems, data];
    }
    setSelectedItems(newSelectedData);
  };

  useEffect(() => {
    const temp: any[] = [];
    selectedItems.forEach((element) => {
      temp.push(
        <MenuItem
          objectId={element.object_id}
          id={element.id}
          contractAddress={element.contract_address}
          chainId={element.chain_id}
          image={element.image}
          name={element.name}
          isVerifed={element.is_verified}
          Styling={Styling}
          projectName={element.project_name}
          type={element.type}
        />
      );
    });
    setMenuItems(temp);
  }, [selectedItems]);

  const handleSearch = () => {
    const response = itemData.filter((item) => {
      if (!verified || item.is_verified) {
        if (
          currentSearch.length === 0 &&
          currentFilter.type.length === 0 &&
          currentFilter.platform.length === 0
        ) {
          return true;
        }
        if (
          currentSearch === "" ||
          (item.id && item.id.toString().includes(currentSearch)) ||
          (item.name &&
            item.name.toString().toLowerCase().includes(currentSearch)) ||
          (item.project_name &&
            item.project_name.toString().toLowerCase().includes(currentSearch))
        ) {
          if (
            currentFilter.type === "" ||
            (item.type &&
              item.type.toString().toLowerCase().includes(currentFilter.type))
          ) {
            if (
              currentFilter.platform === "" ||
              (item.chain_id &&
                item.chain_id
                  .toString()
                  .toLowerCase()
                  .includes(currentFilter.platform))
            ) {
              return true;
            }
          }
        }
      }
      return false;
    });
    const elements: any[] = [];
    response.forEach((element) => {
      elements.push(
        <InventoryCard
          objectId={element.object_id}
          id={element.id}
          contractAddress={element.contract_address}
          chainId={element.chain_id}
          image={element.image}
          name={element.name}
          isVerifed={element.is_verified}
          Styling={Styling}
          projectName={element.project_name}
          type={element.type}
          isSelected={element.is_selected}
          handleSelect={handleSelect}
        />
      );
    });
    setItems(elements);
  };

  useEffect(() => {
    const cardElements: any = [];
    if (itemData.length > 0) {
      itemData.forEach((element) => {
        cardElements.push(
          <InventoryCard
            objectId={element.object_id}
            id={element.id}
            contractAddress={element.contract_address}
            chainId={element.chain_id}
            image={element.image}
            name={element.name}
            isVerifed={element.is_verified}
            Styling={Styling}
            projectName={element.project_name}
            type={element.type}
            isSelected={element.is_selected}
            handleSelect={handleSelect}
          />
        );
      });
      setItems(cardElements);
    }
  }, [itemData, inSelectMode]);

  useEffect(() => {
    handleSearch();
  }, [currentSearch, currentFilter, verified, selectedItems]);

  useEffect(() => {
    const cardElements: any[] = [];
    const dataArray: any[] = [];

    const getProjectName = (id: any, element: any) => {
      try {
        return id.verifed_project.project_name;
      } catch (e) {
        return element.project_name;
      }
    };

    const getIsVerified = (id: any) => {
      try {
        let test: string = id.verifed_project.project_name;
        if (test !== undefined) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    };

    const getType = (id: any) => {
      try {
        let test: string = id.verifed_project.type;
        return test;
      } catch (e) {
        return "";
      }
    };

    GetItems(GetAddress()).then((res) => {
      const data = res.data.data;
      data.forEach((element) => {
        element.ids.forEach((id) => {
          dataArray.push({
            object_id: genRanHex(32),
            id: id.id,
            contract_address: element.contract_address,
            chain_id: element.chain_id,
            image: id.image,
            name: id.name,
            is_verified: getIsVerified(id),
            project_name: getProjectName(id, element),
            type: getType(id),
            is_selected: false,
          });
        });
      });
      setItemData(dataArray);
    });
  }, []);

  useLayoutEffect(() => {
    GetUser().then((res) => {
      setUserData(res.data);
    });
  }, []);

  return (
    <div
      className="flex items-center"
      style={{
        background: Styling.main,
        height: "100%",
        margin: "0",
        flexDirection: "column",
      }}
    >
      <NavbarInventory Styling={Styling} userData={userData} />
      <div
        style={{
          fontWeight: "bold",
          color: Styling.secondaryFont,
          marginTop: "250px",
          fontSize: "60px",
          userSelect: "none",
        }}
      >
        {inSelectMode ? "Please select items" : "Your Inventory"}
      </div>
      <div
        className="absolute flex"
        style={{ top: "300px", gap: "20px", left: "1325px" }}
      >
        {inSelectMode && (
          <div
            className="flex items-center justify-center"
            style={{
              background:
                selectedItems.length > 0 ? Styling.btnGradient : "grey",
              color: "white",
              cursor: selectedItems.length > 0 ? "pointer" : "not-allowed",
              borderRadius: "10px",
              width: "150px",
              height: "30px",
              boxShadow: Styling.basicShadow,
              fontWeight: "600",
              gap: "4px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 14V17"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 14V17"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 10V21"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 10V21"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3 21H21"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M3 10H21"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M19 7.00011L12 3"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 7.00011L12 3"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Create Trade
          </div>
        )}
        {inSelectMode && (
          <div
            className="flex items-center justify-center"
            onClick={() => {
              setIsSendMenu(true);
            }}
            style={{
              background:
                selectedItems.length > 0 ? Styling.btnGradient : "grey",
              color: "white",
              cursor: selectedItems.length > 0 ? "pointer" : "not-allowed",
              borderRadius: "10px",
              width: "150px",
              height: "30px",
              boxShadow: Styling.basicShadow,
              fontWeight: "600",
              gap: "4px",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              focusable="false"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 4c-1.952 0-3.752.161-5.196.352a2.811 2.811 0 00-2.452 2.452A40.093 40.093 0 004 12c0 1.952.161 3.752.352 5.196a2.811 2.811 0 002.452 2.452C8.248 19.84 10.048 20 12 20c1.952 0 3.752-.161 5.196-.352a2.81 2.81 0 002.452-2.452C19.84 15.752 20 13.952 20 12c0-1.952-.161-3.752-.352-5.196a2.811 2.811 0 00-2.452-2.452A40.094 40.094 0 0012 4zM6.542 2.369a4.81 4.81 0 00-4.173 4.173C2.169 8.052 2 9.942 2 12c0 2.059.17 3.948.369 5.458a4.81 4.81 0 004.173 4.173c1.51.2 3.4.369 5.458.369 2.059 0 3.948-.17 5.458-.369a4.81 4.81 0 004.173-4.173c.2-1.51.369-3.4.369-5.458 0-2.059-.17-3.948-.369-5.458a4.81 4.81 0 00-4.173-4.173C15.948 2.169 14.058 2 12 2c-2.059 0-3.948.17-5.458.369z"
                fill="white"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.793 7.793a1 1 0 000 1.414L12.586 12l-2.793 2.793a1 1 0 101.414 1.414l3.5-3.5a1 1 0 000-1.414l-3.5-3.5a1 1 0 00-1.414 0z"
                fill="white"
              ></path>
            </svg>
            Send
          </div>
        )}
        {inSelectMode && (
          <div
            className="absolute flex items-center justify-center"
            style={{
              userSelect: "none",
              cursor: "pointer",
              top: "-70px",
              left: "280px",
              width: "40px",
              height: "40px",
              border: "3px solid red",
              borderRadius: "999px",
              color: "red",
              fontWeight: "800",
            }}
            onClick={() => {
              const newItemData = itemData;
              selectedItems.forEach((Element) => {
                newItemData.forEach((item) => {
                  if (Element.object_id === item.object_id) {
                    item.is_selected = !item.is_selected;
                  }
                });
              });
              setSelectedItems([]);
              setItemData(newItemData);
              setInSelectMode(false);
            }}
          >
            <div>X</div>
          </div>
        )}
      </div>
      {!inSelectMode && (
        <div
          className="fixed flex items-center justify-center"
          style={{
            top: "80%",
            left: "90%",
            background: Styling.btnGradient,
            width: "100px",
            height: "100px",
            cursor: "pointer",
            userSelect: "none",
            borderRadius: "999px",
            boxShadow: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 1))",
          }}
          onClick={() => {
            window.scroll({
              top: 0,
              left: 0,
              behavior: "smooth",
            });
            setInSelectMode(true);
            setCreateMenuHovered(false);
          }}
          onMouseEnter={() => {
            setCreateMenuHovered(true);
          }}
          onMouseLeave={() => {
            setCreateMenuHovered(false);
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4V20M4 12H20"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div
            className="fixed flex items-center justify-center"
            style={{
              transition: "0.5s",
              background: "#353945",
              color: "#fff",
              opacity: createMenuHovered ? "1" : "0",
              fontWeight: "500",
              height: createMenuHovered ? "35px" : "0px",
              marginTop: "-120px",
              width: createMenuHovered ? "250px" : "0px",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              zIndex: "20",
            }}
          >
            Create Trade/Transfer Items
          </div>
        </div>
      )}
      <div
        className="flex items-center"
        style={{ gap: "100px", marginTop: "50px" }}
      >
        <div
          className="flex items-center"
          style={{
            width: "400px",
            height: "40px",
            color: "#353945",
            borderBottom: "2px solid grey",
          }}
        >
          <div>
            <SearchSVG />
          </div>
          <input
            type="text"
            placeholder="Lookup Collection / Item..."
            style={{
              background: "transparent",
              fontWeight: "600",
              marginTop: "-7px",
              marginLeft: "10px",
            }}
            onFocus={(event) => {
              event.target.style.outline = "none";
            }}
            onChange={(event) => {
              const search = event.target.value.toLowerCase();
              setCurrentSearch(search);
            }}
          />
        </div>
        <div
          className="flex"
          style={{ flexDirection: "column", userSelect: "none" }}
        >
          <div
            style={{
              color: "#777E90",
              fontWeight: "600",
              fontSize: "12px",
              marginBottom: "5px",
            }}
          >
            PLATFORM
          </div>
          <div>
            <div
              className="flex items-center"
              style={{
                color: Styling.secondaryFont,
                fontWeight: "600",
                border: "1px solid #777E90",
                width: "180px",
                height: "40px",
                borderRadius: "15px",
                cursor: "pointer",
              }}
              onClick={() => {
                setIsPlatformFilter(!isPlatformFilter);
                setIsGearFilter(false);
              }}
            >
              <div style={{ marginLeft: "15px", marginRight: "45px" }}>
                {currentPlatformFilter}
              </div>
              <div style={{ position: "absolute", marginLeft: "160px" }}>
                <ChevronSVG />
              </div>
            </div>
            <div
              className="flex"
              style={{
                width: "200px",
                borderRadius: "3px",
                background: Styling.menuColour,
                boxShadow: Styling.basicShadow,
                color: Styling.menuFont,
                position: "absolute",
                marginTop: "10px",
                fontSize: "16px",
                fontWeight: "500",
                padding: "20px",
                flexDirection: "column",
                gap: "10px",
                zIndex: "1",
                display: isPlatformFilter ? "flex" : "none",
              }}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentPlatformFilter("All Platforms");
                  const prevFilter = currentFilter;
                  setCurrentFilter({ type: prevFilter.type, platform: "" });
                  setIsPlatformFilter(false);
                }}
              >
                All Platforms
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentPlatformFilter("BNB Chain");
                  const prevFilter = currentFilter;
                  setCurrentFilter({ type: prevFilter.type, platform: "0x38" });
                  setIsPlatformFilter(false);
                }}
              >
                BNB Chain
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentPlatformFilter("Ethereum");
                  const prevFilter = currentFilter;
                  setCurrentFilter({ type: prevFilter.type, platform: "0x1" });
                  setIsPlatformFilter(false);
                }}
              >
                Ethereum
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentPlatformFilter("Polygon");
                  const prevFilter = currentFilter;
                  setCurrentFilter({ type: prevFilter.type, platform: "0x89" });
                  setIsPlatformFilter(false);
                }}
              >
                Polygon
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex"
          style={{ flexDirection: "column", userSelect: "none" }}
        >
          <div
            style={{
              color: "#777E90",
              fontWeight: "600",
              fontSize: "12px",
              marginBottom: "5px",
            }}
          >
            GEAR TYPE
          </div>
          <div>
            <div
              className="flex items-center"
              style={{
                color: Styling.secondaryFont,
                fontWeight: "600",
                border: "1px solid #777E90",
                width: "180px",
                height: "40px",
                borderRadius: "15px",
                cursor: "pointer",
              }}
              onClick={() => {
                setIsGearFilter(!isGearFilter);
                setIsPlatformFilter(false);
              }}
            >
              <div style={{ marginLeft: "15px", marginRight: "45px" }}>
                {currentGearFilter}
              </div>
              <div style={{ position: "absolute", marginLeft: "160px" }}>
                <ChevronSVG />
              </div>
            </div>
            <div
              className="flex"
              style={{
                width: "200px",
                borderRadius: "3px",
                background: Styling.menuColour,
                boxShadow: Styling.basicShadow,
                color: Styling.menuFont,
                position: "absolute",
                marginTop: "10px",
                fontSize: "16px",
                fontWeight: "500",
                zIndex: "1",
                padding: "20px",
                flexDirection: "column",
                gap: "10px",
                display: isGearFilter ? "flex" : "none",
              }}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentGearFilter("All Types");
                  const prevFilter = currentFilter;
                  setCurrentFilter({ type: "", platform: prevFilter.platform });
                  setIsGearFilter(false);
                }}
              >
                All Types
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentGearFilter("Utility");
                  const prevFilter = currentFilter;
                  setCurrentFilter({
                    type: "utility",
                    platform: prevFilter.platform,
                  });
                  setIsGearFilter(false);
                }}
              >
                Utility
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentGearFilter("Cosmetic");
                  const prevFilter = currentFilter;
                  setCurrentFilter({
                    type: "cosmetic",
                    platform: prevFilter.platform,
                  });
                  setIsGearFilter(false);
                }}
              >
                Cosmetic
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentGearFilter("Weapon");
                  const prevFilter = currentFilter;
                  setCurrentFilter({
                    type: "weapon",
                    platform: prevFilter.platform,
                  });
                  setIsGearFilter(false);
                }}
              >
                Weapon
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrentGearFilter("Lootbox");
                  const prevFilter = currentFilter;
                  setCurrentFilter({
                    type: "lootbox",
                    platform: prevFilter.platform,
                  });
                  setIsGearFilter(false);
                }}
              >
                Lootbox
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ flexDirection: "column", userSelect: "none" }}
        >
          <div
            style={{
              color: "#777E90",
              fontWeight: "600",
              fontSize: "12px",
              marginBottom: "5px",
            }}
          >
            VERIFIED PROJECTS
          </div>
          <div
            className="flex items-center justify-center"
            style={{
              border: verified ? "" : "1px solid grey",
              background: verified ? "rgb(55, 114, 255)" : "transparent",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              borderRadius: "6px",
            }}
            onClick={() => {
              setVerified(!verified);
            }}
          >
            {verified && (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 12L9 18L21 6"
                  stroke="white"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
      <div
        className="absolute"
        style={{
          width: "80%",
          height: "2px",
          backgroundColor: Styling.grey,
          top: "500px",
          borderRadius: "999px",
          zIndex: "0",
        }}
      ></div>
      <div
        className=""
        style={{
          marginTop: "100px",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridColumnGap: "40px",
          gridRowGap: "40px",
        }}
      >
        {items === null ? "No items found :(" : items}
      </div>
      {isSendMenu && (
        <div
          className="fixed flex items-center justify-center"
          style={{ width: "100%", height: "100%", backdropFilter: "blur(5px)" }}
        >
          (
          <div
            style={{
              width: "480px",
              height: "600px",
              borderRadius: "10px",
              background: "#353945",
            }}
          >
            <div
              className="flex items-center"
              style={{ marginLeft: "40px", marginTop: "25px", gap: "150px" }}
            >
              <div
                style={{ fontSize: "40px", fontWeight: "600", color: "#fff" }}
              >
                Send Items
              </div>
              <div
                onClick={() => {
                  setIsSendMenu(false);
                }}
                className="flex items-center justify-center"
                style={{
                  border: "2px solid #fff",
                  width: "40px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  height: "40px",
                }}
              >
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.292787 0.305288C0.480314 0.117817 0.734622 0.0125018 0.999786 0.0125018C1.26495 0.0125018 1.51926 0.117817 1.70679 0.305288L6.99979 5.59829L12.2928 0.305288C12.385 0.209778 12.4954 0.133596 12.6174 0.0811869C12.7394 0.0287779 12.8706 0.00119157 13.0034 3.77571e-05C13.1362 -0.00111606 13.2678 0.0241854 13.3907 0.0744663C13.5136 0.124747 13.6253 0.199 13.7192 0.292893C13.8131 0.386786 13.8873 0.498438 13.9376 0.621334C13.9879 0.744231 14.0132 0.87591 14.012 1.00869C14.0109 1.14147 13.9833 1.27269 13.9309 1.39469C13.8785 1.5167 13.8023 1.62704 13.7068 1.71929L8.41379 7.01229L13.7068 12.3053C13.8889 12.4939 13.9897 12.7465 13.9875 13.0087C13.9852 13.2709 13.88 13.5217 13.6946 13.7071C13.5092 13.8925 13.2584 13.9977 12.9962 14C12.734 14.0022 12.4814 13.9014 12.2928 13.7193L6.99979 8.42629L1.70679 13.7193C1.51818 13.9014 1.26558 14.0022 1.00339 14C0.741188 13.9977 0.490376 13.8925 0.304968 13.7071C0.11956 13.5217 0.0143906 13.2709 0.0121121 13.0087C0.00983372 12.7465 0.110629 12.4939 0.292787 12.3053L5.58579 7.01229L0.292787 1.71929C0.105316 1.53176 0 1.27745 0 1.01229C0 0.747124 0.105316 0.492816 0.292787 0.305288Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            <div>
              <div
                style={{
                  fontWeight: "500",
                  color: "#777E90",
                  fontSize: "20px",
                  marginLeft: "40px",
                  marginTop: "40px",
                }}
              >
                ITEMS ({selectedItems.length})
              </div>
              <div
                className="menuitem flex"
                style={{
                  marginLeft: "60px",
                  flexDirection: "column",
                  height: "180px",
                  overflow: "scroll",
                }}
              >
                {menuItems}
              </div>
            </div>
            <div
              className="flex justify-center items-center"
              style={{
                transition: "0.2s",
                width: "320px",
                height: "100px",
                border: addressWarning ? "1px solid red" : "1px solid #787EFF",
                borderRadius: "6px",
                marginLeft: "80px",
                marginTop: "50px",
              }}
            >
              <div
                className="absolute"
                style={{
                  transition: "opacity 0.2s",
                  color: "red",
                  marginTop: "130px",
                  overflow: "hidden",
                  opacity: addressWarning ? "1" : "0",
                  marginLeft: "-140px",
                }}
              >
                * This address is invalid
              </div>
              <div
                className=" absolute flex items-center justify-center"
                style={{
                  fontWeight: "500",
                  userSelect: "none",
                  color: "#fff",
                  background: "#353945",
                  marginTop: "-100px",
                  width: "175px",
                }}
              >
                TARGET ADDRESS
              </div>
              <input
                onFocus={handleFocus}
                onChange={handleAddressInput}
                placeholder="0xabcde..."
                style={{
                  background: "transparent",
                  fontSize: "16px",
                  textAlign: "center",
                  width: "100%",
                  color: "#fff",
                  fontWeight: "500",
                }}
              />
            </div>
            <div
              onClick={() => {
                if (canSend) {
                }
              }}
              className="flex items-center justify-center"
              style={{
                transition: "0.5s",
                userSelect: "none",
                cursor: canSend ? "pointer" : "not-allowed",
                background: canSend ? "#195FC2" : "grey",
                width: "60%",
                marginLeft: "96px",
                marginTop: "30px",
                borderRadius: "10px",
                height: "60px",
                fontWeight: "600",
                color: "#fff",
                fontSize: "24px",
              }}
            >
              Send
            </div>
          </div>
        </div>
      )}
      <Footer handleThemeChange={handleThemeChange} Styling={Styling} />
    </div>
  );
};

export default Inventory;
