import { RefreshToken } from '@/auth/refresh-token/refresh-token.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => RefreshToken, (jwt) => jwt.user)
  tokens: Promise<RefreshToken[]>;
}
