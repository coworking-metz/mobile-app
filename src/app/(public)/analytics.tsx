import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';
import tw from 'twrnc';

import AppText from '@/components/AppText';
import ErrorState from '@/components/ErrorState';
import ServiceLayout from '@/components/Layout/ServiceLayout';
import {
  getMemberPresenceStats,
  getMemberTrends,
  getMemberFinancialStats,
} from '@/services/api/members';
import useAuthStore from '@/stores/auth';

const StatsScreen = () => {
  const { t } = useTranslation();
  const authStore = useAuthStore();

  const {
    data: presenceStats,
    isFetching: isFetchingPresenceStats,
    error: presenceStatsError,
  } = useQuery({
    queryKey: ['members', authStore.user?.id, 'stats', 'presence'],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberPresenceStats(userId);
      }
      throw new Error(t('stats.error.missingUser'));
    },
    retry: false,
    refetchOnMount: false,
    enabled: !!authStore.user?.id,
  });

  const {
    data: trends,
    isFetching: isFetchingTrends,
    error: trendsError,
  } = useQuery({
    queryKey: ['members', authStore.user?.id, 'stats', 'trends'],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberTrends(userId);
      }
      throw new Error(t('stats.error.missingUser'));
    },
    retry: false,
    refetchOnMount: false,
    enabled: !!authStore.user?.id,
  });

  const {
    data: financialStats,
    isFetching: isFetchingFinancialStats,
    error: financialStatsError,
  } = useQuery({
    queryKey: ['members', authStore.user?.id, 'stats', 'financial'],
    queryFn: ({ queryKey: [_, userId] }) => {
      if (userId) {
        return getMemberFinancialStats(userId);
      }
      throw new Error(t('stats.error.missingUser'));
    },
    retry: false,
    refetchOnMount: false,
    enabled: !!authStore.user?.id,
  });

  return (
    <ServiceLayout
      description={t('stats.description')}
      loading={isFetchingPresenceStats || isFetchingTrends || isFetchingFinancialStats}
      title={t('stats.title')}>
      {presenceStatsError || trendsError || financialStatsError ? (
        <ErrorState
          error={presenceStatsError || trendsError || financialStatsError || undefined}
          title={t('stats.error.missingUser')}
        />
      ) : presenceStats && trends && financialStats ? (
        <View>
          {/* Gestion des marges et styles */}
          <View style={tw`flex flex-col gap-4`}>
            {/* Exemple : Texte internationalisé */}
            <AppText style={tw`text-lg font-medium text-slate-900 dark:text-gray-200`}>
              {t('stats.averagePresence')}: {presenceStats.averagePresence.daily.toFixed(2)}{' '}
              hours/day
            </AppText>
            <AppText style={tw`text-lg font-medium text-slate-900 dark:text-gray-200`}>
              {t('stats.weeklyTrend')}: {trends.weeklyTrend} hours
            </AppText>
            <AppText style={tw`text-lg font-medium text-slate-900 dark:text-gray-200`}>
              {t('stats.monthlyTrend')}: {trends.monthlyTrend} hours
            </AppText>
            <AppText style={tw`text-lg font-medium text-slate-900 dark:text-gray-200`}>
              {t('stats.averageCostPerDay')}: {financialStats.averageCostPerDay.toFixed(2)} €/day
            </AppText>

            {/* Section : Nouveaux membres rencontrés */}
            <AppText style={tw`text-xl font-bold text-slate-900 dark:text-gray-200 mb-2`}>
              {t('stats.section.newMembers')}
            </AppText>
            <View style={tw`px-4`}>
              <AppText style={tw`text-lg font-medium text-slate-900 dark:text-gray-200 mb-2`}>
                {t('stats.newMembersMet')}: {presenceStats.newMembersMet}
              </AppText>
              <BarChart
                barWidth={20}
                data={Object.entries(presenceStats.newMembersByMonth).map(([month, value]) => ({
                  value,
                  label: month,
                }))}
                spacing={10}
              />
            </View>

            {/* Section : Événements */}
            <AppText style={tw`text-xl font-bold text-slate-900 dark:text-gray-200 mb-2 mt-6`}>
              {t('stats.section.events')}
            </AppText>
            <View style={tw`px-4`}>
              <AppText style={tw`text-lg font-medium text-slate-900 dark:text-gray-200 mb-2`}>
                {t('stats.eventsAttended')}: {presenceStats.eventsAttended}
              </AppText>
              <LineChart
                data={Object.entries(presenceStats.eventsByMonth).map(([month, value]) => ({
                  value,
                  label: month,
                }))}
              />
            </View>

            {/* Jour préféré */}
            <AppText style={tw`text-lg font-medium text-slate-900 dark:text-gray-200`}>
              {t('stats.favoriteDay')}: {presenceStats.favoriteDay}
            </AppText>

            {/* Heure d’arrivée moyenne */}
            <AppText style={tw`text-lg font-medium text-slate-900 dark:text-gray-200`}>
              {t('stats.averageArrivalTime')}: {presenceStats.averageArrivalTime}
            </AppText>

            {/* Section : Contribution à la communauté */}
            <AppText style={tw`text-xl font-bold text-slate-900 dark:text-gray-200 mb-2 mt-6`}>
              {t('stats.section.communityContribution')}
            </AppText>
            <View style={tw`px-4`}>
              <AppText style={tw`text-lg font-medium text-slate-900 dark:text-gray-200 mb-2`}>
                {t('stats.communityContribution')}: {presenceStats.communityContribution}
              </AppText>
              <PieChart
                data={Object.entries(presenceStats.contributionByType).map(([type, value]) => ({
                  value,
                  text: type,
                }))}
              />
            </View>

            {/* Recommandations personnalisées */}
            <AppText style={tw`text-lg font-medium text-slate-900 dark:text-gray-200`}>
              {t('stats.personalizedRecommendations')}:
            </AppText>
            {presenceStats.recommendations.map((rec, index) => (
              <AppText key={index} style={tw`text-sm mb-1`}>
                - {rec}
              </AppText>
            ))}
          </View>
        </View>
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <AppText style={tw`text-gray-500`}>{t('stats.noData')}</AppText>
        </View>
      )}
    </ServiceLayout>
  );
};

export default StatsScreen;
