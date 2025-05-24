import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Script {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  language: string; // 'python' o 'javascript'

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}