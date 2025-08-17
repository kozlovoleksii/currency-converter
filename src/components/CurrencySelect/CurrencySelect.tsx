import Select, { type SingleValue, type StylesConfig } from "react-select";
import { useMemo } from "react";

type Opt = { value: string; label: string };

export function CurrencySelect({
  value,
  options,
  onChange,
}: {
  value: string;                               
  options: string[];                           
  onChange: (next: string) => void;             
}) {

  const opts: Opt[] = useMemo(
    () => options.map((c) => ({ value: c, label: c })),
    [options]
  );


  const styles: StylesConfig<Opt, false> = {
    control: (b, s) => ({
      ...b,
      minHeight: 44,
      borderRadius: 10,
      borderColor: s.isFocused ? "#3b82f6" : "#e5e7eb",
      boxShadow: s.isFocused ? "0 0 0 3px rgba(59,130,246,.15)" : "none",
      "&:hover": { borderColor: s.isFocused ? "#3b82f6" : "#d1d5db" },
      cursor: "pointer",
    }),
    menu: (b) => ({ ...b, borderRadius: 10, zIndex: 50 }),
    option: (b, s) => ({
      ...b,
      padding: "8px 12px",
      backgroundColor: s.isFocused ? "#f1f5f9" : "#fff",
      color: "#111827",
      cursor: "pointer",
    }),
  };

  return (
    <Select
      styles={styles}
      options={opts}
      value={opts.find((o) => o.value === value) ?? null}
      onChange={(opt: SingleValue<Opt>) => opt && onChange(opt.value)} 
      isSearchable
      menuPlacement="auto"
      menuPortalTarget={document.body}
    />
  );
}

export default CurrencySelect;
