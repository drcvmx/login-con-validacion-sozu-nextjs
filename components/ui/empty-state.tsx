"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
        <Icon className="w-12 h-12 text-primary-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button
          variant="outline"
          className="hover:bg-primary/10 hover:text-primary hover:border-primary bg-transparent"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}