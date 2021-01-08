import { functions } from 'src/firebase';

import { IgetSearchKey, IgetSearchKeyResult } from './types';

export const getSearchKey = async ({
  authenticated,
}: IgetSearchKey): Promise<IgetSearchKeyResult> =>
  functions
    .httpsCallable('https-api-getSearchKey')({
      authenticated,
    })
    .then(({ data }) => data);
