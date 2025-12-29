import React from "react";
import { motion, LayoutGroup } from "framer-motion";

type LanguageCode = "wo" | "fr" | "en";

interface LanguageToggleProps {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
}

const labels: Record<LanguageCode, string> = {
  wo: "Wolof",
  fr: "Français",
  en: "English",
};

const LanguageToggle: React.FC<LanguageToggleProps> = ({ value, onChange }) => {
  const items: LanguageCode[] = ["wo", "fr", "en"];

  return (
    <div className="inline-flex items-center rounded-full bg-[#efefec]/70 backdrop-blur-md border border-sand-300/70 px-1 py-1 shadow-card">
      <LayoutGroup>
        {items.map((code) => {
          const selected = code === value;
          return (
            <button
              key={code}
              type="button"
              onClick={() => onChange(code)}
              className="relative px-3 py-1.5 text-xs md:text-sm font-medium text-ink-soft"
            >
              {selected && (
                <motion.span
                  layoutId="language-pill"
                  className="absolute inset-0 rounded-full bg-accent-soft/90"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 mix-blend-multiply">
                {labels[code]}
              </span>
            </button>
          );
        })}
      </LayoutGroup>
    </div>
  );
};

export default LanguageToggle;


