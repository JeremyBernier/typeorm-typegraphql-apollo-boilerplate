import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
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
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Field()
  @Column()
  userId: string;
}
