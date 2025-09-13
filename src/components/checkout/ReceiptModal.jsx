// src/components/checkout/ReceiptModal.jsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatTHB } from "@/lib/formatters";
import { Check, Clipboard, ClipboardCheck, Printer, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function ReceiptModal({ open, onOpenChange, order, onContinue }) {
    if (!order) return null;

    const {
        id,
        placedAt,
        status = "paid",
        items = [],
        amounts = {},
        shipping = {},
        payment = {},
        user = {},
        notes,
    } = order;

    // format date once
    const placedLabel = useMemo(
        () =>
        placedAt
            ? new Date(placedAt).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "-",
        [placedAt]
    );

    const [copied, setCopied] = useState(false);
    const copyId = async () => {
        try {
        await navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
        } catch {
        // no-op
        }
    };

    const totals = {
        subtotal: amounts?.subtotal || 0,
        shippingFee: amounts?.shippingFee || 0,
        discount: amounts?.discount || 0,
        tax: amounts?.tax || 0,
        total: amounts?.total || 0,
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        {/* Cap height & hide overflow at container */}
        <DialogContent
            className="
            max-w-2xl p-0 sm:max-h-[85vh] overflow-hidden
            rounded-2xl shadow-2xl
            print:max-w-none print:w-[100%] print:rounded-none print:shadow-none
            "
        >
            {/* RIBBON HEADER (pinned) */}
            <DialogHeader
            className="
                px-6 py-8 border-b sticky top-0 z-20 rounded-xl
                bg-gradient-to-r from-primary/10 via-background to-background
                backdrop-blur supports-[backdrop-filter]:bg-background/60
                print:bg-white print:border-b
            "
            >
            <div className="flex items-start sm:items-center gap-3 justify-between flex-col sm:flex-row">
                <div className="flex items-center gap-3">
                <div
                    className="
                    h-10 w-10 rounded-xl grid place-items-center
                    bg-primary/10 text-primary border border-primary/20
                    "
                    aria-hidden
                >
                    <Check className="h-5 w-5" />
                </div>
                <div>
                    <DialogTitle className="leading-none">Receipt</DialogTitle>
                    <DialogDescription className="mt-1">
                    Thank you for your purchase from <span className="font-medium">HugPaw</span>.
                    </DialogDescription>
                </div>
                </div>

                <StatusPill status={status} />
            </div>
            </DialogHeader>

            {/* BODY (scrolls) */}
            <div
            className="
                px-6 py-5 space-y-6 overflow-y-auto
                max-h-[calc(85vh-8rem)]
                pb-28    /* reserve so footer never overlaps */
                print:overflow-visible print:max-h-none print:pb-0
            "
            >
            {/* Overview */}
            <Panel>
                <div className="flex flex-wrap items-start gap-3 justify-between">
                <div className="min-w-[240px]">
                    <DL>
                    <DT>Order ID</DT>
                    <DD>
                        <code className="text-sm">{id}</code>
                        <Button
                        size="icon"
                        variant="ghost"
                        className="ml-2 h-7 w-7 align-middle print:hidden"
                        onClick={copyId}
                        title="Copy Order ID"
                        >
                        {copied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                        </Button>
                    </DD>

                    <DT>Placed</DT>
                    <DD>{placedLabel}</DD>

                    <DT>Status</DT>
                    <DD className="capitalize">{status}</DD>
                    </DL>
                </div>

                <Barcode id={id} />
                </div>
            </Panel>

            {/* Items */}
            <Panel>
                <SectionTitle>Items</SectionTitle>

                <ul
                className="
                    divide-y rounded-lg border
                    overflow-hidden
                "
                role="list"
                >
                {/* Header (visually subtle) */}
                <li
                    className="
                    hidden md:grid grid-cols-[auto_1fr_auto_auto_auto] gap-3
                    bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide
                    px-3 py-2
                    "
                >
                    <div className="w-14" />
                    <div>Product</div>
                    <div className="text-right">Unit</div>
                    <div className="text-right">Qty</div>
                    <div className="text-right">Line</div>
                </li>

                {items.map((it, i) => (
                    <li
                    key={i}
                    className="
                        grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_auto_auto]
                        gap-3 items-start px-3 py-3
                        odd:bg-background even:bg-muted/10
                    "
                    >
                    <img
                        src={it.imageUrl || "/images/placeholder-product.png"}
                        alt={it.name}
                        className="w-14 h-14 rounded-md object-cover flex-shrink-0 border"
                    />

                    <div className="min-w-0">
                        <div className="font-medium truncate">{it.name}</div>
                        {it?.config && Object.keys(it.config).length > 0 && (
                        <div className="text-xs text-muted-foreground">
                            {Object.entries(it.config)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" • ")}
                        </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1 md:hidden">
                        Unit: <span className="tabular-nums">{formatTHB(it.unitPrice)}</span> • Qty:{" "}
                        <span className="tabular-nums">{it.quantity}</span>
                        </div>
                    </div>

                    {/* Desktop numeric columns */}
                    <div className="hidden md:block text-sm text-muted-foreground text-right tabular-nums">
                        {formatTHB(it.unitPrice)}
                    </div>
                    <div className="hidden md:block text-sm text-muted-foreground text-right tabular-nums">
                        {it.quantity}
                    </div>
                    <div className="text-sm font-medium text-right tabular-nums">
                        {formatTHB((it.unitPrice || 0) * (it.quantity || 0))}
                    </div>
                    </li>
                ))}
                </ul>
            </Panel>

            {/* Shipping & Payment — single column, info-first */}
            <div className="space-y-4">
            {/* SHIPPING */}
            <InfoPanel title="Shipping">
                <div className="space-y-3">
                <Field label="Method">
                    <span className="font-medium">{shipping?.methodLabel || "—"}</span>
                    <span className="text-muted-foreground">
                    {" "}— {shipping?.fee ? formatTHB(shipping.fee) : "Free"}
                    </span>
                </Field>

                <div className="pt-2">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Address</div>
                    <address className="not-italic text-sm leading-6 mt-1 break-words">
                    <div>{shipping?.address?.line1}</div>
                    {shipping?.address?.line2 && <div>{shipping.address.line2}</div>}
                    <div>
                        {shipping?.address?.city}
                        {shipping?.address?.state ? `, ${shipping.address.state}` : ""} {shipping?.address?.postal}
                    </div>
                    <div>{shipping?.address?.country}</div>
                    </address>
                </div>
                </div>
            </InfoPanel>

            {/* PAYMENT */}
            <InfoPanel title="Payment">
                <div className="space-y-3">
                <Field label="Method">
                    <span className="capitalize">{payment?.method || "—"}</span>
                </Field>

                {payment?.cardLast4 && (
                    <Field label="Card">
                    <span className="tabular-nums">**** **** **** {payment.cardLast4}</span>
                    </Field>
                )}

                <Field label="Payer">
                    <div className="flex flex-col gap-0.5">
                    <span className="font-medium break-words">{user?.fullName || "—"}</span>
                    {user?.email ? (
                        <span className="text-muted-foreground break-words">{user.email}</span>
                    ) : null}
                    {user?.phone ? (
                        <span className="text-muted-foreground">{user.phone}</span>
                    ) : null}
                    </div>
                </Field>
                </div>
            </InfoPanel>
            </div>


            {/* Notes (optional) */}
            {notes ? (
                <Panel>
                <SectionTitle>Notes</SectionTitle>
                <p className="text-sm text-muted-foreground leading-6">{notes}</p>
                </Panel>
            ) : null}

            {/* Totals */}
            <Panel>
                <DL>
                <DT>Subtotal</DT>
                <DD className="tabular-nums">{formatTHB(totals.subtotal)}</DD>

                <DT>Shipping</DT>
                <DD className="tabular-nums">
                    {totals.shippingFee ? formatTHB(totals.shippingFee) : "Free"}
                </DD>

                {totals.discount > 0 && (
                    <>
                    <DT>Discount</DT>
                    <DD className="tabular-nums">- {formatTHB(totals.discount)}</DD>
                    </>
                )}

                {totals.tax > 0 && (
                    <>
                    <DT>Tax</DT>
                    <DD className="tabular-nums">{formatTHB(totals.tax)}</DD>
                    </>
                )}
                </DL>

                <Separator className="my-3" />
                <DL>
                <DT className="font-semibold">Total</DT>
                <DD className="font-semibold text-base md:text-lg tabular-nums">
                    {formatTHB(totals.total)}
                </DD>
                </DL>
            </Panel>

            {/* Print footer info */}
            <div className="hidden print:block text-xs text-muted-foreground pt-4">
                Generated by HugPaw • {new Date().toLocaleString()}
            </div>
            </div>

            {/* FOOTER (pinned) */}
            <DialogFooter
            className="
                px-6 py-4 border-t sticky bottom-0 z-20 rounded-xl
                bg-background/80 backdrop-blur
                supports-[backdrop-filter]:bg-background/60
                print:hidden
            "
            >
            <div className="flex gap-2 ml-auto">
                <Button variant="secondary" onClick={() => onOpenChange?.(false)}>
                <X className="mr-2 h-4 w-4" />
                Close
                </Button>
                <Button onClick={onContinue}>Continue shopping</Button>
            </div>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}

/* ——— tiny presentational helpers ——— */
function Panel({ children }) {
    return (
        <div
        className="
            rounded-xl border bg-card text-card-foreground shadow-sm p-4
            print:shadow-none print:border print:rounded-lg
        "
        >
        {children}
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <div className="font-medium mb-2 tracking-tight">
        {children}
        </div>
    );
}

function DL({ children, dense = false }) {
    return (
        <dl
        className={`
            grid grid-cols-[auto,1fr] gap-x-6 ${dense ? "gap-y-1" : "gap-y-2"}
        `}
        >
        {children}
        </dl>
    );
}
function DT({ children, className = "" }) {
    return <dt className={`text-muted-foreground ${className}`}>{children}</dt>;
}
function DD({ children, className = "" }) {
    return <dd className={`text-right ${className}`}>{children}</dd>;
}

/* Status pill with pleasant color mapping */
function StatusPill({ status }) {
    const map = {
        paid: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
        pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        failed: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
        refunded: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
        processing: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
        shipped: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        delivered: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    };
    const klass = map[status?.toLowerCase?.()] || map.paid;

    return (
        <Badge
        variant="outline"
        className={`rounded-full px-3 py-1 text-xs border ${klass} capitalize`}
        >
        {status}
        </Badge>
    );
}

/* Pure-CSS barcode vibe for Order ID (print-friendly) */
function Barcode({ id }) {
    // Render a faux barcode (monospace with tracking)
    if (!id) return null;
    return (
        <div className="grid place-items-end">
        <div
            className="
            px-3 py-2 rounded-md border bg-muted/40
            text-xs font-mono tracking-[0.2em] select-text
            print:bg-white
            "
            aria-label="Order barcode"
            title="Order reference"
        >
            {id.replace(/[^A-Za-z0-9]/g, "").toUpperCase()}
        </div>
        </div>
    );
}

function InfoPanel({ title, children }) {
    return (
        <div className="rounded-2xl border bg-card shadow-sm p-4 ring-1 ring-border/60">
        <div className="flex items-center gap-3 mb-2">
            <div className="h-2.5 w-2.5 rounded-full bg-primary/50" />
            <div className="font-semibold tracking-tight">{title}</div>
        </div>
        <div className="h-px bg-border/60 mb-3" />
        {children}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-1 text-sm leading-6 break-words">{children}</div>
        </div>
    );
}
