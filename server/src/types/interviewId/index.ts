import { InputType, Field } from 'type-graphql';
import { IsNotEmpty } from 'class-validator';

export const decodeId = (str: string): string =>
  Buffer.from(str, 'base64').toString('utf-8').split(':')[1];

@InputType()
export default class InterviewIdInput {
  @Field()
  @IsNotEmpty()
  interviewId: string;

  get decodedInterviewId(): string {
    return decodeId(this.interviewId);
  }
}
