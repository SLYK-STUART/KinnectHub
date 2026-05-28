import { NavLink } from "react-router-dom";

import navStyles from "../navigation.module.css";

import styles from "./Sidebar.module.css";

function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <h2>KinnectHub</h2>

            <nav className="{styles.nav}">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? `${navStyles.link} $ {navStyles.active}`
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
                    Calender
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;