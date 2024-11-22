import React from 'react';
import SplitPane from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import { Chat } from './components/Chat';
import { CodePreview } from './components/CodePreview';
import { Message, CodeState } from './types';
import { generateCode } from './services/ai';
import { Code, MessageSquare } from 'lucide-react';

function App() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [codeState, setCodeState] = React.useState<CodeState>({
    code: 'function App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;',
    preview: '',
  });
  const [sizes, setSizes] = React.useState([50, 50]);

  const handleSendMessage = async (content: string) => {
    try {
      setIsGenerating(true);
      setMessages(prev => [...prev, { role: 'user', content }]);
      
      const generatedCode = await generateCode(content);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Code generated successfully!' 
      }]);
      
      setCodeState(prev => ({
        ...prev,
        code: generatedCode,
      }));
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error generating the code. Please try again.' 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <div className="h-16 bg-white shadow-sm flex items-center px-6">
        <div className="flex items-center space-x-2 text-blue-600">
          <Code size={24} />
          <h1 className="text-xl font-bold">AI Code Playground</h1>
        </div>
      </div>
      <div className="h-[calc(100vh-4rem)]">
        <SplitPane
          split="vertical"
          sizes={sizes}
          onChange={setSizes}
        >
          <div className="h-full">
            <div className="h-12 bg-white shadow-sm flex items-center px-4 border-b">
              <div className="flex items-center space-x-2 text-gray-600">
                <MessageSquare size={20} />
                <h2 className="font-semibold">Chat</h2>
              </div>
            </div>
            <div className="h-[calc(100%-3rem)]">
              <Chat 
                messages={messages} 
                isGenerating={isGenerating}
                onSendMessage={handleSendMessage} 
              />
            </div>
          </div>
          <div className="h-full">
            <CodePreview 
              codeState={codeState} 
              isGenerating={isGenerating}
            />
          </div>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;