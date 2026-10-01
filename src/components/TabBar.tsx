import React from "react";
import type { Option } from "react-dropdown";
import { withTranslation } from "react-i18next";
import type { TabItemConfig } from "../types/marketplace-types";

// NOTE: The label and value are the same (e.g. "Extensions")
type TabOptionConfig = Option & {
  active: boolean;
  enabled: boolean;
};

class TabBarItem extends React.Component<{
  item: TabOptionConfig;
  switchTo: (option: Option) => void;
  // TODO: there's probably a better way to make TS not complain about the withTranslation HOC
  t: (key: string) => string;
}> {
  render() {
    const { t } = this.props;
    if (!this.props.item.enabled) return null;

    return (
      <li
        className="marketplace-tabBar-headerItem"
        data-tab={this.props.item.value}
        onClick={(event) => {
          event.preventDefault();
          this.props.switchTo(this.props.item);
        }}
      >
        <a
          aria-current="page"
          className={`marketplace-tabBar-headerItemLink ${this.props.item.active ? "marketplace-tabBar-active" : ""}`}
          draggable="false"
          href="##"
        >
          <span className="main-type-mestoBold">{t(`tabs.${this.props.item.value}`)}</span>
        </a>
      </li>
    );
  }
}

const TabBarItemWithTranslation = withTranslation()(TabBarItem);

interface TabBarProps {
  links: TabItemConfig[];
  activeLink: string;
  switchCallback: (option: Option) => void;
}

// Rendered in the marketplace page. Spotify 1.3 no longer exposes a usable
// top-bar content slot, so portaling into `.main-topBar-*` hid every tab.
export const TopBarContent = (props: TabBarProps) => {
  const options = props.links
    .filter(({ enabled }) => enabled)
    .map(({ name }) => {
      const active = name === props.activeLink;
      return { label: name, value: name, active, enabled: true } as TabOptionConfig;
    });

  return (
    <nav className="marketplace-tabBar marketplace-tabBar-nav">
      <ul className="marketplace-tabBar-header">
        {options.map((item) => (
          <TabBarItemWithTranslation key={item.value} item={item} switchTo={props.switchCallback} />
        ))}
      </ul>
    </nav>
  );
};
