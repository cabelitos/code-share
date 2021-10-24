import { Resolver, Mutation, Query, Authorized, Arg, Ctx } from 'type-graphql';
import { Service, Inject } from 'typedi';

import Interview from '../../types/interview';
import CreateInterviewInput from '../../types/createInterview';
import EndInterviewInput from '../../types/endInterview';
import JoinInterviewInput from '../../types/joinInterview';
import { Permissions } from '../../auth/types';
import InterviewService from '../../services/interview';
import type { ContextData } from '../../context';

@Service()
@Resolver(Interview)
export default class InterviewResolver {
  @Inject()
  private interviewService: InterviewService;

  @Authorized(Permissions.CREATE_INTERVIEW)
  @Mutation(_ => Interview)
  createInterview(
    @Arg('input') input: CreateInterviewInput,
    @Ctx() { authCtx: { email } }: ContextData,
  ): Promise<Interview> {
    return this.interviewService.create(input, email);
  }

  @Authorized(Permissions.END_INTERVIEW)
  @Mutation(_ => Interview)
  async endInterview(
    @Arg('input') input: EndInterviewInput,
    @Ctx() { io }: ContextData,
  ): Promise<Interview> {
    const decodedId = input.decodedInterviewId;
    const r = await this.interviewService.endInterview(input);
    io.in(decodedId).disconnectSockets(true);
    return r;
  }

  @Authorized()
  @Mutation(_ => Interview)
  joinInterview(
    @Arg('input') input: JoinInterviewInput,
    @Ctx() { authCtx }: ContextData,
  ): Promise<Interview> {
    return this.interviewService.joinInterview(input, authCtx);
  }

  @Authorized()
  @Query(_ => Interview, { nullable: true })
  currentInterview(
    @Ctx() { authCtx: { email } }: ContextData,
  ): Promise<Interview | null> {
    return this.interviewService.currentInterview(email);
  }
}
