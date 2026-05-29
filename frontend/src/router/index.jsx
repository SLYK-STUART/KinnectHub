import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";
import ChangePassword from "../pages/Auth/ChangePassword";
import Home from "../pages/Home/Home";

import ProtectedRoute from "./ProtectedRoute";

import Vault from '../pages/vault/vault';

import Location from "../pages/location/Location";

import Watchlist from "../pages/watchlist/Watchlist";

import Announcements from "../pages/Announcements/Announcements";

import AdminPanel from "../pages/AdminPanel/AdminPanle";

import Wall from "../pages/Wall/Wall";

import Calendar from "../pages/Calendar/Calendar";

import MemoryBook from "../pages/MemoryBook/MemoryBook";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/change-password" element={<ChangePassword />} />

                <Route path="/vault" element={<Vault />} />

                <Route path="/location" element={<Location />} />

                <Route path="/watchlist" element={<Watchlist />} />

                <Route path="/announcements" element={<Announcements />} />

                <Route path="/admin_panel" element={<AdminPanel />} />

                <Route path="/wall" element={<Wall />} />

                <Route path="/calendar" element={<Calendar />} />

                <Route path="memory_book" element={<MemoryBook />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
