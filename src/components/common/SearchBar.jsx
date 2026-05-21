import { Search } from "lucide-react";

function SearchBar({
  value,
  onChange,
  placeholder = "Search employees, posts, documents",
  className = "",
}) {
  return (
    <div className={"relative " + className}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
      />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="input pl-9"
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchBar;
