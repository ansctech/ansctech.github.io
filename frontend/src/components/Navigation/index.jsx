import React, { useEffect, useState } from "react";
import i18next from "i18next";
import { Layout, Menu, Drawer } from "antd";
import LayoutContent from "../Content";
import { MenuOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/img/logo.jpg";
import useItems from "./menu-items";
import { useDispatch, useSelector } from "react-redux";
import useFetch from "../../hooks/global/useFetch";
import { userActions } from "../../store/Authentication/user";

export function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const Navigation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [userInfoOpen, setUserInfoOpen] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const { Sider } = Layout;
  const items = useItems();
  const navigate = useNavigate();
  const location = useLocation();

  const { reqFn: authRequest } = useFetch();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    authRequest({
      url: "logout",
      method: "POST",
      successFn: () => {
        // Update user data
        dispatch(userActions.clear());

        // Save data to localstorage
        localStorage.clear("agroCurrentUser");

        navigate("/login");
      },
    });
  };

  const pathname =
    window.location.pathname === "/"
      ? ["", "masters", "business-entity"]
      : window.location.pathname.split("/");

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize(window.innerWidth);
    });
  }, [windowSize]);

  // If this is login route
  if (location.pathname === "/login") {
    return <LayoutContent />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <nav className="nav-bar">
        <select
          className="language-selector"
          onChange={(event) => {
            i18next.changeLanguage(event.target.value);
          }}
        >
          <option value="en" className="">
            English
          </option>
          <option value="hi" className="">
            Hindi
          </option>
        </select>
        <div
          className="user-avatar"
          onClick={() => {
            setUserInfoOpen((prevState) => !prevState);
          }}
        >
          {user.client_name_eng?.[0].toUpperCase()}
        </div>
        {userInfoOpen && (
          <div className="user-info">
            {/* Logo */}
            <span className="user-avatar"></span>
            {/* Company name */}
            <h2 className="user-title">{user.client_name_eng}</h2>
            {/* Company slogan */}
            <h4 className="user-tag">{user.tagline}</h4>
            {/* Logout button */}
            <button
              className="logout"
              onClick={() => {
                logoutHandler();
                setUserInfoOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
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
          </div>
          <Drawer
            placement="left"
            title={<img src={Logo} alt="#" width={250} height={50} />}
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
        {/* <div id="google_translate_element"></div> */}
      </Layout>
    </Layout>
  );
};
export default Navigation;
