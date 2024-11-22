export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface CodeState {
  code: string;
  preview?: string;
}

export interface ChatState {
  messages: Message[];
  isGenerating: boolean;
}