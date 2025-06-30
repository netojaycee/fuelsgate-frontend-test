export type TDepot = {
  id: string;
  name: string;
  count: number;
  image: string;
}

export const DEPOTS: TDepot[] = [
  {
    id: '1',
    name: 'Lagos',
    count: 57,
    image: '/depots/lagos.jpeg',
  },
  {
    id: '2',
    name: 'Port Harcourt',
    count: 15,
    image: '/depots/port-harcourt.jpeg',
  },
  {
    id: '3',
    name: 'Calabar',
    count: 32,
    image: '/depots/calabar.jpeg',
  },
  {
    id: '4',
    name: 'Warri',
    count: 8,
    image: '/depots/warri.jpeg',
  },
  {
    id: '5',
    name: 'Oghara',
    count: 5,
    image: '/depots/oghara.jpeg',
  },
  {
    id: '5',
    name: 'Koko',
    count: 5,
    image: '/depots/koko.jpeg',
  }
]