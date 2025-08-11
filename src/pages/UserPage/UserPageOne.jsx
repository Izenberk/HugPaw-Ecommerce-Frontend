const UserPageOne = () => {
    return (
        <div>
            <main className="px-4 py-6 md:px-8">
            {/* Header */}
            <section id="profile" className="mb-6">
                <div className="flex items-center gap-4 md:gap-6">
                <div className="w-20 h-20 shrink-0">
                    <img
                    src="/src/assets/images/blackcat.jpg"
                    alt="User avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-border shadow-md"
                    />
                </div>

                <div className="flex-1 bg-card text-card-foreground rounded-xl border border-border p-3 md:p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                        <p className="font-semibold text-2xl leading-tight">Username</p>
                        <p className="text-muted-foreground text-sm">customer</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <div className="flex flex-col">
                        <span className="font-semibold">12</span>
                        <span className="text-muted-foreground">Orders</span>
                        </div>
                        <div className="flex flex-col">
                        <span className="font-semibold">5</span>
                        <span className="text-muted-foreground">Favorites</span>
                        </div>
                    </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                    Welcome back to HugPaw! Manage your orders, favorites, and account settings.
                    </p>
                </div>
                </div>
            </section>

            {/* Grid: actions (mobile first) + content */}
            <section id="userPage" className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                {/* Quick actions (left on desktop, top on mobile) */}
                <aside className="bg-accent/40 md:bg-surface rounded-xl border md:border-none md:shadow p-4 md:col-span-1">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                    <button id="btn-fav" className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 hover:bg-accent transition">
                    <span aria-hidden>❤️</span>
                    <span>Favorite</span>
                    </button>
                    <button id="btn-track" className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 hover:bg-accent transition">
                    <span aria-hidden>📦</span>
                    <span>Tracking</span>
                    </button>
                    <button id="btn-warranty" className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 hover:bg-accent transition">
                    <span aria-hidden>🛡️</span>
                    <span>Warranty</span>
                    </button>
                    <button id="btn-history" className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 hover:bg-accent transition">
                    <span aria-hidden>🕒</span>
                    <span>History</span>
                    </button>
                </div>
                </aside>

                {/* Main content (right on desktop) */}
                <section className="bg-card text-card-foreground rounded-xl border border-border p-4 md:col-span-3">
                {/* Tabs: simple, no library needed now */}
                <div className="flex flex-wrap items-center gap-2 border-b border-border pb-2 mb-4">
                    <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Orders</button>
                    <button className="px-3 py-1.5 rounded-md hover:bg-accent">Favorites</button>
                    <button className="px-3 py-1.5 rounded-md hover:bg-accent">Warranty</button>
                    <button className="px-3 py-1.5 rounded-md hover:bg-accent">Settings</button>
                </div>

                {/* Content placeholder (replace with real components later) */}
                <div className="text-sm text-muted-foreground">
                    Select a tab to view details. (We’ll hook this to real data soon.)
                </div>
                </section>
            </section>
            </main>

        </div>
    )
}

export default UserPageOne