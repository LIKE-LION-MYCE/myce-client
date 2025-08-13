import React, { useEffect, useState } from "react";
import MainBanner from "../../components/banners/MainBanner";
import SubBanners from "../../components/banners/SubBanners";
import FooterBanner from "../../components/banners/FooterBanner";
import LoadMoreButton from "../../components/button/LoadMoreButton";
import CategoryTabs from "../../components/category/CategoryTabs";
import ExpoCardList from "../../components/expocard/ExpoCardList";
import TopRightWidgetsSection from "../../components/widget/TopRightWidgetsSection";
import FloatingChatButton from "../../components/chatbutton/FloatingChatButton";
import { getCurrentBanner } from "../../../api/service/platform-admin/banner/BannerService";
import { useExpoData } from "../../../hooks/useExpoData";
import { useCategories } from "../../../hooks/useCategories"; // Import the custom hook

export default function MainPage() {
  const [mainBanners, setMainBanners] = useState([]);
  const [subBanners, setSubBanners] = useState([]);
  const [footerBanners, setFooterBanners] = useState([]);
  const [topRightBanners, setTopRightBanners] = useState([]);
  const { expos, setFilters, isLoading, error } = useExpoData();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories(); // Use the categories hook

  const handleBanner = async () => {
    try {
      const response = await getCurrentBanner();

      setMainBanners(response.filter((b) => b.locationId === 1));
      setSubBanners(response.filter((b) => b.locationId === 2));
      setFooterBanners(response.filter((b) => b.locationId === 3));
      setTopRightBanners(response.filter((b) => b.locationId === 4));
    } catch (error) {
      console.log("배너 데이터를 찾아오지 못했습니다 : ", error);
    }
  };

  useEffect(() => {
    handleBanner();
  }, []);

  const handleCategoryChange = (category) => {
    const newCategory = category === "전체" ? undefined : category;
    console.log("Setting category filter to:", newCategory); // Add this line for debugging
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: newCategory,
    }));
  };

  // Render loading/error for categories if needed
  if (categoriesLoading) return <div>Loading categories...</div>;
  if (categoriesError) return <div>Error loading categories: {categoriesError.message}</div>;

  return (
    <div className="w-full">
      <div className="relative">
        <TopRightWidgetsSection banners={topRightBanners} />
        <MainBanner banners={mainBanners} />
      </div>
      <SubBanners banners={subBanners} />
      <CategoryTabs onCategoryChange={handleCategoryChange} categories={categories} />
      <ExpoCardList expos={expos} isLoading={isLoading} error={error} />
      <LoadMoreButton />
      <FooterBanner banners={footerBanners} />
      <FloatingChatButton />
    </div>
  );
}
