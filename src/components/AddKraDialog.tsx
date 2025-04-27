
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { FileText } from "lucide-react";

interface AddKraFormData {
  title: string;
  description: string;
  weightage: number;
}

interface AddKraDialogProps {
  onKraAdd: (data: AddKraFormData) => void;
}

export function AddKraDialog({ onKraAdd }: AddKraDialogProps) {
  const { register, handleSubmit, reset } = useForm<AddKraFormData>();

  const onSubmit = (data: AddKraFormData) => {
    onKraAdd(data);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Add KRA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New KRA</DialogTitle>
            <DialogDescription>
              Create a new Key Result Area to track performance indicators
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                {...register("title", { required: true })}
                placeholder="e.g., Sales Growth"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                {...register("description", { required: true })}
                placeholder="Describe the key result area..."
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="weightage" className="text-sm font-medium">Weightage (%)</label>
              <Input
                id="weightage"
                type="number"
                min="0"
                max="100"
                {...register("weightage", { 
                  required: true,
                  valueAsNumber: true,
                  min: 0,
                  max: 100
                })}
                placeholder="e.g., 30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add KRA</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
