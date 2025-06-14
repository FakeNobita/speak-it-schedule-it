
import React, { useState } from 'react';
import { Task } from '@/pages/Index';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, description: string, dueDate?: Date) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editDate, setEditDate] = useState(
    task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''
  );

  const handleEdit = () => {
    if (editDescription.trim()) {
      const dueDate = editDate ? new Date(editDate) : undefined;
      onEdit(task.id, editDescription, dueDate);
      setIsEditing(false);
      toast({
        title: "Task Updated",
        description: "Your task has been successfully updated.",
      });
    }
  };

  const handleCancel = () => {
    setEditDescription(task.description);
    setEditDate(task.dueDate ? task.dueDate.toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;
  const isDueToday = task.dueDate && 
    task.dueDate.toDateString() === new Date().toDateString() && !task.completed;

  if (isEditing) {
    return (
      <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md">
        <div className="space-y-3">
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
            className="resize-none"
          />
          <Input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            placeholder="Due date (optional)"
          />
          <div className="flex gap-2">
            <Button onClick={handleEdit} size="sm" className="bg-green-500 hover:bg-green-600">
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "p-4 bg-white/70 backdrop-blur-sm border-0 shadow-md transition-all duration-200 hover:shadow-lg",
      task.completed && "opacity-75",
      isOverdue && "border-l-4 border-red-500",
      isDueToday && "border-l-4 border-yellow-500"
    )}>
      <div className="flex items-start gap-3">
        {/* Completion checkbox */}
        <Button
          onClick={() => onToggle(task.id)}
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-full p-1 mt-1",
            task.completed 
              ? "text-green-600 hover:text-green-700" 
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
            task.completed 
              ? "bg-green-500 border-green-500" 
              : "border-gray-300 hover:border-gray-400"
          )}>
            {task.completed && <Check className="h-3 w-3 text-white" />}
          </div>
        </Button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-gray-800 break-words",
            task.completed && "line-through text-gray-500"
          )}>
            {task.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1",
                isOverdue && "text-red-600 font-medium",
                isDueToday && "text-yellow-600 font-medium"
              )}>
                <Calendar className="h-4 w-4" />
                <span>
                  {isOverdue && "Overdue: "}
                  {isDueToday && "Due today: "}
                  {task.dueDate.toLocaleDateString()}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Created {task.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 ml-2">
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-blue-600"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(task.id)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
