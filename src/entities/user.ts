import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  name: string;
  @Field(() => String, { nullable: true })
  email?: string | null;
  @Field(() => String, { nullable: true })
  picture: string;
  @Field()
  id: string;
  @Field(() => String, { nullable: true })
  googleId: string | null;
  @Field(() => String, { nullable: true })
  twitterAccessToken: string | null;
  @Field(() => String, { nullable: true })
  twitterId: string | null;
}
