import { createContext, useCallback, useContext, useState } from 'react';
import type { SpecialistId } from '@/components/dashboard/SpecialistChatModal';

interface SpecialistChatContextType {
  specialistId: SpecialistId;
  isOpen: boolean;
  openChat: (id?: SpecialistId) => void;
  closeChat: () => void;
}

const SpecialistChatContext = createContext<SpecialistChatContextType | null>(null);

export function SpecialistChatProvider({ children }: { children: React.ReactNode }) {
  const [specialistId, setSpecialistId] = useState<SpecialistId>('civil');
  const [isOpen, setIsOpen] = useState(false);

  const openChat = useCallback((id?: SpecialistId) => {
    if (id) setSpecialistId(id);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);

  return (
    <SpecialistChatContext.Provider value={{ specialistId, isOpen, openChat, closeChat }}>
      {children}
    </SpecialistChatContext.Provider>
  );
}

export function useSpecialistChat() {
  const ctx = useContext(SpecialistChatContext);
  if (!ctx) {
    throw new Error('useSpecialistChat must be used within SpecialistChatProvider');
  }
  return ctx;
}
