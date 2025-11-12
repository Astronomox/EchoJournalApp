"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface JournalEditorProps {
  onSubmit: (content: string) => Promise<void>;
  initialContent?: string;
  isSubmitting?: boolean;
}

export function JournalEditor({ onSubmit, initialContent = '', isSubmitting = false }: JournalEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isRecording, setIsRecording] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setContent(prev => prev + finalTranscript);
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech') {
            setSpeechError("No speech was detected. Please try again.");
        } else if (event.error === 'audio-capture') {
            setSpeechError("Audio capture failed. Please check your microphone permissions.");
        } else if (event.error === 'not-allowed') {
            setSpeechError("Microphone access was denied. Please allow microphone access in your browser settings.");
        } else {
            setSpeechError("An error occurred with speech recognition.");
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
        setSpeechError("Speech recognition is not supported by your browser.");
        return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setSpeechError(null);
      setContent(prev => prev ? prev + ' ' : '');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(content.trim()) {
        onSubmit(content.trim());
    }
  };

  return (
    <Card className="w-full glassmorphism">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? You can type or use your voice."
            rows={15}
            className="w-full text-base"
            disabled={isSubmitting}
          />
          {speechError && <p className="text-sm text-destructive">{speechError}</p>}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" size="icon" onClick={toggleRecording} disabled={!recognitionRef.current || isSubmitting}>
              {isRecording ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4" />}
              <span className="sr-only">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </Button>
            <Button type="submit" disabled={!content.trim() || isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
