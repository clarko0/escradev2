import { isDocked } from "./WindowMethods";

export const getSubdomain = () => {
  if (!isDocked()) {
    return -1;
  }
  const host = window.location.host;
  return host.split(".")[0];
};

export const getRoute = () => {
  if (isDocked()) {
    return window.location.pathname.split("/").length - 1;
  }
  return 0;
};

export const getDir = () => {
  if (isDocked()) {
    return window.location.pathname;
  }
};
