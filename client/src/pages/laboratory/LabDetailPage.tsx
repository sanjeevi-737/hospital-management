import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { LAB_ORDER_STATUSES } from "@/lib/constants";
import { useLabOrder } from "@/hooks/use-lab";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function LabDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const labOrderId = params.id as string;
  const { data: labOrder, isLoading } = useLabOrder(labOrderId);

  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-20" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Lab Order Details">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lab Order #{labOrder?.testName || labOrderId}</CardTitle>
            {labOrder && <Badge className={LAB_ORDER_STATUSES[labOrder.status]?.color || ""}>{labOrder.status}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {labOrder ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-muted-foreground">Patient</p><p className="font-medium">{labOrder.patientId}</p></div>
              <div><p className="text-muted-foreground">Test</p><p className="font-medium">{labOrder.testName}</p></div>
              <div><p className="text-muted-foreground">Priority</p><p className="font-medium">{labOrder.priority}</p></div>
              <div><p className="text-muted-foreground">Order Date</p><p className="font-medium">{formatDate(labOrder.createdAt)}</p></div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">Lab order not found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
