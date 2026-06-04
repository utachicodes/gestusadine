import * as React from 'react';

interface PageHeaderProps {
  /** Small uppercase, letter-spaced label shown above the title (with a leading dot). */
  eyebrow?: React.ReactNode;
  /** Main page title. */
  title: React.ReactNode;
  /** Optional supporting line under the title. */
  subtitle?: React.ReactNode;
  /** Optional right-aligned actions (buttons, filters) rendered alongside the title on desktop. */
  actions?: React.ReactNode;
  /** Extra classes for the outer <header>. */
  className?: string;
}

/**
 * Canonical page header used across the app so every page shares the same
 * font, size, and structure. Sans-bold title, muted eyebrow + subtitle, all
 * via semantic theme tokens (no dark: variants, no hardcoded brand colors).
 */
export function PageHeader({ eyebrow, title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <header
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4${className ? ` ${className}` : ''}`}
    >
      <div>
        {eyebrow && (
          <p className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}

export default PageHeader;
