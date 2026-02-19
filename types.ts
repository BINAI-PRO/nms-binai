
export type Screen = 'home' | 'incidents' | 'bookings' | 'community' | 'wallet' | 'report' | 'incident-detail' | 'facility-detail' | 'access-qr';

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'Baja' | 'Media' | 'Alta';
  status: 'Abierto' | 'En Progreso' | 'Resuelto' | 'Cerrado';
  createdAt: string;
  isAnonymous: boolean;
  location: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'Disponible' | 'Cierra pronto' | 'Ocupado' | 'Mantenimiento';
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'payment' | 'topup';
  status: string;
  icon: string;
}

export interface Announcement {
  id: string;
  title: string;
  excerpt: string;
  type: 'EVENTO' | 'NOTICIA';
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isMe: boolean;
}

export interface ChatGroup {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  icon: string;
}
