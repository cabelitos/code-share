import { AuthChecker } from 'type-graphql';

import type { ContextData } from '../context';

const authChecker: AuthChecker<ContextData> = (
  {
    context: {
      authCtx: { permissions, email },
    },
  },
  roles,
) => (!roles.length ? !!email : roles.every(permissions.has, permissions));

export default authChecker;
