import React, { useState } from "react";
import UserHeader from "@/components/userPage/UserHeader";
import ActionTabs from "@/components/userPage/ActionTabs";
import FavoritePanel from "@/components/favorites/FavoritePanel";
import { useUser } from "@/context/UserContext";

const UserPage = () => {
    const [active, setActive] = useState("favorites");
    const { user, updateUser } = useUser();

    const handleSave = async (nextUser, { avatarFile }) => {
        let avatarUrl = user?.avatarUrl;
        if (avatarFile) {
        // Preview immediately; replace with final URL after upload when backend exists
        avatarUrl = URL.createObjectURL(avatarFile);
        }
        updateUser({ ...nextUser, avatarUrl });
    };

    return (
        <div className="min-h-screen px-4 py-6 lg:px-16">
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
                    <FavoritePanel />
                </section>
            </div>
        </div>
    );
};

export default UserPage;
