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
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";

@ObjectType()
@Entity()
export default class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  @ValidateIf((user: User) => user.email == null)
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  // @Authorized("ADMIN")
  @Column("text", { nullable: true })
  @IsString()
  @MinLength(8)
  @MaxLength(40)
  password?: string;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await argon2.hash(this.password, { hashLength: 12 });
    }
  }

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  @ValidateIf((user: User) => user.username == null)
  @IsEmail()
  // @IsNotEmpty()
  email?: string;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];

  toJSON() {
    return {
      ...this,
      password: undefined,
      email: undefined,
    };
  }
}
