import React, { useState } from 'react'
import UserHeader from '@/pages/userPage/UserHeader';
import ActionTabs from '@/pages/userPage/ActionTabs';
import Blackcat from "@assets/images/blackcat.jpg"
import FavoritePanel from '@/components/favorites/FavoritePanel';

const UserPage = () => {
    const [active, setActive] = useState("favorites");
    const [user, setUser] = useState({
        avatarUrl: Blackcat,
        username: "BlackCat Lover",
        email: "blackcat@example.com",
        role: "Customer",
        address: {
            line1: "99 Catnip Alley",
            line2: "",
            city: "Bangkok",
            state: "Dindang",
            postal: "10400",
            country: "Thailand",
        },
    });

    const handleSave = async (nextUser, { avatarFile }) => {
        // optimistic avatar preview (show new image immediately)
        let avatarUrl = user.avatarUrl;
        if (avatarFile) {
        avatarUrl = URL.createObjectURL(avatarFile); // replace with final URL after upload
    }

    setUser(prev => ({ ...prev, ...nextUser, avatarUrl }));

        // TODO: upload avatarFile, get a permanent URL, then:
        // setUser(prev => ({ ...prev, avatarUrl: finalUrl }));
        // and optionally URL.revokeObjectURL(avatarUrl) to free memory
    };

    return (
        <div className="px-4 py-6 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-6">
                {/* Header — on lg, start at col 2 to align with the panel */}
                <div className="order-1 lg:col-start-2 lg:col-span-3">
                <UserHeader user={user} onSave={handleSave} />
                </div>

                {/* Sidebar tabs */}
                <aside className="order-2 lg:order-2 lg:col-span-1">
                <ActionTabs value={active} onChange={setActive} />
                </aside>

                {/* Display panel */}
                <section className="order-3 lg:order-3 bg-card text-card-foreground rounded-xl border border-border p-4 lg:col-span-3">
                    {/* {active === "favorites" && <FavoritesPanel />}
                    {active === "orders" && <TrackingPanel />}
                    {active === "warranty" && <WarrantyPanel />}
                    {active === "history" && <HistoryPanel />} */}
                    <FavoritePanel />
                </section>
            </div>
        </div>
    );
}

export default UserPage