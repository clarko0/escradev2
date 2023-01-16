import { isDocked } from "./WindowMethods";

export const CheckTheme = () => {
  if (isDocked()) {
    const userTheme: any = window.localStorage.getItem("user_theme");
    if (userTheme == null) {
      window.localStorage.setItem("user_theme", "dark");
      return "dark";
    }
    return userTheme;
  }
};

export const ChangeTheme = () => {
  if (isDocked()) {
    if (window.localStorage.getItem("user_theme") === "light") {
      window.localStorage.setItem("user_theme", "dark");
    } else {
      window.localStorage.setItem("user_theme", "light");
    }
  }
};
