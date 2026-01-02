import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";

const DAYS = [
  { value: "T2", label: "Thứ 2" },
  { value: "T3", label: "Thứ 3" },
  { value: "T4", label: "Thứ 4" },
  { value: "T5", label: "Thứ 5" },
  { value: "T6", label: "Thứ 6" },
  { value: "T7", label: "Thứ 7" },
  { value: "CN", label: "Chủ nhật" },
];

const TIME_SLOTS = [
  { value: "1", label: "Tiết 1 (08:00-09:00)" },
  { value: "2", label: "Tiết 2 (09:00-10:00)" },
  { value: "3", label: "Tiết 3 (10:30-11:30)" },
  { value: "4", label: "Tiết 4 (13:00-14:00)" },
  { value: "5", label: "Tiết 5 (14:15-15:15)" },
  { value: "6", label: "Tiết 6 (15:30-16:30)" },
  { value: "7", label: "Tiết 7 (18:00-19:00)" },
  { value: "8", label: "Tiết 8 (19:15-20:15)" },
  { value: "9", label: "Tiết 9 (20:30-21:30)" },
];

interface ScheduleEntry {
  id: string;
  day: string;
  slot: string;
}

interface ScheduleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// Parse schedule string to entries
const parseSchedule = (scheduleStr: string): ScheduleEntry[] => {
  if (!scheduleStr) return [{ id: crypto.randomUUID(), day: "", slot: "" }];
  
  const entries: ScheduleEntry[] = [];
  // Format: "T2 - Tiết 3, T3 - Tiết 5" or "T2, T4, T6 - Tiết 1"
  const parts = scheduleStr.split(",").map((s) => s.trim());
  
  for (const part of parts) {
    const match = part.match(/^(T[2-7]|CN)\s*-?\s*Tiết\s*(\d+)$/i);
    if (match) {
      entries.push({ id: crypto.randomUUID(), day: match[1], slot: match[2] });
    } else {
      // Try to parse older format like "T2, T4, T6 - Tiết 1"
      const oldMatch = scheduleStr.match(/^((?:T[2-7]|CN)(?:\s*,\s*(?:T[2-7]|CN))*)\s*-\s*Tiết\s*(\d+)$/i);
      if (oldMatch) {
        const days = oldMatch[1].split(",").map((d) => d.trim());
        const slot = oldMatch[2];
        return days.map((day) => ({ id: crypto.randomUUID(), day, slot }));
      }
    }
  }
  
  // Always have at least one empty row
  if (entries.length === 0) {
    return [{ id: crypto.randomUUID(), day: "", slot: "" }];
  }
  
  return entries;
};

// Convert entries to schedule string (only complete entries)
const entriesToString = (entries: ScheduleEntry[]): string => {
  const completeEntries = entries.filter((e) => e.day && e.slot);
  if (completeEntries.length === 0) return "";
  return completeEntries.map((e) => `${e.day} - Tiết ${e.slot}`).join(", ");
};

const ScheduleSelector = ({ value, onChange }: ScheduleSelectorProps) => {
  const [entries, setEntries] = useState<ScheduleEntry[]>(() => parseSchedule(value));

  useEffect(() => {
    const newEntries = parseSchedule(value);
    // Only update if the actual schedule value changed (ignoring empty rows)
    const currentValue = entriesToString(entries);
    if (value !== currentValue && value) {
      setEntries(newEntries);
    }
  }, [value]);

  const updateEntry = (id: string, field: "day" | "slot", fieldValue: string) => {
    const newEntries = entries.map((e) =>
      e.id === id ? { ...e, [field]: fieldValue } : e
    );
    setEntries(newEntries);
    onChange(entriesToString(newEntries));
  };

  const addEntry = () => {
    const newEntries = [...entries, { id: crypto.randomUUID(), day: "", slot: "" }];
    setEntries(newEntries);
  };

  const removeEntry = (id: string) => {
    if (entries.length <= 1) {
      // Don't remove last entry, just clear it
      const newEntries = [{ id: crypto.randomUUID(), day: "", slot: "" }];
      setEntries(newEntries);
      onChange("");
      return;
    }
    const newEntries = entries.filter((e) => e.id !== id);
    setEntries(newEntries);
    onChange(entriesToString(newEntries));
  };

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div key={entry.id} className="flex gap-2 items-center">
          <div className="flex-1">
            <Select
              value={entry.day}
              onValueChange={(val) => updateEntry(entry.id, "day", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn ngày" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select
              value={entry.slot}
              onValueChange={(val) => updateEntry(entry.id, "slot", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tiết" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {index === entries.length - 1 ? (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={addEntry}
              disabled={!entry.day || !entry.slot}
            >
              <Plus className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => removeEntry(entry.id)}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScheduleSelector;
