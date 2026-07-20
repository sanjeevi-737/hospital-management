import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import type { Medicine } from "@/types";

interface StockAlertProps {
  medicines: Medicine[];
}

export function StockAlert({ medicines }: StockAlertProps) {
  const lowStock = medicines.filter((m) => m.quantity <= m.minStockLevel);
  const criticalStock = lowStock.filter((m) => m.quantity < m.minStockLevel * 0.5);

  if (lowStock.length === 0) {
    return (
      <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <span className="text-sm">✓</span>
            </div>
            <p className="text-sm font-medium">All medicines are well-stocked</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4" />
          Low Stock Alert ({lowStock.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {lowStock.slice(0, 5).map((med) => (
            <div key={med.id} className="flex items-center justify-between text-sm">
              <span>{med.name} ({med.strength})</span>
              <Badge
                variant={criticalStock.includes(med) ? "destructive" : "warning" as any}
              >
                {med.quantity} left
              </Badge>
            </div>
          ))}
          {lowStock.length > 5 && (
            <p className="text-xs text-muted-foreground">+{lowStock.length - 5} more items</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
