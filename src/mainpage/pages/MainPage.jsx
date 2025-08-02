import React from 'react';
import MainBanner from '../components/banners/MainBanner';
import SubBanners from '../components/banners/SubBanners';
import FooterBanner from '../components/banners/FooterBanner';
import LoadMoreButton from '../components/button/LoadMoreButton';
import CategoryTabs from '../components/category/CategoryTabs';
import ExpoCardList from '../components/expocard/ExpoCardList';
import TopRightWidgetsSection from '../components/widget/TopRightWidgetsSection';

export default function MainPage() {
  return (
    <div className="w-full">
      <div className="relative">
        <TopRightWidgetsSection />
        <MainBanner />
      </div>
      <SubBanners />
      <CategoryTabs />
      <ExpoCardList />
      <LoadMoreButton />
      <FooterBanner />
    </div>
  );
}
