import { Service } from 'typedi';
import {
  IsNull,
  getManager,
  EntityManager,
  InsertResult,
  FindOperator,
} from 'typeorm';

import Interview from '../types/interview';
import CreateInterviewInput from '../types/createInterview';
import EndInterviewInput from '../types/endInterview';
import JoinInterviewInput from '../types/joinInterview';
import InterviewParticipant from '../types/interviewParticipant';
import InterviewDiff from '../types/interviewDiff';
import type { AuthContext } from '../auth/types';
import { Permissions } from '../auth/types';

const wrapInTransaction =
  <TResult, TArgs extends Array<unknown> = unknown[]>(
    func: (m: EntityManager, ...args: TArgs) => Promise<TResult>,
  ) =>
  (...args: TArgs): Promise<TResult> =>
    getManager().transaction(
      (manager: EntityManager): Promise<TResult> => func(manager, ...args),
    );

@Service()
export default class InterviewService {
  createInterviewParticipant(
    manager: EntityManager,
    interviewId: string,
    user: string,
  ): Promise<InsertResult> {
    return manager
      .createQueryBuilder()
      .insert()
      .orIgnore()
      .into(InterviewParticipant)
      .values(manager.create(InterviewParticipant, { user, interviewId }))
      .updateEntity(false)
      .execute();
  }

  create = wrapInTransaction(
    async (
      manager: EntityManager,
      input: CreateInterviewInput,
      createdBy: string,
    ): Promise<Interview> => {
      const interview = await manager.save(
        Interview,
        manager.create(Interview, { ...input, createdBy }),
      );
      await this.createInterviewParticipant(manager, interview._id, createdBy);
      return interview;
    },
  );

  joinInterview = wrapInTransaction(
    async (
      manager: EntityManager,
      input: JoinInterviewInput,
      { email, permissions }: AuthContext,
    ): Promise<Interview> => {
      const id = input.decodedInterviewId;
      const findArgs: {
        _id: string;
        interviewee?: string;
        endedAt: FindOperator<Date>;
      } = {
        _id: id,
        endedAt: IsNull(),
      };
      if (!permissions.has(Permissions.JOIN_INTERVIEW)) {
        findArgs.interviewee = email;
      }
      const interview = await manager.findOneOrFail(Interview, findArgs);
      await this.createInterviewParticipant(manager, id, email);
      return interview;
    },
  );

  async endInterview(endInput: EndInterviewInput): Promise<Interview> {
    const manager = getManager();
    const decodedId = endInput.decodedInterviewId;
    const r = await manager.update(
      Interview,
      { _id: decodedId, endedAt: IsNull() },
      { endedAt: new Date() },
    );
    if (r.affected !== 1) {
      throw new Error(
        `Could not end the interview with id ${endInput.interviewId}`,
      );
    }
    return manager.findOneOrFail(Interview, { _id: decodedId });
  }

  currentInterview(user: string): Promise<Interview | null> {
    return getManager()
      .createQueryBuilder(Interview, 'inter')
      .innerJoin(
        InterviewParticipant,
        'participant',
        'participant.interviewId = inter._id AND participant.user = :user',
        { user },
      )
      .where('inter.endedAt IS NULL')
      .orderBy('inter.createdAt', 'DESC')
      .getOne()
      .then(interview => interview ?? null);
  }

  createInterviewDiff(
    data: Pick<InterviewDiff, 'event' | 'value'>,
    createdBy: string,
    interviewId: string,
  ): Promise<unknown> {
    return getManager()
      .createQueryBuilder()
      .insert()
      .into(InterviewDiff)
      .values({ ...data, createdBy, interviewId })
      .updateEntity(false)
      .execute();
  }

  getInterviewDiff(interviewId: string): Promise<InterviewDiff[]> {
    return getManager().find(InterviewDiff, {
      select: ['value', 'event', 'versionId'],
      where: { interviewId },
      order: { versionId: 'ASC' },
    });
  }
}
