import { IsString } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User.entity";

@ObjectType()
@Entity()
export default class Post {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  // @IsString()
  content: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  // @IsString()
  html?: string;

  @Field((type) => Boolean, { nullable: true })
  @Column({ type: "bool", default: false, nullable: true })
  // @IsString()
  public?: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  // @Field(() => User)
  // @ManyToOne(() => User, (user) => user.posts)
  // user: User;

  // @Field()
  // @Column()
  // userId: string;
}
