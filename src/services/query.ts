import { OnPremiseAirConditioner, OnPremiseState } from './api/services';
import { QueryClientConfig, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const DEFAULT_STALE_TIME = 300_000; // 5 minutes

export const QUERY_CLIENT_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME,
      retry: false,
    },
  },
};

export const eventsQueryKeys = {
  all: () => ['events'] as const,
};

export const membersQueryKeys = {
  all: () => ['members'] as const,
  attending: () => [...membersQueryKeys.all(), 'attending'] as const,
  byId: (id: string) => [...membersQueryKeys.all(), `${id}`] as const,
  profileById: (id: string) => [...membersQueryKeys.byId(id), 'profile'] as const,
  activityById: (id: string) => [...membersQueryKeys.byId(id), 'activity'] as const,
  ticketsById: (id: string) => [...membersQueryKeys.byId(id), 'tickets'] as const,
  subscriptionsById: (id: string) => [...membersQueryKeys.byId(id), 'subscriptions'] as const,
  membershipsById: (id: string) => [...membersQueryKeys.byId(id), 'memberships'] as const,
  devicesById: (id: string) => [...membersQueryKeys.byId(id), 'devices'] as const,
  allMessagesById: (id: string) => [...membersQueryKeys.byId(id), 'messages'] as const,
  messageById: (id: string, messageId: string) =>
    [...membersQueryKeys.allMessagesById(id), `${messageId}`] as const,
};

export const onPremiseQueryKeys = {
  state: () => ['on-premise', 'state'] as const,
  phoneBoothsOccupation: () => ['on-premise', 'phone-booths-occupation'] as const,
};

export const useAppQueryClient = () => {
  const queryClient = useQueryClient();

  const updateAirConditionerQueryData = useCallback(
    (
      airConditionerId: keyof OnPremiseState['airConditioners'],
      updatedAirConditioner: OnPremiseAirConditioner,
    ) => {
      queryClient.setQueryData(onPremiseQueryKeys.state(), (state: OnPremiseState) => ({
        ...state,
        airConditioners: {
          ...state.airConditioners,
          [airConditionerId]: {
            ...state.airConditioners[airConditionerId],
            ...updatedAirConditioner,
          },
        },
      }));
    },
    [queryClient],
  );

  return {
    queryClient,
    updateAirConditionerQueryData,
  };
};
