export type DemoSlotStatus = "available" | "booked" | "blocked";

export type DemoSlot = {
  id: string;
  start: string;
  end: string;
  status: DemoSlotStatus;
  label?: string;
  note?: string;
  remaining?: number;
  capacity?: number;
};

export type DemoFacility = {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  icon: "pool" | "padel" | "gym";
  accentClass: string;
  description: string;
  bookingModel: "exclusive" | "zoned" | "capacity";
  slotIntervalMinutes: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  durationStepMinutes: number;
  maxCapacity: number;
  spaces?: Array<{ code: string; name: string; capacity: number }>;
  rules: string[];
  slots: DemoSlot[];
};

export const mockIncidents = [
  {
    id: "INC-4029",
    title: "Puerta vehicular acceso norte",
    description:
      "La pluma principal tarda en abrir y el sensor no detecta de forma constante.",
    category: "Seguridad",
    priority: "Alta",
    status: "En progreso",
    createdAt: "21 Feb 2026 09:20",
    location: "Caseta norte",
  },
  {
    id: "INC-4030",
    title: "Falla de iluminacion en andador",
    description: "Tres luminarias apagadas en el sendero del edificio de departamentos.",
    category: "Mantenimiento",
    priority: "Media",
    status: "Abierto",
    createdAt: "20 Feb 2026 19:45",
    location: "Andador Torre Encino",
  },
  {
    id: "INC-4031",
    title: "Fuga menor en regaderas alberca",
    description: "Se detecto goteo en la linea de agua caliente en regaderas de vestidores.",
    category: "Mantenimiento",
    priority: "Media",
    status: "Atendido",
    createdAt: "19 Feb 2026 13:10",
    location: "Alberca central",
  },
];

export const mockFacilities: DemoFacility[] = [
  {
    id: "pool-encino",
    name: "Alberca central",
    type: "Amenidad familiar",
    status: "Abierta",
    location: "Zona deportiva",
    icon: "pool",
    accentClass: "from-cyan-500 to-emerald-500",
    description:
      "Reserva por espacios dentro de la alberca. Cada espacio tiene capacidad fija de 15 personas.",
    bookingModel: "zoned",
    slotIntervalMinutes: 30,
    minDurationMinutes: 60,
    maxDurationMinutes: 120,
    durationStepMinutes: 30,
    maxCapacity: 75,
    spaces: [
      { code: "P1", name: "Espacio 1", capacity: 15 },
      { code: "P2", name: "Espacio 2", capacity: 15 },
      { code: "P3", name: "Espacio 3", capacity: 15 },
      { code: "P4", name: "Espacio 4", capacity: 15 },
      { code: "P5", name: "Espacio 5", capacity: 15 },
    ],
    rules: [
      "Reservacion por hora con incrementos cada 30 minutos.",
      "Tiempo maximo por reservacion: 2 horas continuas.",
      "Cada espacio admite 15 personas y no se divide.",
      "Se pueden reservar hasta 5 espacios en paralelo.",
    ],
    slots: [
      { id: "pool-0900", start: "09:00", end: "10:00", status: "available", remaining: 3, capacity: 5 },
      { id: "pool-1000", start: "10:00", end: "11:00", status: "booked", label: "2 espacios restantes", remaining: 2, capacity: 5 },
      { id: "pool-1100", start: "11:00", end: "12:00", status: "available", remaining: 5, capacity: 5 },
      { id: "pool-1200", start: "12:00", end: "13:00", status: "blocked", note: "Mantenimiento", remaining: 0, capacity: 5 },
      { id: "pool-1300", start: "13:00", end: "14:00", status: "available", remaining: 4, capacity: 5 },
    ],
  },
  {
    id: "padel-encino",
    name: "Cancha de padel",
    type: "Deportiva",
    status: "Abierta",
    location: "Corredor deportivo",
    icon: "padel",
    accentClass: "from-orange-500 to-rose-500",
    description: "Reservacion exclusiva por cancha, sin traslapes en el mismo horario.",
    bookingModel: "exclusive",
    slotIntervalMinutes: 30,
    minDurationMinutes: 60,
    maxDurationMinutes: 180,
    durationStepMinutes: 30,
    maxCapacity: 1,
    rules: [
      "Reservacion por hora con incrementos cada 30 minutos.",
      "Tiempo maximo por reservacion: 3 horas continuas.",
      "Uso exclusivo de la cancha por turno confirmado.",
    ],
    slots: [
      { id: "padel-0900", start: "09:00", end: "10:00", status: "available" },
      { id: "padel-1000", start: "10:00", end: "11:30", status: "booked", note: "Bloque privado" },
      { id: "padel-1130", start: "11:30", end: "12:30", status: "available" },
      { id: "padel-1230", start: "12:30", end: "13:30", status: "available" },
      { id: "padel-1330", start: "13:30", end: "14:30", status: "blocked", note: "Torneo interno" },
    ],
  },
  {
    id: "gym-encino",
    name: "Gimnasio",
    type: "Bienestar",
    status: "Abierto",
    location: "Casa club",
    icon: "gym",
    accentClass: "from-indigo-500 to-fuchsia-500",
    description: "Reservacion por bloque de aforo. Capacidad total de 30 personas por horario.",
    bookingModel: "capacity",
    slotIntervalMinutes: 30,
    minDurationMinutes: 60,
    maxDurationMinutes: 60,
    durationStepMinutes: 30,
    maxCapacity: 30,
    rules: [
      "Reservacion por hora con incrementos cada 30 minutos.",
      "Tiempo maximo por reservacion: 1 hora.",
      "Aforo maximo por bloque: 30 personas.",
    ],
    slots: [
      { id: "gym-0600", start: "06:00", end: "07:00", status: "available", remaining: 18, capacity: 30 },
      { id: "gym-0700", start: "07:00", end: "08:00", status: "booked", remaining: 4, capacity: 30, label: "26/30" },
      { id: "gym-0800", start: "08:00", end: "09:00", status: "available", remaining: 12, capacity: 30 },
      { id: "gym-0900", start: "09:00", end: "10:00", status: "available", remaining: 9, capacity: 30 },
      { id: "gym-1000", start: "10:00", end: "11:00", status: "blocked", note: "Clase guiada", remaining: 0, capacity: 30 },
    ],
  },
];

export const mockMyBookings = [
  {
    id: "RES-1001",
    facilityId: "pool-encino",
    facilityName: "Alberca central",
    slot: "09:00 - 10:00",
    date: "Sabado 22 Feb",
    status: "Confirmada",
    detail: "Espacios P2 y P3 (30 personas)",
  },
  {
    id: "RES-1002",
    facilityId: "padel-encino",
    facilityName: "Cancha de padel",
    slot: "11:30 - 13:00",
    date: "Domingo 23 Feb",
    status: "Pendiente",
    detail: "Partida amistosa",
  },
  {
    id: "RES-1003",
    facilityId: "gym-encino",
    facilityName: "Gimnasio",
    slot: "07:00 - 08:00",
    date: "Lunes 24 Feb",
    status: "Confirmada",
    detail: "2 personas",
  },
];

export const mockTransactions = [
  { id: "TX-1", title: "Reserva padel", amount: -350, date: "Hoy, 14:30", status: "Pagado" },
  { id: "TX-2", title: "Recarga", amount: 1500, date: "Ayer, 09:15", status: "Tarjeta" },
  { id: "TX-3", title: "Cuota mensual", amount: -2150, date: "01 Feb 2026", status: "Pagado" },
  { id: "TX-4", title: "Reserva alberca", amount: -500, date: "18 Feb 2026", status: "Pagado" },
];

export const mockAnnouncements = [
  {
    id: "ANN-1",
    title: "Asamblea general de residentes",
    excerpt: "Sesion mensual para presentar avances de seguridad y mantenimiento.",
    tag: "Asamblea",
    image: "/encino/portada.webp",
  },
  {
    id: "ANN-2",
    title: "Nuevo reglamento de alberca",
    excerpt: "Se habilito reservacion por espacios con control de capacidad.",
    tag: "Amenidades",
    image: "/encino/portada.webp",
  },
];
