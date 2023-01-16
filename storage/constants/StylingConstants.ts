interface StylingObject {
  [key: string]: any;
}

export const STYLES: StylingObject = {
  light: {
    main: "#F3F3FF",
    accent: "#8080FF",
    secondaryFont: "black",
    fontMain: "#16172E",
    grey: "#777E90",
    darkGrey: "#353945",
    borderMain: "#CCCCCC",
    menuFont: "#777E90",
    menuColour: "#353945",
    primaryColour: "#8080FF",
    basicShadow: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
    btnGradient: "linear-gradient(90deg, #195FC2 0%, #488EF2 100%)",
    textGlow: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
    infoBox: "rgb(2, 6, 9)",
    logo: "#000",
    itemGradient: "linear-gradient(180deg, #E5F5F9 0%, #F7FBFC 100%)",
  },
  dark: {
    main: "#020609",
    accent: "#16172E",
    fontMain: "rgba(208, 220, 232, 1)",
    secondaryFont: "white",
    grey: "#777E90",
    menuFont: "#777E90",
    menuColour: "#353945",
    darkGrey: "#353945",
    borderMain: "#16172E",
    primaryColour: "#16172E",
    basicShadow: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 1))",
    yellowGlow:
      "drop-shadow(0px 0px 2676.24px #FFFF80) drop-shadow(0px 0px 1529.28px #FFFF80) drop-shadow(0px 0px 892.08px #FFFF80) drop-shadow(0px 0px 446.04px #FFFF80) drop-shadow(0px 0px 127.44px #FFFF80) drop-shadow(0px 0px 63.72px #FFFF80)",
    textGlow: "0 0 42px #fff, 0 0 82px #fff, 0 0 92px #fff, 0 0 102px #fff",
    btnGradient: "linear-gradient(90deg, #195FC2 0%, #488EF2 100%)",
    infoBox: "rgb(2, 6, 9)",
    logo: "#fff",
    itemGradient:
      "linear-gradient(180deg, #16172E 0%, rgba(0, 105, 255, 0) 100%)",
  },
};
