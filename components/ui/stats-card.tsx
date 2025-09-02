"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  valueColor: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  gradientFrom,
  gradientTo,
  valueColor,
}: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 ${iconColor} rounded-lg`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueColor} mb-1`}>
          {value}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <span>{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  );
}