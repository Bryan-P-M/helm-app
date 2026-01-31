"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toCSV, downloadCSV } from "@/lib/utils/csv-export";
import { toast } from "sonner";

interface ExportCSVButtonProps {
  data: Record<string, any>[];
  columns: { key: string; header: string }[];
  filename: string;
  variant?: "outline" | "default" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
}

export default function ExportCSVButton({
  data,
  columns,
  filename,
  variant = "outline",
  size = "sm",
  label = "Export CSV",
}: ExportCSVButtonProps) {
  const handleExport = () => {
    if (!data.length) {
      toast.error("No data to export");
      return;
    }
    const csv = toCSV(data, columns);
    downloadCSV(csv, filename);
    toast.success(`Exported ${data.length} rows`);
  };

  return (
    <Button variant={variant} size={size} onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
