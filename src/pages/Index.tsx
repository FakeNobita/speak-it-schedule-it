
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { VoiceInput } from '@/components/VoiceInput';
import { TaskList } from '@/components/TaskList';
import { DashboardStats } from '@/components/DashboardStats';
import { AuthWrapper } from '@/components/AuthWrapper';
import { CheckCircle, Clock, Plus, TrendingUp, Target, Zap } from 'lucide-react';
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
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Enhanced Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Ready to be productive?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user?.firstName || 'there'}</span>! 👋
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your thoughts into actionable tasks with the power of voice
          </p>
        </div>

        {/* Enhanced Dashboard Stats */}
        <div className="mb-12">
          <DashboardStats 
            totalTasks={tasks.length}
            completedTasks={completedTasks.length}
            overdueTasks={overdueTasks.length}
          />
        </div>

        {/* Voice Input Section */}
        <div className="mb-12">
          <VoiceInput 
            onTaskAdd={addTask}
            isListening={isListening}
            setIsListening={setIsListening}
          />
        </div>

        {/* Task Lists with improved styling */}
        <div className="space-y-10">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Pending Tasks
                </h2>
                <div className="px-3 py-1 bg-blue-100 rounded-full">
                  <span className="text-sm font-semibold text-blue-700">{pendingTasks.length}</span>
                </div>
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
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Completed Tasks
                </h2>
                <div className="px-3 py-1 bg-green-100 rounded-full">
                  <span className="text-sm font-semibold text-green-700">{completedTasks.length}</span>
                </div>
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

        {/* Enhanced Empty State */}
        {tasks.length === 0 && (
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-100/30 border-0 shadow-2xl backdrop-blur-sm">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative p-16 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform rotate-3">
                    <Target className="h-16 w-16 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  Ready to get productive?
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  Start by adding your first task above. You can speak it out loud or type it directly - 
                  our AI will help organize your day!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-lg mx-auto">
                  <div className="text-center p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <span className="text-sm font-semibold text-gray-700">Track Progress</span>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <span className="text-sm font-semibold text-gray-700">Set Due Dates</span>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                    <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <span className="text-sm font-semibold text-gray-700">Stay Organized</span>
                  </div>
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
