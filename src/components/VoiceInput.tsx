
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Plus, Calendar, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface VoiceInputProps {
  onTaskAdd: (description: string, dueDate?: Date) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTaskAdd,
  isListening,
  setIsListening,
}) => {
  const [inputText, setInputText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = () => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
      
      // Auto-parse due dates from speech
      const dateMatch = transcript.match(/(?:by|due|on|at) (tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}\/\d{1,2})/i);
      if (dateMatch) {
        const dateStr = dateMatch[1].toLowerCase();
        if (dateStr === 'today') {
          setDueDate(new Date().toISOString().split('T')[0]);
        } else if (dateStr === 'tomorrow') {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          setDueDate(tomorrow.toISOString().split('T')[0]);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
      onTaskAdd(inputText.trim(), parsedDueDate);
      setInputText('');
      setDueDate('');
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-indigo-100/50 border-0 shadow-2xl backdrop-blur-sm">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Add New Task</h3>
            <p className="text-sm text-gray-600">Speak or type your task</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="What would you like to accomplish today?"
              className="text-lg py-4 px-6 border-0 bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all duration-300"
            />
            <Button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`absolute right-2 top-2 h-12 w-12 rounded-xl transition-all duration-300 ${
                isListening 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse shadow-lg shadow-red-500/25' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25'
              }`}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date (Optional)
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="py-3 px-4 border-0 bg-white/70 backdrop-blur-sm shadow-lg rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all duration-300"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3 font-semibold text-white rounded-xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Task
            </Button>
          </div>
        </form>
        
        {isListening && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/10 backdrop-blur-sm rounded-2xl border border-red-200/50">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-red-700 font-medium">Listening... Speak now!</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
