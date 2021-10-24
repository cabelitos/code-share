import { InterfaceType, Field, ID } from 'type-graphql';
import { PrimaryGeneratedColumn } from 'typeorm';

export interface INode {
  _id: string;
  getTypeName(): string;
}

@InterfaceType({
  resolveType: value =>
    Buffer.from(value.id, 'base64').toString('utf8').split(':')[1],
})
export default abstract class Node implements INode {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  getTypeName(): string {
    throw new Error('getTypeName not implemented');
  }

  @Field(_ => ID)
  id(): string {
    // eslint-disable-next-line no-underscore-dangle
    return Buffer.from(`${this.getTypeName()}:${this._id}`).toString('base64');
  }
}
