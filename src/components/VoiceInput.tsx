
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Plus, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

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
  const [transcript, setTranscript] = useState('');
  const [parsedTask, setParsedTask] = useState<{
    description: string;
    dueDate?: Date;
  } | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualTask, setManualTask] = useState('');
  const [manualDate, setManualDate] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setTranscript(finalTranscript);
            parseTask(finalTranscript);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast({
            title: "Voice Recognition Error",
            description: "Could not process voice input. Please try again or use manual input.",
            variant: "destructive",
          });
        };
      }
    }
  }, [setIsListening]);

  const parseTask = (text: string) => {
    let description = text.toLowerCase().trim();
    let dueDate: Date | undefined;

    // Simple date parsing patterns
    const datePatterns = [
      { pattern: /tomorrow/i, getDays: () => 1 },
      { pattern: /today/i, getDays: () => 0 },
      { pattern: /next week/i, getDays: () => 7 },
      { pattern: /(\d{1,2})\/(\d{1,2})/g, parseDate: (match: RegExpMatchArray) => {
        const month = parseInt(match[1]) - 1;
        const day = parseInt(match[2]);
        const year = new Date().getFullYear();
        return new Date(year, month, day);
      }},
    ];

    // Check for date patterns
    for (const { pattern, getDays, parseDate } of datePatterns) {
      const match = description.match(pattern);
      if (match) {
        if (getDays) {
          const days = getDays();
          dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + days);
          dueDate.setHours(23, 59, 59, 999);
        } else if (parseDate) {
          dueDate = parseDate(match);
          if (dueDate && dueDate < new Date()) {
            dueDate.setFullYear(dueDate.getFullYear() + 1);
          }
        }
        description = description.replace(pattern, '').trim();
        break;
      }
    }

    // Clean up common phrases
    description = description
      .replace(/^(add|create|new|make|do|task|reminder)/i, '')
      .replace(/^(a|an|the)\s+/i, '')
      .trim();

    // Capitalize first letter
    if (description) {
      description = description.charAt(0).toUpperCase() + description.slice(1);
    }

    setParsedTask({
      description: description || text,
      dueDate,
    });
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setParsedTask(null);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const confirmTask = () => {
    if (parsedTask && parsedTask.description.trim()) {
      onTaskAdd(parsedTask.description, parsedTask.dueDate);
      setTranscript('');
      setParsedTask(null);
      toast({
        title: "Task Added",
        description: `"${parsedTask.description}" has been added to your tasks.`,
      });
    }
  };

  const addManualTask = () => {
    if (manualTask.trim()) {
      const dueDate = manualDate ? new Date(manualDate) : undefined;
      onTaskAdd(manualTask, dueDate);
      setManualTask('');
      setManualDate('');
      setShowManualInput(false);
      toast({
        title: "Task Added",
        description: `"${manualTask}" has been added to your tasks.`,
      });
    }
  };

  const isVoiceSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return (
    <div className="space-y-6">
      {/* Voice Input */}
      {isVoiceSupported ? (
        <div className="space-y-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            size="lg"
            className={cn(
              "w-20 h-20 rounded-full transition-all duration-200",
              isListening 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
            )}
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
          
          <p className="text-sm text-gray-600">
            {isListening ? "Listening... Click to stop" : "Click to start voice input"}
          </p>

          {transcript && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">You said:</p>
              <p className="text-gray-800 italic">"{transcript}"</p>
            </Card>
          )}

          {parsedTask && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Parsed task:</p>
                  <p className="font-medium text-gray-800">{parsedTask.description}</p>
                  {parsedTask.dueDate && (
                    <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      Due: {parsedTask.dueDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={confirmTask} className="bg-green-500 hover:bg-green-600">
                    Add Task
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setTranscript('');
                      setParsedTask(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-gray-600">
            Voice input is not supported in your browser. Please use manual input below.
          </p>
        </Card>
      )}

      {/* Manual Input Toggle */}
      <div className="border-t pt-4">
        <Button
          variant="outline"
          onClick={() => setShowManualInput(!showManualInput)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showManualInput ? 'Hide Manual Input' : 'Add Task Manually'}
        </Button>
      </div>

      {/* Manual Input Form */}
      {showManualInput && (
        <Card className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Description
            </label>
            <Textarea
              value={manualTask}
              onChange={(e) => setManualTask(e.target.value)}
              placeholder="Enter your task description..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date (Optional)
            </label>
            <Input
              type="date"
              value={manualDate}
              onChange={(e) => setManualDate(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={addManualTask} 
            disabled={!manualTask.trim()}
            className="w-full"
          >
            Add Task
          </Button>
        </Card>
      )}
    </div>
  );
};
