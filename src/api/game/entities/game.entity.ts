import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GameDto } from '../dto/game.dto';
import { Player } from './player.entity';

@Entity({ name: 'games' })
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  roomName: string;

  @Column({ type: 'text' })
  roomPassword: string;

  @Column({ type: 'integer', default : 4 })
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

  //ESTDOS PARA CONTROL DE LA SALA

  @Column({ type: 'integer', default : 0 })
  roomPlayersJoined: number;

  @Column({ type: 'integer', default : 0 })
  round: number;

  @Column({ type: 'bool', default : false })
  isShowingWord: boolean;
  
  @Column({ type: 'bool', default : false })
  isShowingImpostor: boolean;

  @Column({ type: 'bool', default : false })
  isGameStarted: boolean;

  @OneToMany(() => Player, player => player.game)
  player: Player

  static toPlain(game: Game): GameDto {
    return {
      id: game.id,
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
