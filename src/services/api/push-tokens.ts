import { HTTP } from '@/services/http';

export interface PushToken {
  _id: string;
  memberId: string;
  token: string;
  platform: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const addPushToken = async (
  memberId: string,
  token: string,
  platform: string,
): Promise<PushToken> => {
  return HTTP.post(`/api/members/${memberId}/push-tokens`, { token, platform }).then(
    ({ data }) => data,
  );
};

export const removePushToken = async (memberId: string, token: string): Promise<PushToken> => {
  return HTTP.delete(`/api/members/${memberId}/push-tokens/`, { data: { token } }).then(
    ({ data }) => data,
  );
};
