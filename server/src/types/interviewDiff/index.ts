import {
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Interview from '../interview';

@Entity()
export default class InterviewDiff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  interviewId: string;

  @Column()
  createdBy: string;

  @ManyToOne(_ => Interview, { primary: true })
  @JoinColumn({ name: 'interviewId' })
  interview: Interview;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  value?: string;

  @Column('simple-json')
  event: string;

  @Column('int')
  versionId: number;
}
