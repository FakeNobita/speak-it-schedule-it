
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { VoiceInput } from '@/components/VoiceInput';
import { TaskList } from '@/components/TaskList';
import { DashboardStats } from '@/components/DashboardStats';
import { AuthWrapper } from '@/components/AuthWrapper';
import { CheckCircle, Clock, Plus, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  userId: string;
}

const Index = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`sayToPlanTasks_${user.id}`);
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(parsedTasks);
      }
    }
  }, [user]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (user && tasks.length >= 0) {
      localStorage.setItem(`sayToPlanTasks_${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const addTask = (description: string, dueDate?: Date) => {
    if (!user) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      description,
      completed: false,
      createdAt: new Date(),
      dueDate,
      userId: user.id,
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
    <AuthWrapper>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.firstName || 'there'}! 👋
          </h2>
          <p className="text-xl text-gray-600">
            What would you like to accomplish today?
          </p>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats 
          totalTasks={tasks.length}
          completedTasks={completedTasks.length}
          overdueTasks={overdueTasks.length}
        />

        {/* Voice Input Section */}
        <div className="mb-8">
          <VoiceInput 
            onTaskAdd={addTask}
            isListening={isListening}
            setIsListening={setIsListening}
          />
        </div>

        {/* Task Lists */}
        <div className="space-y-8">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
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
          )}

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
          <Card className="p-12 text-center bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Ready to get productive?
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Click the microphone above and say your first task, or type it directly!
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Track progress</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Set due dates</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Stay organized</span>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AuthWrapper>
  );
};

export default Index;
