import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, ImageBackground, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { C, F } from '../../theme';
import { getBanners, imgUrl } from '../../api';
import { openLink } from '../../navigation/links';

const safe = (l) => typeof l === 'string' && l && ((l.startsWith('/') && !l.startsWith('//')) || /^https?:\/\//i.test(l));

// Built-in slides: used until the admin adds banners (same as the website).
const THEMES = {
  orange: { accent: '#7CC8FF', grad: ['#13A2EA', '#5A6EF1'], overlay: ['rgba(15,27,53,0.15)', 'rgba(15,27,53,0.82)'] },
  purple: { accent: '#E9B8FF', grad: ['#8B5CF6', '#EC4899'], overlay: ['rgba(40,20,70,0.15)', 'rgba(40,20,70,0.85)'] },
  blue:   { accent: '#8FD8FF', grad: ['#0EA5E9', '#6366F1'], overlay: ['rgba(10,40,80,0.15)', 'rgba(10,40,80,0.85)'] },
};
const BUILT_IN = [
  { id: 'b1', image: require('../../../assets/hero-shopping.jpg'), theme: 'orange', badge: 'Verified savings, every day', headline: 'Your shortcut to better deals.', accentText: 'better deals.', subtitle: 'Explore handpicked offers, coupon codes and price drops from the brands you already love.', primaryLabel: 'Explore deals', primaryLink: '/alldeals', secondaryLabel: 'Browse stores', secondaryLink: '/stores' },
  { id: 'b2', image: require('../../../assets/hero-fashion.jpg'), theme: 'purple', badge: 'Latest fashion trends', headline: 'Dress to impress, spend less.', accentText: 'spend less.', subtitle: "Discover exclusive fashion deals from top brands - women's, men's, and accessories all in one place.", primaryLabel: 'Shop fashion', primaryLink: '/alldeals', secondaryLabel: 'Browse stores', secondaryLink: '/stores' },
  { id: 'b3', image: require('../../../assets/hero-electronics.jpg'), theme: 'blue', badge: 'Best tech deals today', headline: 'Power up with epic tech deals.', accentText: 'epic tech deals.', subtitle: "Shop the latest gadgets, smartphones, laptops and accessories at prices you won't find anywhere else.", primaryLabel: 'Shop electronics', primaryLink: '/alldeals', secondaryLabel: 'Browse stores', secondaryLink: '/stores' },
];

function Headline({ text, accent, color }) {
  const i = accent ? text.indexOf(accent) : -1;
  if (i === -1) return <Text style={s.head} numberOfLines={3}>{text}</Text>;
  return (
    <Text style={s.head} numberOfLines={3}>{text.slice(0, i)}<Text style={{ color }}>{accent}</Text>{text.slice(i + accent.length)}</Text>
  );
}

export default function HeroCarousel() {
  const nav = useNavigation();
  const { width } = useWindowDimensions();
  const W = width - 32;
  const GAP = 12;
  const STEP = W + GAP; // distance between slides
  const [slides, setSlides] = useState(null);
  const [idx, setIdx] = useState(0);
  const list = useRef(null);

  useEffect(() => {
    let off = false;
    getBanners().then((b) => { if (!off) setSlides(b.length ? b.map((x) => ({ ...x, id: x._id, image: { uri: imgUrl(x.image) } })) : BUILT_IN); })
      .catch(() => { if (!off) setSlides(BUILT_IN); });
    return () => { off = true; };
  }, []);

  useEffect(() => {
    if (!slides || slides.length < 2) return undefined;
    const t = setInterval(() => {
      setIdx((i) => { const n = (i + 1) % slides.length; list.current?.scrollToOffset({ offset: n * STEP, animated: true }); return n; });
    }, 4500);
    return () => clearInterval(t);
  }, [slides, STEP]);

  if (!slides) return <View style={[s.slide, { width: W, marginHorizontal: 16, backgroundColor: '#E5E7EB' }]} />;

  return (
    <View>
      <FlatList
        ref={list} data={slides} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => String(i.id)} snapToInterval={STEP} snapToAlignment="start" decelerationRate="fast"
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        onMomentumScrollEnd={(e) => setIdx(Math.round(e.nativeEvent.contentOffset.x / STEP))}
        getItemLayout={(_, i) => ({ length: W, offset: STEP * i, index: i })}
        renderItem={({ item }) => {
          const t = THEMES[item.theme] || THEMES.orange;
          return (
            <ImageBackground source={item.image} style={[s.slide, { width: W }]} imageStyle={{ borderRadius: 20 }} resizeMode="cover">
              <LinearGradient colors={t.overlay} style={[StyleSheet.absoluteFill, { borderRadius: 20 }]} />
              <View style={s.body}>
                {item.badge ? <View style={s.badge}><Text style={s.badgeTxt}>{item.badge}</Text></View> : null}
                <Headline text={item.headline} accent={item.accentText} color={t.accent} />
                {item.subtitle ? <Text style={s.sub} numberOfLines={2}>{item.subtitle}</Text> : null}
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                  {item.primaryLabel && safe(item.primaryLink) ? (
                    <TouchableOpacity activeOpacity={0.85} onPress={() => openLink(nav, item.primaryLink)}>
                      <LinearGradient colors={t.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.btn}><Text style={s.btnTxt}>{item.primaryLabel}</Text></LinearGradient>
                    </TouchableOpacity>
                  ) : null}
                  {item.secondaryLabel && safe(item.secondaryLink) ? (
                    <TouchableOpacity activeOpacity={0.85} onPress={() => openLink(nav, item.secondaryLink)} style={s.btn2}><Text style={s.btnTxt}>{item.secondaryLabel}</Text></TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </ImageBackground>
          );
        }}
      />
      {slides.length > 1 ? (
        <View style={s.dots}>{slides.map((x, i) => <View key={x.id} style={[s.dot, i === idx && s.dotOn]} />)}</View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  slide: { height: 270, borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end' },
  body: { padding: 18 },
  badge: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 50, paddingHorizontal: 11, paddingVertical: 4, marginBottom: 8 },
  badgeTxt: { color: '#fff', fontFamily: F.semi, fontSize: 11 },
  head: { color: '#fff', fontFamily: F.black, fontSize: 22, lineHeight: 28 },
  sub: { color: 'rgba(255,255,255,0.88)', fontFamily: F.reg, fontSize: 12.5, marginTop: 6, lineHeight: 18 },
  btn: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16 },
  btn2: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.7)' },
  btnTxt: { color: '#fff', fontFamily: F.bold, fontSize: 13 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D1D5DB' },
  dotOn: { width: 22, backgroundColor: C.primary },
});
