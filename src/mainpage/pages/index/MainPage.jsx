import React, {useEffect, useState} from 'react';
import MainBanner from '../../components/banners/MainBanner';
import SubBanners from '../../components/banners/SubBanners';
import FooterBanner from '../../components/banners/FooterBanner';
import LoadMoreButton from '../../components/button/LoadMoreButton';
import CategoryTabs from '../../components/category/CategoryTabs';
import ExpoCardList from '../../components/expocard/ExpoCardList';
import FloatingChatButton from '../../components/chatbutton/FloatingChatButton';
import { getCurrentBanner } from '../../../api/service/platform-admin/banner/BannerService'

export default function MainPage() {
  const [mainBanners, setMainBanners] = useState([]);
  const [subBanners, setSubBanners] = useState([]);
  const [footerBanners, setFooterBanners] = useState([]);

  const handleBanner = async () => {
    try {
      const response = await getCurrentBanner();

      setMainBanners(response.filter(b => b.locationId === 1));
      setSubBanners(response.filter(b => b.locationId === 2));
      setFooterBanners(response.filter(b => b.locationId === 3));
      setTopRightBanners(response.filter(b => b.locationId === 4));
    } catch (error) {
      console.log("배너 데이터를 찾아오지 못했습니다 : ", error);
    }
  };

  useEffect (() => {
    handleBanner();
  }, []);

  return (
    <div className="w-full">
      <div className="relative">
        <MainBanner banners={mainBanners} />
      </div>
      <SubBanners banners={subBanners} />
      <CategoryTabs />
      <ExpoCardList />
      <LoadMoreButton />
      <FooterBanner banners={footerBanners} />
      <FloatingChatButton />
    </div>
  );
}
