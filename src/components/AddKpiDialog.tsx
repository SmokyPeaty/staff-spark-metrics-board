
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface AddKpiFormData {
  kraId: string;
  title: string;
  description: string;
  target: string;
  dueDate: string;
}

interface AddKpiDialogProps {
  kras: Array<{ id: string; title: string }>;
  onKpiAdd: (data: AddKpiFormData) => void;
}

export function AddKpiDialog({ kras, onKpiAdd }: AddKpiDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<AddKpiFormData>();
  const selectedKraId = watch('kraId');

  const onSubmit = (data: AddKpiFormData) => {
    onKpiAdd(data);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add KPI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New KPI</DialogTitle>
            <DialogDescription>
              Create a new Key Performance Indicator linked to a KRA
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select KRA</label>
              <Select
                onValueChange={(value) => setValue('kraId', value)}
                value={selectedKraId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a KRA" />
                </SelectTrigger>
                <SelectContent>
                  {kras.map((kra) => (
                    <SelectItem key={kra.id} value={kra.id}>
                      {kra.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                {...register("title", { required: true })}
                placeholder="e.g., Monthly Sales Target"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                {...register("description", { required: true })}
                placeholder="Describe the performance indicator..."
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="target" className="text-sm font-medium">Target</label>
              <Input
                id="target"
                {...register("target", { required: true })}
                placeholder="e.g., $50,000 per month"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
              <Input
                id="dueDate"
                type="date"
                {...register("dueDate", { required: true })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add KPI</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
