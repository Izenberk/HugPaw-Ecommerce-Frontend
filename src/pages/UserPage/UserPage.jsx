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
        <div className="px-4 py-6 lg:px-16">
            {/* Make the whole page a grid; align header and panel to the same start at lg */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-6">

                {/* Header — on lg, start at col 2 to align with the panel */}
                <div className="order-1 lg:col-start-2 lg:col-span-3">
                <UserHeader
                    avatar={""}
                    name="BlackCat Lover"
                    role="Customer"
                    bio="Loving cat mom & proud HugPaw member since 2024."
                    onEditProfile={() => console.log("Edit profile clicked")}
                />
                </div>

                {/* Sidebar tabs */}
                <aside className="order-2 lg:order-2 lg:col-span-1">
                <ActionTabs value={active} onChange={setActive} />
                </aside>

                {/* Display panel — shares the same column start as the header at lg */}
                <section className="order-3 lg:order-3 bg-card text-card-foreground rounded-xl border border-border p-4 lg:col-span-3">
                {active === "favorites" && <FavoritesPanel />}
                {active === "orders"    && <OrdersPanel />}
                {active === "warranty"  && <WarrantyPanel />}
                {active === "history"   && <HistoryPanel />}
                </section>
            </div>
        </div>
    );
}

export default UserPage