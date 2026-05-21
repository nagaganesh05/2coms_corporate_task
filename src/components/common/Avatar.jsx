import { avatarGradient, initials, cn } from "../../lib/utils";

const sizes = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
  "2xl": "w-28 h-28 text-3xl",
};

function Avatar({ name = "?", size = "md", className = "", ring = false }) {
  const grad = avatarGradient(name);
  return (
    <div
      className={cn(
        "rounded-full inline-flex items-center justify-center font-semibold text-white shrink-0 select-none bg-gradient-to-br",
        grad,
        sizes[size],
        ring && "ring-2 ring-white dark:ring-ink-900 shadow-sm",
        className,
      )}
      aria-label={name}
      title={name}
    >
      {initials(name)}
    </div>
  );
}

export default Avatar;
