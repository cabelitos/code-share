import { ObjectType, Field } from 'type-graphql';
import { Column, CreateDateColumn, Entity } from 'typeorm';

import Node, { INode } from '../node';

@ObjectType({ implements: Node })
@Entity()
export default class Interview extends Node implements INode {
  getTypeName(): string {
    return 'Interview';
  }

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  interviewee: string;

  @Field()
  @Column()
  createdBy: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'datetime' })
  endedAt?: Date;
}
