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

const SUBJECTS = [
  { value: "tong_hop", label: "Tổng hợp" },
  { value: "kanji", label: "Kanji" },
  { value: "hoi_thoai", label: "Hội thoại" },
  { value: "ngu_phap", label: "Ngữ pháp" },
  { value: "nghe", label: "Nghe" },
  { value: "doc", label: "Đọc" },
];

interface TeacherEntry {
  id: string;
  teacher: string;
  subject: string;
}

interface TeacherSelectorProps {
  value: string;
  onChange: (value: string) => void;
  teachers: string[];
}

// Parse teacher string to entries
// Format: "Yamada (Tổng hợp), Sato (Kanji)"
const parseTeachers = (teacherStr: string): TeacherEntry[] => {
  if (!teacherStr) return [{ id: crypto.randomUUID(), teacher: "", subject: "" }];
  
  const entries: TeacherEntry[] = [];
  const parts = teacherStr.split(",").map((s) => s.trim());
  
  for (const part of parts) {
    const match = part.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      const teacherName = match[1].trim();
      const subjectLabel = match[2].trim();
      const subject = SUBJECTS.find((s) => s.label === subjectLabel)?.value || "";
      entries.push({ id: crypto.randomUUID(), teacher: teacherName, subject });
    } else if (part) {
      // Just teacher name without subject
      entries.push({ id: crypto.randomUUID(), teacher: part, subject: "" });
    }
  }
  
  if (entries.length === 0) {
    return [{ id: crypto.randomUUID(), teacher: "", subject: "" }];
  }
  
  return entries;
};

// Convert entries to teacher string
const entriesToString = (entries: TeacherEntry[]): string => {
  const completeEntries = entries.filter((e) => e.teacher && e.subject);
  if (completeEntries.length === 0) return "";
  return completeEntries
    .map((e) => {
      const subjectLabel = SUBJECTS.find((s) => s.value === e.subject)?.label || e.subject;
      return `${e.teacher} (${subjectLabel})`;
    })
    .join(", ");
};

const TeacherSelector = ({ value, onChange, teachers }: TeacherSelectorProps) => {
  const [entries, setEntries] = useState<TeacherEntry[]>(() => parseTeachers(value));

  useEffect(() => {
    const currentValue = entriesToString(entries);
    if (value !== currentValue && value) {
      setEntries(parseTeachers(value));
    }
  }, [value]);

  const updateEntry = (id: string, field: "teacher" | "subject", fieldValue: string) => {
    const newEntries = entries.map((e) =>
      e.id === id ? { ...e, [field]: fieldValue } : e
    );
    setEntries(newEntries);
    onChange(entriesToString(newEntries));
  };

  const addEntry = () => {
    const newEntries = [...entries, { id: crypto.randomUUID(), teacher: "", subject: "" }];
    setEntries(newEntries);
  };

  const removeEntry = (id: string) => {
    if (entries.length <= 1) {
      const newEntries = [{ id: crypto.randomUUID(), teacher: "", subject: "" }];
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
              value={entry.teacher}
              onValueChange={(val) => updateEntry(entry.id, "teacher", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giáo viên" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher} value={teacher}>
                    {teacher}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select
              value={entry.subject}
              onValueChange={(val) => updateEntry(entry.id, "subject", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn môn" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
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
              disabled={!entry.teacher || !entry.subject}
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

export default TeacherSelector;
