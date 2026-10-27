export interface MGRarity {
  id: 'common' | 'uncommon' | 'rare' | 'epic' | 'event';
  label: string;
  color: string;
}
export const RARITIES: Record<MGRarity['id'], MGRarity> = {
  common: { id: 'common', label: 'Common', color: '#8a8a8a' },
  uncommon: { id: 'uncommon', label: 'Uncommon', color: '#3f9b46' },
  rare: { id: 'rare', label: 'Rare', color: '#2f74d0' },
  epic: { id: 'epic', label: 'Epic', color: '#8a4fc0' },
  event: { id: 'event', label: 'Event Only', color: '#e08a1e' },
};
