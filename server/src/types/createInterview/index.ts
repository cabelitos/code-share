import { InputType, Field } from 'type-graphql';
import { IsEmail } from 'class-validator';

@InputType()
export default class CreateInterviewInput {
  @Field()
  @IsEmail()
  interviewee: string;
}
