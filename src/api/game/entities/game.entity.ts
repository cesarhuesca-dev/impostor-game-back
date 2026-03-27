import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GameDto } from '../dto/game.dto';

@Entity({ name: 'games' })
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  roomName: string;

  @Column({ type: 'text' })
  roomPassword: string;

  @Column({ type: 'numeric' })
  roomPlayers: number;

  @Column({ type: 'bool', default: false })
  customWords: boolean;

  @Column({ type: 'bool', default: false })
  specificCategory: boolean;

  @Column({ type: 'text', nullable: true })
  category: string;

  @Column({ type: 'boolean', default: false })
  multipleImpostors: boolean;

  @Column({ type: 'boolean', default: false })
  overlay: boolean;

  static toPlain(game: Game): GameDto {
    return {
      roomName: game.roomName,
      roomPlayers: game.roomPlayers,
      customWords: game.customWords,
      specificCategory: game.specificCategory,
      category: game.category,
      multipleImpostors: game.multipleImpostors,
      overlay: game.overlay
    };
  }
}
