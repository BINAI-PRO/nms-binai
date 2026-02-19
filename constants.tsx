
import { Incident, Facility, Transaction, Announcement, ChatGroup, ChatMessage } from './types';

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: '4029',
    title: 'Ascensor averiado',
    description: 'El ascensor está atascado en el 3er piso y hace un fuerte ruido de chirrido. Los botones interiores no responden.',
    category: 'Mantenimiento',
    priority: 'Alta',
    status: 'En Progreso',
    createdAt: '19 Oct, 2023 a las 10:45 AM',
    isAnonymous: false,
    location: 'Bloque A - Entrada Principal'
  },
  {
    id: '4030',
    title: 'Reparación AA Gimnasio',
    description: 'El aire acondicionado del gimnasio no enfría adecuadamente.',
    category: 'Mantenimiento',
    priority: 'Media',
    status: 'Abierto',
    createdAt: 'Hoy, 09:00 AM',
    isAnonymous: false,
    location: 'Sótano 1 - Gimnasio'
  }
];

export const MOCK_FACILITIES: Facility[] = [
  { id: '1', name: 'Pista de Pádel 1', type: 'Instalación Deportiva', location: 'Zona A', status: 'Disponible', icon: 'sports_tennis', color: 'blue' },
  { id: '2', name: 'Piscina Principal', type: 'Área Exterior', location: 'Centro', status: 'Cierra pronto', icon: 'pool', color: 'cyan' },
  { id: '3', name: 'Sala Social', type: 'Bloque B', location: 'Planta Baja', status: 'Ocupado', icon: 'weekend', color: 'purple' },
  { id: '4', name: 'Gimnasio', type: 'Complejo Deportivo', location: 'Zona B', status: 'Disponible', icon: 'fitness_center', color: 'orange' },
  { id: '5', name: 'Zona de Barbacoa', type: 'Área de Jardín', location: 'Zona C', status: 'Mantenimiento', icon: 'outdoor_grill', color: 'red' }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', title: 'Reserva de Padel', amount: -6.50, date: 'Hoy, 14:30', type: 'payment', status: 'Pagado', icon: 'sports_tennis' },
  { id: 't2', title: 'Recarga de Cartera', amount: 50.00, date: 'Ayer, 09:15', type: 'topup', status: 'Tarjeta Crédito', icon: 'arrow_downward' },
  { id: 't3', title: 'Cuota Mensual', amount: -45.00, date: 'Jun 01, 2025', type: 'payment', status: 'Pagado', icon: 'home' }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Fiesta en la Piscina 2025',
    excerpt: 'Únete a nosotros para la fiesta anual de apertura de verano en la piscina principal. Bebidas y aperitivos incluidos.',
    type: 'EVENTO',
    imageUrl: 'https://picsum.photos/seed/pool/800/400'
  }
];

export const MOCK_CHAT_GROUPS: ChatGroup[] = [
  { id: 'g1', name: 'General Comunidad', lastMessage: '¿Alguien sabe si el cartero ya pasó?', time: '10:45', unread: 3, icon: 'groups' },
  { id: 'g2', name: 'Deportes y Padel', lastMessage: 'Falta uno para las 18:00 hoy!', time: '09:12', unread: 0, icon: 'sports_tennis' },
  { id: 'g3', name: 'Avisos Admin', lastMessage: 'Recuerden la reunión del lunes.', time: 'Ayer', unread: 1, icon: 'campaign' },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', sender: 'Marta (2B)', avatar: 'https://picsum.photos/seed/marta/100', text: 'Buenos días vecinos, ¿sabéis si hay agua hoy?', time: '09:00', isMe: false },
  { id: 'm2', sender: 'Yo', avatar: 'https://picsum.photos/seed/carlos/100', text: 'Sí Marta, aquí en el 1C todo bien.', time: '09:05', isMe: true },
  { id: 'm3', sender: 'Juan (4A)', avatar: 'https://picsum.photos/seed/juan/100', text: 'Gracias Carlos! Pensaba que era algo general.', time: '09:12', isMe: false },
  { id: 'm4', sender: 'Admin', avatar: 'https://picsum.photos/seed/admin/100', text: 'Confirmamos que no hay cortes programados.', time: '09:30', isMe: false },
];
