export const mockIncidents = [
  {
    id: "4029",
    title: "Ascensor averiado",
    description:
      "El ascensor está atascado en el 3er piso y hace un ruido fuerte. Los botones interiores no responden.",
    category: "Mantenimiento",
    priority: "Alta",
    status: "En progreso",
    createdAt: "19 Oct, 2025 · 10:45",
    location: "Bloque A - Entrada principal",
  },
  {
    id: "4030",
    title: "Reparación AA Gimnasio",
    description: "El aire acondicionado del gimnasio no enfría adecuadamente.",
    category: "Mantenimiento",
    priority: "Media",
    status: "Abierto",
    createdAt: "Hoy · 09:00",
    location: "Sótano 1 - Gimnasio",
  },
];

export const mockFacilities = [
  { id: "1", name: "Pista de Pádel 1", type: "Instalación Deportiva", status: "Disponible", location: "Zona A" },
  { id: "2", name: "Piscina Principal", type: "Área Exterior", status: "Cierra pronto", location: "Centro" },
  { id: "3", name: "Sala Social", type: "Área Común", status: "Ocupado", location: "Planta baja" },
];

export const mockTransactions = [
  { id: "t1", title: "Reserva Padel", amount: -6.5, date: "Hoy, 14:30", status: "Pagado" },
  { id: "t2", title: "Recarga", amount: 500, date: "Ayer, 09:15", status: "Tarjeta" },
  { id: "t3", title: "Cuota mensual", amount: -950, date: "01 Ene 2026", status: "Pagado" },
];

export const mockAnnouncements = [
  {
    id: "a1",
    title: "Fiesta en la piscina",
    excerpt: "Únete a la apertura de verano en la piscina principal. Bebidas incluidas.",
    tag: "Evento",
    image: "https://picsum.photos/seed/pool/900/500",
  },
];
