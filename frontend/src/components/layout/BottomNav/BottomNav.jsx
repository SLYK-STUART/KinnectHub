import { NavLink } from "react-router-dom";

import navStyles from "../navigation.module.css";

import styles from "./BottomNav.module.css";

function BottomNav() {
    return (
        <nav className={styles.bottomNav}>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive
                        ? `${navStyles.link} ${navStyles.active}`
                        : navStyles.link
                }
            >
                Home
            </NavLink>

            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive
                        ? `${navStyles.link} ${navStyles.active}`
                        : navStyles.link
                }
            >
                Posts
            </NavLink>

            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive
                        ? `${navStyles.link} $ {nav.Styles.active}`
                        : navStyles.link
                }
            >
                Calender
            </NavLink>
        </nav>
    );
}

export default BottomNav;