import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import logout from "@public/assets/logout.svg";
import { useAuthStore } from "@shared/store/authStore.ts";
import { usePermissionsStore } from "@shared/store/permissionStore.ts";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { Menu } from "antd";

import "./index.scss";

export interface SubMenuItem {
  key: string;
  name: string;
  href: string;
}

export interface MenuItem {
  icon?: React.ReactNode;
  key: string;
  name: string;
  items?: (MenuItem | SubMenuItem)[];
  href?: string;
  search?: boolean;
}

interface NavMenuProperties {
  menuItems: MenuItem[];
  isMenuOpen: boolean;
}

export const hasReadPermission = (
  permissions: string[],
  key: string,
): boolean => {
  return permissions.includes(`${key}:read`);
};

export const NavMenu: FC<NavMenuProperties> = ({ menuItems, isMenuOpen }) => {
  const { t } = useTranslation(["nav-menu-stack"]);
  const { permissions } = usePermissionsStore();
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>(
    {},
  );
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const { clearTokens } = useAuthStore();
  const router = useRouter();
  const location = useLocation();

  const handleSearchChange = (key: string, value: string): void => {
    setSearchValues((previous) => ({ ...previous, [key]: value }));
  };

  const handleMenuItemClick = (parentKey: string): void => {
    setSelectedKeys([parentKey]);
  };

  const handleLogout = (): void => {
    clearTokens();
    router.navigate({ to: "/login", replace: true });
    // eslint-disable-next-line unicorn/no-null
    globalThis.history.pushState(null, "", "/login");
  };

  useEffect(() => {
    const currentPath = location.pathname;

    const setActiveKey = (
      items: MenuItem[],
      // eslint-disable-next-line unicorn/no-null
      parentKey: string | null = null,
    ): boolean => {
      for (const item of items) {
        if (item.href && currentPath === item.href) {
          setSelectedKeys([parentKey ?? item.key]);
          return true;
        }
        if (item.items) {
          const found = setActiveKey(item.items as MenuItem[], item.key);
          if (found) {
            return true;
          }
        }
      }
      return false;
    };

    if (!setActiveKey(menuItems) || currentPath === "/") {
      setSelectedKeys([]);
    }
  }, [location.pathname, menuItems]);

  const renderMenuItems = (
    items: MenuItem[],
    isSubMenu: boolean = false,
    // eslint-disable-next-line unicorn/no-null
    parentKey: string | null = null,
  ): React.ReactNode[] => {
    return items.map((item) => {
      const itemHasPermission = hasReadPermission(permissions, item.key);
      const searchValue = searchValues[item.key] || "";

      if (item.items && item.items.length > 0) {
        const filteredItems = item.items.filter((subItem) =>
          t(subItem.name).toLowerCase().includes(searchValue.toLowerCase()),
        );

        return (
          <Menu.SubMenu
            key={item.key}
            title={
              <div
                className={`${"title"} ${isSubMenu ? "subMenuTitle" : "mainMenuTitle"}`}
              >
                {!isSubMenu && <div className={"icon"}>{item.icon}</div>}
                {isSubMenu ? (
                  <span>{t(item.name)}</span>
                ) : (
                  isMenuOpen && (
                    <span className={"mainMenuText"}>{t(item.name)}</span>
                  )
                )}
              </div>
            }
            expandIcon={<></>}
            disabled={!itemHasPermission}
          >
            {item.search && (
              <Menu.Item key={`${item.key}-search`} className={"topSearch"}>
                <input
                  className="search"
                  placeholder={"Поиск по справочникам"}
                  value={searchValue}
                  onChange={(event) =>
                    handleSearchChange(item.key, event.target.value)
                  }
                  onClick={(event) => event.stopPropagation()}
                />
              </Menu.Item>
            )}
            {filteredItems && filteredItems.length > 0 ? (
              renderMenuItems(filteredItems as MenuItem[], true, item.key)
            ) : (
              <Menu.Item disabled>Сожалеем, поиск не дал результатов</Menu.Item>
            )}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={item.key}
            disabled={!itemHasPermission}
            className={"subMenuItem"}
            onClick={() => handleMenuItemClick(parentKey ?? item.key)}
          >
            <Link to={item.href} className={"link"}>
              <span>{item.icon}</span>
              <span>{isSubMenu && t(item.name)}</span>
            </Link>
          </Menu.Item>
        );
      }
    });
  };

  return (
    <Menu
      mode="vertical"
      theme="light"
      triggerSubMenuAction={"click"}
      className={`menu ${isMenuOpen ? "open" : ""}`}
      selectedKeys={selectedKeys}
      inlineCollapsed={isMenuOpen}
    >
      {renderMenuItems(menuItems)}
      <Link
        to={"/login"}
        className={"logout"}
        style={{ width: isMenuOpen ? "100%" : "auto" }}
        onClick={handleLogout}
      >
        <img src={logout} alt="" className={"logout-icon"} />
        {isMenuOpen && <span>Выход</span>}
      </Link>
    </Menu>
  );
};
