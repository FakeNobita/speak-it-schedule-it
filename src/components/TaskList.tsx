
import React, { useState } from 'react';
import { Task } from '@/pages/Index';
import { TaskItem } from '@/components/TaskItem';
import { Card } from '@/components/ui/card';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, description: string, dueDate?: Date) => void;
  showCompleted?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  showCompleted = false,
}) => {
  if (tasks.length === 0) {
    return (
      <Card className="p-8 text-center bg-white/50 backdrop-blur-sm border-0">
        <p className="text-gray-500">
          {showCompleted ? 'No completed tasks yet' : 'No pending tasks'}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
