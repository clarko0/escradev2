import "../styles/styles.css";
import { Inter } from "@next/font/google";
import App from "./App";
import Login from "./App/login";
import CreateAccount from "./App/createAccount";
import { memo, useEffect, useState } from "react";
import Inventory from "./App/inventory";
import Docs from "./Docs";
import Home from "./Home";
import { getAddressId } from "../storage/utils/tools/MiscTools";
import { getDir, getSubdomain } from "../storage/utils/tools/RouterMethods";

const inter = Inter({ subsets: ["latin"] });

const MyApp = () => {
  const [page, setPage] = useState(<></>);
  const ethAddressPattern = /^0x[0-9a-fA-F]{40}$/;
  const pages: any = {
    app: {
      "/": <App />,
      "/login": <Login />,
      "/login/create-account": <CreateAccount />,
      [`/inventory/${
        ethAddressPattern.test(getAddressId()) && getAddressId()
      }`]: <Inventory Address={getAddressId()} />,
    },
    docs: { "/": <Docs /> },
  };

  useEffect(() => {
    const subdomain: any = getSubdomain();
    const dir: any = getDir();
    const page = pages[subdomain] ? pages[subdomain][dir] : <Home />;
    setPage(page);
  }, []);

  return (
    <div className={inter.className}>
      <div className="App">{page}</div>
    </div>
  );
};

export default memo(MyApp);
