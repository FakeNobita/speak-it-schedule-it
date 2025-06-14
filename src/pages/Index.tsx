
import React, { useState, useEffect } from 'react';
import { VoiceInput } from '@/components/VoiceInput';
import { TaskList } from '@/components/TaskList';
import { DashboardStats } from '@/components/DashboardStats';
import { Mic, CheckCircle, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('sayToPlanTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
      setTasks(parsedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('sayToPlanTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (description: string, dueDate?: Date) => {
    const newTask: Task = {
      id: Date.now().toString(),
      description,
      completed: false,
      createdAt: new Date(),
      dueDate,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const editTask = (id: string, description: string, dueDate?: Date) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, description, dueDate } : task
    ));
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate && task.dueDate < new Date()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Mic className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Say to Plan</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Organize your day with your voice. Simply speak your tasks and let us handle the rest.
          </p>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats 
          totalTasks={tasks.length}
          completedTasks={completedTasks.length}
          overdueTasks={overdueTasks.length}
        />

        {/* Voice Input Section */}
        <Card className="p-8 mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Add New Task
            </h2>
            <VoiceInput 
              onTaskAdd={addTask}
              isListening={isListening}
              setIsListening={setIsListening}
            />
          </div>
        </Card>

        {/* Task Lists */}
        <div className="space-y-8">
          {/* Pending Tasks */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                Pending Tasks ({pendingTasks.length})
              </h2>
            </div>
            <TaskList 
              tasks={pendingTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Completed Tasks ({completedTasks.length})
                </h2>
              </div>
              <TaskList 
                tasks={completedTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
                showCompleted
              />
            </div>
          )}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <Card className="p-12 text-center bg-white/50 backdrop-blur-sm border-0">
            <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-500">
              Click the microphone above and say your first task!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
