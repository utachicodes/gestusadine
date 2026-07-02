import * as React from "react";

interface NaflRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  time: string;
  highlight?: "destructive";
}

const NaflRow: React.FC<NaflRowProps> = ({ icon, title, subtitle, time, highlight }) => {
  const isDestructive = highlight === "destructive";
  return (
    <div
      className={`flex items-center justify-between py-2 px-3 rounded-xl ${
        isDestructive ? "bg-destructive/5 border border-destructive/20" : "hover:bg-secondary/50"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
            isDestructive
              ? "bg-destructive/10 text-destructive"
              : "bg-accent/50 text-primary"
          }`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p
            className={`text-sm font-semibold truncate ${
              isDestructive ? "text-destructive" : "text-foreground"
            }`}
          >
            {title}
          </p>
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        </div>
      </div>
      <span
        className={`text-sm font-bold tabular-nums flex-shrink-0 ml-3 ${
          isDestructive ? "text-destructive" : "text-foreground"
        }`}
      >
        {time}
      </span>
    </div>
  );
};

export default NaflRow;
