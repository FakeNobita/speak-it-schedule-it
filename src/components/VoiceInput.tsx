
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Plus, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface VoiceInputProps {
  onTaskAdd: (description: string, dueDate?: Date) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

// Extend the Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
  }
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
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
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="What would you like to do? (or click the mic to speak)"
              className="text-lg py-3 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`px-6 py-3 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date (Optional)
            </label>
            <div className="relative">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={!inputText.trim()}
            className="bg-green-500 hover:bg-green-600 px-8 py-3 font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </form>
      
      {isListening && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-red-600 font-medium">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            Listening... Speak now!
          </div>
        </div>
      )}
    </Card>
  );
};
