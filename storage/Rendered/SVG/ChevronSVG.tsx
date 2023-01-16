import { CheckTheme } from "../../utils/tools/LocalStorage";

const ChevronSVG = () => {
  const GetColor = () => {
    return CheckTheme() === "dark" ? "white" : "black";
  };
  return (
    <svg
      width="6"
      height="4"
      viewBox="0 0 6 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.00001 3.66666L0.333339 0.99999L1.03334 0.266656L3.00001 2.23332L4.96667 0.266656L5.66667 0.99999L3.00001 3.66666Z"
        fill={GetColor()}
      />
    </svg>
  );
};
export default ChevronSVG;
