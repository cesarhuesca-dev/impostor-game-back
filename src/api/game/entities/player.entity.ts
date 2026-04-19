import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PlayerDto } from '../dto';
import { Game } from './game.entity';
import { UserRoles } from 'src/core/enum/roles.enum';

@Entity({ name: 'player' })
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'boolean', default: false })
  host!: boolean;

  @Column({ type: 'boolean', default: false })
  avatarImg!: boolean;

  @Column({ type: 'boolean', default: false })
  impostor!: boolean;

  @Column({
    type: 'enum',
    array: true,
    enum: UserRoles,
    default: [UserRoles.PLAYER],
  })
  roles!: UserRoles[];

  @ManyToOne(() => Game, (game) => game.player, { eager: true, cascade: true, onDelete: 'CASCADE' })
  game!: Game;

  static toPlain(player: Player, gameInfo: boolean = true): PlayerDto {
    const obj: PlayerDto = {
      id: player.id,
      name: player.name,
      host: player.host,
      avatarImg: player.avatarImg,
      impostor: player.impostor,
      roles: player.roles,
    };

    if (gameInfo) {
      obj.game = Game.toPlain(player.game);
    }

    return obj;
  }
}
