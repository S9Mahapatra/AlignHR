"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { apiPost } from "@/lib/api";

const leaveSchema = z
  .object({
    leaveType: z.enum(["CASUAL", "SICK", "EARNED", "UNPAID"], {
      required_error: "Leave type is required",
    }),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().min(1, "Reason is required").max(500, "Max 500 characters"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

type LeaveFormData = z.infer<typeof leaveSchema>;

interface LeaveFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  token: string | undefined;
}

export function LeaveForm({ onSuccess, onCancel, token }: LeaveFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leaveType: undefined,
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const leaveType = watch("leaveType");

  const onSubmit = async (data: LeaveFormData) => {
    if (!token) return;
    setIsSubmitting(true);

    try {
      await apiPost("/api/leaves", data, token);
      toast.success("Leave application submitted successfully!");
      onSuccess();
    } catch {
      toast.error("Failed to submit leave application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Leave Type */}
      <div className="space-y-2">
        <Label className="text-slate-300">
          Leave Type <span className="text-rose-500">*</span>
        </Label>
        <Select
          value={leaveType}
          onValueChange={(val) =>
            setValue("leaveType", val as LeaveFormData["leaveType"])
          }
        >
          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10">
            <SelectItem value="CASUAL">Casual Leave</SelectItem>
            <SelectItem value="SICK">Sick Leave</SelectItem>
            <SelectItem value="EARNED">Earned Leave</SelectItem>
            <SelectItem value="UNPAID">Unpaid Leave</SelectItem>
          </SelectContent>
        </Select>
        {errors.leaveType && (
          <p className="text-xs text-rose-400">{errors.leaveType.message}</p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-slate-300">
            Start Date <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="startDate"
            type="date"
            {...register("startDate")}
            className="bg-slate-800/50 border-slate-700 text-white [color-scheme:dark]"
          />
          {errors.startDate && (
            <p className="text-xs text-rose-400">{errors.startDate.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-slate-300">
            End Date <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="endDate"
            type="date"
            {...register("endDate")}
            className="bg-slate-800/50 border-slate-700 text-white [color-scheme:dark]"
          />
          {errors.endDate && (
            <p className="text-xs text-rose-400">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <Label htmlFor="reason" className="text-slate-300">
          Reason <span className="text-rose-500">*</span>
        </Label>
        <Textarea
          id="reason"
          {...register("reason")}
          placeholder="Briefly describe the reason for your leave..."
          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
        />
        {errors.reason && (
          <p className="text-xs text-rose-400">{errors.reason.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/10 text-slate-300 hover:bg-white/5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  );
}
