import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  actionText?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  className
}) => {
  return (
    <div
      className={cn(
        "bg-card/80 backdrop-blur-sm border border-border rounded-lg px-6 py-10 text-center",
        className
      )}
    >
      <div className="space-y-3">
        {Icon && (
          <div className="w-12 h-12 rounded-full bg-islamic-gold/10 mx-auto flex items-center justify-center">
            <Icon className="w-6 h-6 text-islamic-gold" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-islamic-dark">{title}</h3>
        {description && (
          <p className="text-sm text-islamic-dark/70 max-w-md mx-auto">{description}</p>
        )}
      </div>
      {actionText && onAction && (
        <div className="mt-6">
          <Button variant="islamicOutline" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  )
}
