import React, { useEffect, useState } from "react";
import { Layout, Menu, Drawer } from "antd";
import LayoutContent from "../Content";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/img/logo.jpg";
import { items } from "./menu-items";

export function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const Navigation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const { Sider } = Layout;
  const navigate = useNavigate();
  const pathname =
    window.location.pathname === "/"
      ? ["", "masters", "business-entity"]
      : window.location.pathname.split("/");

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize(window.innerWidth);
    });
  }, [windowSize]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {windowSize > 768 ? (
        <Sider
          width={"270"}
          theme={"light"}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className={"site-logo"}>
            {" "}
            <img src={Logo} alt="#" />{" "}
          </div>
          <Menu
            mode="inline"
            theme="light"
            items={items}
            className={"Side-menu"}
            defaultOpenKeys={["/" + pathname[1]]}
            defaultSelectedKeys={["/" + pathname[2]]}
            onSelect={({ keyPath }) => navigate(keyPath[1] + keyPath[0])}
          />
        </Sider>
      ) : (
        <>
          <div className="mobile-menu-header">
            <MenuOutlined
              onClick={() => setCollapsed(true)}
              style={{ fontSize: "30px" }}
            />
            <img src={Logo} alt="#" />
          </div>
          <Drawer
            placement="left"
            title="Agro Form"
            onClose={() => setCollapsed(false)}
            open={collapsed}
          >
            <Menu
              mode="inline"
              theme="light"
              items={items}
              className={"Side-menu"}
              defaultOpenKeys={["/" + pathname[1]]}
              defaultSelectedKeys={["/" + pathname[2]]}
              onSelect={({ keyPath }) => {
                navigate(keyPath[1] + keyPath[0]);
                setCollapsed(false);
              }}
            />
          </Drawer>
        </>
      )}
      <Layout className={"side-layout"}>
        <LayoutContent />
        <div id="google_translate_element"></div>
      </Layout>
    </Layout>
  );
};
export default Navigation;
