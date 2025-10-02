import { User } from '@/users/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  RelationId,
} from 'typeorm';

@ObjectType()
@Entity()
export class RefreshToken {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user: Promise<User>;

  @Column()
  @RelationId((refreshToken: RefreshToken) => refreshToken.user)
  userId: string;

  @Column({ select: false })
  token: string;

  @Field(() => Boolean)
  @Column({ default: false })
  revoked: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @Column()
  expiresAt: Date;
}
