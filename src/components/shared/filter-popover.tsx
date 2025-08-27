import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter } from "lucide-react";
import React from "react";

interface FilterPopoverProps {
  children: React.ReactNode;
  filterLabel: string;
}

export function FilterPopover({ children, filterLabel }: FilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          {filterLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filtros</h4>
            <p className="text-sm text-muted-foreground">
              Selecione os filtros a aplicar.
            </p>
          </div>
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
}