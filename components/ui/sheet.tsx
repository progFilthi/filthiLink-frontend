"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";

import { cn } from "@/lib/utils";
import { RiCloseLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";

function Sheet({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

interface SheetContentProps extends DrawerPrimitive.Popup.Props {
  side?: "left" | "right" | "top" | "bottom";
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: SheetContentProps) {
  const sideVariants = {
    left: "left-0 top-0 h-full w-72 border-r data-open:slide-in-from-left data-closed:slide-out-to-left",
    right:
      "right-0 top-0 h-full w-72 border-l data-open:slide-in-from-right data-closed:slide-out-to-right",
    top: "top-0 left-0 w-full h-32 border-b data-open:slide-in-from-top data-closed:slide-out-to-top",
    bottom:
      "bottom-0 left-0 w-full h-32 border-t data-open:slide-in-from-bottom data-closed:slide-out-to-bottom",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <DrawerPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed z-50 gap-4 bg-background p-6 shadow-lg duration-200 data-open:animate-in data-closed:animate-out",
          sideVariants[side],
          className,
        )}
        {...props}
      >
        {children}
        <DrawerPrimitive.Close
          data-slot="sheet-close"
          render={
            <Button
              variant="ghost"
              className="absolute top-4 right-4"
              size="icon-sm"
            />
          }
        >
          <RiCloseLine />
          <span className="sr-only">Close</span>
        </DrawerPrimitive.Close>
      </DrawerPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SheetFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="sheet-title"
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
