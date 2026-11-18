import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OfferCard from './OfferCard';
import { Loader, Empty } from './ui';

export default function CouponGrid({ data, loading, error, emptyTitle = 'Nothing here yet', emptySub, header, onRefresh, refreshing }) {
  const nav = useNavigation();
  if (loading) return <Loader />;
  return (
    <FlatList
      data={data} keyExtractor={(i) => i._id}
      ListHeaderComponent={header}
      contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 16, gap: 12 }}
      refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined}
      ListEmptyComponent={<Empty icon="tag" title={error || emptyTitle} sub={error ? 'Pull down to try again.' : emptySub} />}
      renderItem={({ item }) => <OfferCard item={item} onPress={(c) => nav.navigate('CouponDetail', { coupon: c })} />}
    />
  );
}
