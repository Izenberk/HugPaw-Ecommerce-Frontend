export default function NumberField({
    value,
    onChange,
    allowFloat = false,
    className = "",
    ...props
    }) {
    function handleChange(e) {
        let s = e.target.value;
        if (allowFloat) {
        // keep digits and a single dot
        s = s.replace(/[^0-9.]/g, "");
        const parts = s.split(".");
        if (parts.length > 2) s = `${parts[0]}.${parts.slice(1).join("")}`;
        } else {
        s = s.replace(/\D/g, ""); // digits only
        }
        onChange?.(s);
    }

    function handleBlur(e) {
        let s = e.target.value;
        if (allowFloat) {
        if (s === "" || s === ".") s = "0";
        const [i, d = ""] = s.split(".");
        let int = i.replace(/^0+(?=\d)/, "");
        if (int === "") int = "0";
        s = d ? `${int}.${d}` : int;
        } else {
        s = s.replace(/^0+(?=\d)/, ""); // strip leading zeros
        if (s === "") s = "0";
        }
        onChange?.(s);
    }

    return (
        <input
        type="text"
        inputMode={allowFloat ? "decimal" : "numeric"}
        value={value ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        className={className}
        {...props}
        />
    );
}
