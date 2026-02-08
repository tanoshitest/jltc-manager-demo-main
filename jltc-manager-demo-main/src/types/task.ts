export type TaskStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'verified' | 'not_started';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Report {
    completedAt: string;
    content: string;
    attachments?: string[];
}

export interface Task {
    id: string;
    title: string;
    description: string;
    assigneeId: string; // Teacher ID or Name
    assigneeName?: string; // Teacher Name (denormalized for display)
    assignerId: string; // Admin ID
    status: TaskStatus;
    priority: TaskPriority;
    startDate?: string; // ISO date
    dueDate: string; // ISO date (EndDate)
    progress?: number; // 0-100
    createdAt: string;
    updatedAt?: string;
    report?: Report;
    notes?: string; // Additional notes
}
