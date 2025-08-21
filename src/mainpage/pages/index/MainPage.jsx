import React, { useEffect, useState } from "react";
import MainBanner from "../../components/banners/MainBanner";
import SubBanners from "../../components/banners/SubBanners";
import FooterBanner from "../../components/banners/FooterBanner";
import LoadMoreButton from "../../components/button/LoadMoreButton";
import CategoryTabs from "../../components/category/CategoryTabs";
import ExpoCardList from "../../components/expocard/ExpoCardList";
import FloatingChatButton from "../../components/chatbutton/FloatingChatButton";
import { getCurrentBanner } from "../../../api/service/platform-admin/banner/BannerService";
import { useExpoData } from "../../../hooks/useExpoData";
import { useCategories } from "../../../hooks/useCategories";
import UpcomingCardList from "../../components/upcominglist/UpcomingCardList";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import BestReviews from "../../components/bestreviews/BestReviews";

export default function MainPage() {
  const [mainBanners, setMainBanners] = useState([]);
  const [subBanners, setSubBanners] = useState([]);
  const [footerBanners, setFooterBanners] = useState([]);
  const {
    expos,
    setExpos,
    setFilters,
    error,
    refresh,
    pagination,
    setPagination,
  } = useExpoData(8);
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const handleBookmarkToggle = (expoId) => {
    console.log(`Toggling bookmark for expo ID: ${expoId}`);
    setExpos((prevExpos) => {
      const updatedExpos = prevExpos.map((expo) => {
        if (expo.expoId === expoId) {
          console.log(
            `Expo ${expoId}: Toggling isBookmark from ${expo.isBookmark
            } to ${!expo.isBookmark}`
          );
          return { ...expo, isBookmark: !expo.isBookmark };
        }
        return expo;
      });
      console.log("Updated expos array:", updatedExpos);
      return updatedExpos;
    });
  };

  const handleBanner = async () => {
    try {
      const response = await getCurrentBanner();

      setMainBanners(response.filter((b) => b.locationId === 1));
      setSubBanners(response.filter((b) => b.locationId === 2));
      setFooterBanners(response.filter((b) => b.locationId === 3));
    } catch (error) {
      console.log("배너 데이터를 찾아오지 못했습니다 : ", error);
    }
  };

  useEffect(() => {
    handleBanner();
  }, []);

  const handleCategoryChange = (category) => {
    const newCategory = category === "전체" ? undefined : category;
    console.log("Setting category filter to:", newCategory);
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: newCategory,
    }));
  };

  if (categoriesLoading) return (
    <div>
      <LoadingSpinner />
    </div>
  );
  if (categoriesError)
    return <div>Error loading categories: {categoriesError.message}</div>;

  return (
    <div className="w-full">
      <div className="relative">
        <MainBanner banners={mainBanners} />
      </div>
      <UpcomingCardList />
      <CategoryTabs
        onCategoryChange={handleCategoryChange}
        categories={categories}
      />
      <ExpoCardList
        expos={expos}
        error={error}
        onBookmarkToggle={handleBookmarkToggle}
      />
      <LoadMoreButton />

      <FooterBanner banners={footerBanners} />
      <BestReviews />
      <SubBanners banners={subBanners} />
      <FloatingChatButton />
    </div>
  );
}
