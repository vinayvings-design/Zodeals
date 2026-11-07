import React from 'react';
import { FlatList, View, useWindowDimensions, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CouponCard from './CouponCard';
import { Loader, Empty } from './ui';

export default function CouponGrid({ data, loading, error, emptyTitle = 'Nothing here yet', emptySub, header, onRefresh, refreshing }) {
  const nav = useNavigation();
  const { width } = useWindowDimensions();
  const w = (width - 16 * 2 - 12) / 2;
  if (loading) return <Loader />;
  return (
    <FlatList
      data={data} numColumns={2} keyExtractor={(i) => i._id}
      ListHeaderComponent={header}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
      contentContainerStyle={{ paddingBottom: 30, gap: 12 }}
      refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} /> : undefined}
      ListEmptyComponent={<Empty icon="tag" title={error || emptyTitle} sub={error ? 'Pull down to try again.' : emptySub} />}
      renderItem={({ item }) => <CouponCard width={w} item={item} onPress={(c) => nav.navigate('CouponDetail', { coupon: c })} />}
    />
  );
}
