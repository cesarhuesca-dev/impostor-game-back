export interface GameDto {
  id?: string;
  roomName: string;
  roomPassword?: string;
  roomPlayers: number;
  customWords: boolean;
  specificCategory: boolean;
  category: string;
  multipleImpostors: boolean;
  overlay: boolean;
}
