import * as React from "react";

const IconChip: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-accent/50 text-primary flex-shrink-0">
    {icon}
  </span>
);

export default IconChip;
