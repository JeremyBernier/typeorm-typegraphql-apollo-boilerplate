import { Field, ID, ObjectType, Authorized } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import Post from "./Post.entity";
import * as argon2 from "argon2";

@ObjectType()
@Entity()
export default class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ unique: true })
  username: string;

  // @Authorized("ADMIN")
  @Column("text", { nullable: true })
  password?: string;

  // @BeforeInsert()
  // async hashPasswordBeforeInsert() {
  //   console.log("hash bro", this.password);
  //   if (this.password) {
  //     this.password = await argon2.hash(this.password, { hashLength: 12 });
  //   }
  // }

  @Field()
  @Column({ unique: true })
  email: string;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];
}
