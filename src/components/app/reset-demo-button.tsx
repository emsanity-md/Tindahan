"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";

export function ResetDemoButton() {
  const { dispatch } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="shrink-0"
      >
        <RotateCcw className="size-4" />
        <span className="hidden sm:inline">Reset demo data</span>
        <span className="sr-only sm:hidden">Reset demo data</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Reset demo data?</DialogTitle>
            <DialogDescription>
              This clears your current cart and all the changes you have made,
              and restores the original sample catalog and sales history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep my changes</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                dispatch({ type: "reset" });
                setOpen(false);
                toast.success("Demo data reset.");
              }}
            >
              Reset everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
