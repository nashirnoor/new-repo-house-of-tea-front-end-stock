import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const BarcodeModal = ({ isOpen, onClose, barcodeImage, productName }) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode - ${productName}</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            img { max-width: 100%; max-height: 100%; }
          </style>
        </head>
        <body>
          <img src="${barcodeImage}" alt="Barcode for ${productName}" />
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center mb-5">
            Barcode for {productName}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <img
            src={barcodeImage}
            alt={`Barcode for ${productName}`}
            className="max-w-full"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeModal;
