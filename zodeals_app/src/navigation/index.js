import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import { StoresScreen, CategoriesScreen, AllDealsScreen, CategoryCouponsScreen, StoreOffersScreen, DealsOfDayScreen, SearchScreen } from '../screens/BrowseScreens';
import CouponDetailScreen from '../screens/CouponDetailScreen';
import { LoginScreen, SignupScreen, ForgotPasswordScreen } from '../screens/AuthScreens';
import { AccountScreen, FavoritesScreen, NotificationsScreen, ProfileScreen, AgentContactScreen, PageScreen, DeleteAccountScreen } from '../screens/AccountScreens';
import { SignInPrompt, PinCodeModal } from '../components/Modals';
import { navRef } from './ref';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONS = { Home: 'home', Stores: 'shopping-bag', Categories: 'grid', AllDeals: 'tag', Account: 'user' };

function Tabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.faint,
        tabBarLabelStyle: { fontFamily: F.semi, fontSize: 11 },
        tabBarStyle: { height: 58 + insets.bottom, paddingBottom: insets.bottom + 4, paddingTop: 6, borderTopColor: '#F0F2F7' },
        tabBarIcon: ({ color, size }) => <Feather name={ICONS[route.name]} size={size - 2} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stores" component={StoresScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="AllDeals" component={AllDealsScreen} options={{ title: 'All Deals' }} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

const hdr = {
  headerTintColor: C.navy,
  headerTitleStyle: { fontFamily: F.bold, fontSize: 17 },
  headerShadowVisible: false,
  headerStyle: { backgroundColor: '#fff' },
  headerBackTitleVisible: false,
};

export default function Navigation() {
  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator screenOptions={hdr}>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
        <Stack.Screen name="CouponDetail" component={CouponDetailScreen} options={{ title: 'Offer details' }} />
        <Stack.Screen name="StoreOffers" component={StoreOffersScreen} options={({ route }) => ({ title: route.params?.name || 'Store' })} />
        <Stack.Screen name="CategoryCoupons" component={CategoryCouponsScreen} options={({ route }) => ({ title: route.params?.title || 'Category' })} />
        <Stack.Screen name="DealsOfDay" component={DealsOfDayScreen} options={{ title: 'Deals of the Day' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favourites' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My profile' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: '' }} />
        <Stack.Screen name="AgentContact" component={AgentContactScreen} options={{ title: 'Become an agent' }} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ title: 'Delete account' }} />
        <Stack.Screen name="Page" component={PageScreen} options={{ title: '' }} />
      </Stack.Navigator>
      {/* Global dialogs: sign-in prompt and pin code */}
      <SignInPrompt />
      <PinCodeModal />
    </NavigationContainer>
  );
}
