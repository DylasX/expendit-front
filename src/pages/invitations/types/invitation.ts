import { Group } from '@/pages/groups/types/group';
import { User } from '@/shared/types/user';

export interface Invitation {
  id: number;
  status: StatusEnum;
  createdAt: string;
  updatedAt: string;
  inviterUserId: number;
  inviteeUserId: number;
  inviter: Pick<User, 'id' | 'fullName'>;
  invitee: Pick<User, 'id' | 'fullName'>;
  groupId: number;
  group: Pick<Group, 'id' | 'name'>;
}

export enum StatusEnum {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}
