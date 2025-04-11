import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { App, ConfigProvider, Layout, Menu, Switch, theme } from "antd";
import { GameState } from "./components/GameState";
import { WalletWrapper } from "./components/WalletWrapper";
import "./index.css"; // Ensure this exists

import {
  BarChartOutlined,
  HistoryOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

// Default styles (required for modal UI)
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";
import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

const { Content, Footer, Sider } = Layout;

const menuItems = [
  {
    label: <Link to="/">Play Game</Link>,
    key: "",
    icon: <PlayCircleOutlined />,
  },
  {
    label: <Link to="/history">Game History</Link>,
    key: "history",
    icon: <HistoryOutlined />,
  },
  {
    label: <Link to="/stats">Player Stats</Link>,
    key: "stats",
    icon: <BarChartOutlined />,
  },
];

const Main = () => {

  const { connected } = useWallet();

  
  const [menuIndex, setMenuIndex] = useState("/bidder");

  const navigate = useNavigate();
  const location = useLocation();
  const onClick = (e) => {
      navigate(e.key);
  };

  useEffect(() => {
      setMenuIndex(location.pathname);
      // if (location.pathname === "/") {
      //     navigate("/account");
      // }
  }, [location, navigate]);

  const [darkMode, setDarkMode] = useState(true);

  return (
    <WalletWrapper>
      <GameState>
        <ConfigProvider
          theme={{
            algorithm: darkMode
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
            token: {
              colorPrimary: "#ec005a",
            },
          }}
        >
        <App>
          <Layout style={{ minHeight: "100vh"}}>
            <Sider breakpoint="lg" collapsedWidth="0" theme="light">
              <h1 className={darkMode ? "headerDark" : "headerLight"}>
                <Link to="/">
                  Rock Paper Scissors
                </Link>
              </h1>
              <Menu
                theme="light"
                mode="inline"
                selectedKeys={[menuIndex]}
                items={menuItems}
                onClick={onClick}
              />
              <Switch
                  style={{
                      marginTop: "24px",
                      marginLeft: "24px",
                  }}
                  checked={darkMode}
                  onChange={(value) => setDarkMode(value)}
                  checkedChildren="Dark"
                  unCheckedChildren="Light"
              />
              <br />
              <WalletMultiButton />
              <div style={{ textAlign: "center" }}>
              {connected ? (
                <div>
                  <h3>✅ Connected Wallet</h3>
                  <p><strong>Wallet Address:</strong> {publicKey}</p>
                  <p><strong>Connected Network:</strong> {network || "Unknown"}</p>
                  <button onClick={disconnect}>Disconnect</button>
                  <LatestBalance userAddress={publicKey} />
                  {/* <LatestBlockHeight /> */}
                  {/* Pass the wallet to the RockpaperScissors component */}
                </div>
              ) : (
                <p>Select a wallet to connect.</p>
              )}
            </div>
            </Sider>
            <Layout>
                <Content style={{ padding: "50px 50px", margin: "0 auto", minWidth: "850px" }}>
                  <Outlet />
                </Content>
                <Footer style={{ textAlign: "center", display:"flex", flexDirection: "column" }}>
                  <a href="https://github.com/ProvableHQ/sdk">
                  <img src="../public/github-mark-white.png" style={{height:"24px"}}></img>
                  </a>
                  <Link to="https://sdk.betteruptime.com/" style={{color: "white"}}> <span>Status</span> </Link>
                  <Link to="/terms_of_use" style={{color: "white"}}> <span>Terms of Use</span> </Link>
                  <Link to="/privacy_policy" style={{color:"white"}}><span>Privacy Policy</span></Link>
                  © 2025 Provable Inc.
                </Footer>
              </Layout>
            </Layout>
          </App>
        </ConfigProvider>
      </GameState>
    </WalletWrapper>
  )
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

export default Main;