import Container from 'typedi';
import type { Socket } from 'socket.io';

import InterviewService from '../services/interview';

const joinInterview = async (
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> => {
  try {
    const { joinInterviewInput, authCtx } = socket.data;
    const isInterviewActive = await Container.get(
      InterviewService,
    ).joinInterview(joinInterviewInput, authCtx);

    if (!isInterviewActive) {
      throw new Error('Interivew is not active');
    }
    next();
  } catch (err) {
    next(err);
  }
};

export default joinInterview;
