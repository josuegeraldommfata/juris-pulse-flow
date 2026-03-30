import { Bot, User } from 'lucide-react';
import { mockConversation } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  leadName: string;
}

export function ConversationModal({ open, onClose, leadName }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg glass-card border-border max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Conversa — {leadName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {mockConversation.map((msg, i) => (
            <div key={i} className={cn('flex gap-3', msg.role === 'assistant' ? '' : 'flex-row-reverse')}>
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                msg.role === 'assistant' ? 'bg-primary/20' : 'bg-accent/20'
              )}>
                {msg.role === 'assistant' ? (
                  <Bot className="h-4 w-4 text-primary" />
                ) : (
                  <User className="h-4 w-4 text-accent" />
                )}
              </div>
              <div className={cn(
                'max-w-[80%] p-3 rounded-2xl text-sm',
                msg.role === 'assistant'
                  ? 'bg-secondary text-foreground rounded-tl-none'
                  : 'bg-primary/10 text-foreground rounded-tr-none'
              )}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
