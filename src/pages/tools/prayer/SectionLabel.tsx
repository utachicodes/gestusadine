import * as React from "react";

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
    {children}
  </p>
);

export default SectionLabel;
