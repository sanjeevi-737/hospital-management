"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { INVOICE_STATUSES } from "@/lib/constants";
import { useInvoice } from "@/hooks/use-billing";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function BillingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;
  const { data: invoice, isLoading } = useInvoice(invoiceId);

  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Invoice Details">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice #{invoice?.invoiceNumber || invoiceId}</CardTitle>
            {invoice && <Badge className={INVOICE_STATUSES[invoice.paymentStatus]?.color || ""}>{invoice.paymentStatus}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoice ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><p className="text-muted-foreground">Patient</p><p className="font-medium">{invoice.patientId}</p></div>
                <div><p className="text-muted-foreground">Date</p><p className="font-medium">{formatDate(invoice.createdAt)}</p></div>
                <div><p className="text-muted-foreground">Total</p><p className="font-medium">{formatCurrency(invoice.netAmount)}</p></div>
              </div>
              {invoice.items && invoice.items.length > 0 && (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b"><th className="text-left p-3">Description</th><th className="text-right p-3">Qty</th><th className="text-right p-3">Price</th><th className="text-right p-3">Total</th></tr></thead>
                    <tbody>
                      {invoice.items.map((item: any) => (
                        <tr key={item.id} className="border-b"><td className="p-3">{item.description}</td><td className="text-right p-3">{item.quantity}</td><td className="text-right p-3">{formatCurrency(item.unitPrice)}</td><td className="text-right p-3">{formatCurrency(item.totalPrice)}</td></tr>
                      ))}
                    </tbody>
                    <tfoot><tr><td className="p-3 font-bold" colSpan={3}>Total</td><td className="text-right p-3 font-bold">{formatCurrency(invoice.netAmount)}</td></tr></tfoot>
                  </table>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-center">Invoice not found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
