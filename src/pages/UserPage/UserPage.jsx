import React, { useState } from 'react'
import UserHeader from './UserHeader';
import ActionTabs from './ActionTabs';
import OrdersPanel from './OrdersPanel';
import FavoritesPanel from './FavoritesPanel';
import WarrantyPanel from './WarrantyPanel';
import HistoryPanel from './HistoryPanel';

const UserPage = () => {
    const [active, setActive] = useState("favorites");

    return (
        <div className="px-4 py-6 md:px-8">
            <div className="mb-6">
                <UserHeader
                    avatar="../../assets/images/blackcat.jpg"
                    name="BlackCat Lover"
                    role="Customer"
                    bio="Loving cat mom & proud HugPaw member since 2024."
                    onEditProfile={() => console.log("Edit profile clicked")}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                <aside className="md:col-span-1">
                    <ActionTabs value={active} onChange={setActive} />
                </aside>

                <div className="bg-card text-card-foreground rounded-xl border border-border p-4 md:col-span-3">
                    {active === "favorites" && <FavoritesPanel />}
                    {active === "orders"    && <OrdersPanel />}
                    {active === "warranty"  && <WarrantyPanel />}
                    {active === "history"   && <HistoryPanel />}
                </div>
            </div>
        </div>
    );
}

export default UserPage