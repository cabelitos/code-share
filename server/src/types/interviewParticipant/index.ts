import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import Interview from '../interview';

@Entity()
export default class InterviewParticipant {
  @PrimaryColumn()
  interviewId: string;

  @PrimaryColumn()
  user: string;

  @ManyToOne(_ => Interview, { primary: true })
  @JoinColumn({ name: 'interviewId' })
  interview: Interview;
}
