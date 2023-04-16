import { Icon } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const StyledIcon = styled(Icon)(() => ({
  fontSize: "18px",
  verticalAlign: "middle",
}));

const MatxHorizontalNav = ({ max }) => {
  let navigation = useSelector(({ navigations }) => navigations);
  if (!navigation || !navigation.length) {
    return null;
  }

  if (max && navigation.length > max) {
    let childItem = {
      name: "More",
      icon: "more_vert",
      children: navigation.slice(max, navigation.length),
    };
    navigation = navigation.slice(0, max);
    navigation.push(childItem);
  }

  function renderLevels(levels) {
    return levels.map((item, key) => {
      if (item.type === "label") return null;
      if (item.children) {
        return (
          <li key={key}>
            <a href="/">
              {item.icon && <StyledIcon>{item.icon}</StyledIcon>}
              {item.name}
            </a>
            <ul>{renderLevels(item.children)}</ul>
          </li>
        );
      } else {
        return (
          <li key={key}>
            <NavLink to={item.path}>
              {item.icon && <StyledIcon>{item.icon}</StyledIcon>}
              {item.name}
            </NavLink>
          </li>
        );
      }
    });
  }

  return (
    <div className={"horizontal-nav"}>
      <ul className={"menu"}>{renderLevels(navigation)}</ul>
    </div>
  );
};

export default MatxHorizontalNav;
