import styles from "./AppShell.module.css";

import Sidebar from "../Sidebar/Sidebar";
import TopBar from "../TopBar/TopBar";
import BottomNav from "../BottomNav/BottomNav";

function AppShell({ children }) {
    return (
        <div className="{styles.shell">
           

            <div className={styles.main}>
                <TopBar />

                <div className="{styles.content}">
                    {children}
                </div>

                <BottomNav />
            </div>
        </div>
    );
}

export default AppShell;