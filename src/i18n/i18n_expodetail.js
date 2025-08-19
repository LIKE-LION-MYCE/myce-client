// 메인 i18n.js에서 병합하므로 별도 초기화 불필요

const resources = {
  ko: {
    translation: {
      expoDetail: {
        // 박람회 정보 (ExpoInfo)
        expoInfo: {
          description: {
            title: "상세 설명",
            noDescription: "상세 설명이 없습니다."
          },
          organizer: {
            title: "주최자 정보",
            noOrganizerInfo: "주최자 정보 없음",
            ceo: "대표자",
            contact: "연락처", 
            email: "이메일",
            address: "주소",
            businessNumber: "사업자등록번호"
          },
          location: {
            title: "위치 정보",
            address: "주소",
            detailAddress: "상세 주소",
            noLocationInfo: "위치 정보를 불러올 수 없습니다."
          }
        },
        
        // 박람회 헤더 (ExpoHeader)
        expoHeader: {
          period: "기간",
          time: "시간",
          location: "장소",
          capacity: "정원",
          people: "명",
          currentReservations: "현재 {{count}}명 예약",
          status: {
            ongoing: "진행중",
            upcoming: "예정",
            ended: "종료",
            soldOut: "매진"
          },
          badges: {
            premium: "프리미엄",
            free: "무료"
          },
          buttons: {
            reserve: "예약하기",
            soldOut: "매진",
            ended: "종료됨",
            bookmark: "북마크",
            bookmarkAdd: "북마크 추가",
            bookmarkRemove: "북마크 제거",
            share: "공유하기",
            consultation: "1:1 상담하기",
            consultationTitle: "1:1 상담 채팅"
          }
        },
        
        // 티켓 정보 (ExpoTickets)
        expoTickets: {
          title: "티켓 정보",
          ticketName: "티켓명",
          price: "가격",
          quantity: "수량",
          remainingQuantity: "남은 수량",
          salePeriod: "판매기간",
          available: "예매 가능",
          soldOut: "매진",
          free: "무료",
          won: "원",
          tickets: "매",
          noTickets: "등록된 티켓이 없습니다.",
          ticketTypes: {
            general: "일반",
            earlyBird: "얼리버드"
          }
        },
        
        // 이벤트 정보 (ExpoEvents)
        expoEvents: {
          title: "이벤트 정보",
          eventName: "이벤트명",
          eventTime: "시간",
          eventDate: "날짜",
          location: "위치",
          description: "설명",
          contact: "담당자",
          email: "이메일",
          noDescription: "이벤트 설명이 없습니다.",
          filters: {
            all: "전체",
            past: "지난 행사",
            today: "오늘 행사",
            upcoming: "다가오는 행사"
          },
          noEvents: {
            all: "등록된 이벤트가 없습니다.",
            past: "지난 행사가 없습니다.",
            today: "오늘 예정된 행사가 없습니다.",
            upcoming: "다가오는 행사가 없습니다."
          }
        },
        
        // 부스 정보 (ExpoBooths)
        expoBooths: {
          title: "부스 정보",
          premiumTitle: "추천 부스",
          regularTitle: "부스 목록",
          boothNumber: "부스 번호",
          boothName: "부스명",
          contactName: "담당자",
          description: "설명",
          searchPlaceholder: "부스명 또는 설명 검색",
          noSearchResults: "검색 결과가 없습니다.",
          noBooths: "등록된 부스가 없습니다.",
          modal: {
            boothLocation: "부스 위치",
            boothDescription: "부스 설명",
            contactInfo: "담당자 정보",
            contactNameLabel: "담당자명",
            emailLabel: "이메일",
            noDescription: "부스 설명이 없습니다."
          }
        },
        
        // 리뷰 (ExpoReviews)
        expoReviews: {
          title: "리뷰",
          titleWithCount: "리뷰 ({{count}})",
          averageRating: "평균 평점",
          totalReviews: "총 리뷰 수",
          reviewsCount: "{{count}}개",
          rating: "평점",
          writeReview: "리뷰 작성",
          editReview: "수정",
          deleteReview: "삭제",
          myReviewBadge: "내 리뷰",
          noReviews: "아직 리뷰가 없습니다.",
          loading: "리뷰를 불러오는 중...",
          noPermissionMessage: "박람회에 참석한 후 리뷰를 작성할 수 있습니다.",
          modified: "(수정됨)",
          sortBy: "정렬",
          sortOptions: {
            latest: "최신순",
            rating: "평점순",
            helpful: "도움순"
          },
          ratingLabels: {
            fiveStars: "5점",
            fourStars: "4점", 
            threeStars: "3점",
            twoStars: "2점",
            oneStars: "1점"
          },
          confirmDelete: "정말로 이 리뷰를 삭제하시겠습니까?",
          messages: {
            reviewCreated: "리뷰가 작성되었습니다.",
            reviewUpdated: "리뷰가 수정되었습니다.",
            reviewDeleted: "리뷰가 삭제되었습니다.",
            reviewError: "리뷰 처리 중 오류가 발생했습니다.",
            deleteError: "리뷰 삭제 중 오류가 발생했습니다."
          }
        },
        
        // 공통
        common: {
          loading: "로딩중...",
          error: "오류가 발생했습니다",
          noData: "데이터가 없습니다",
          close: "닫기",
          confirm: "확인",
          cancel: "취소"
        }
      }
    }
  },
  en: {
    translation: {
      expoDetail: {
        // Expo Info (ExpoInfo)
        expoInfo: {
          description: {
            title: "Description",
            noDescription: "No description available."
          },
          organizer: {
            title: "Organizer Information",
            noOrganizerInfo: "No organizer information available",
            ceo: "CEO",
            contact: "Contact",
            email: "Email", 
            address: "Address",
            businessNumber: "Business Registration Number"
          },
          location: {
            title: "Location Information",
            address: "Address",
            detailAddress: "Detailed Address",
            noLocationInfo: "Location information is not available."
          }
        },
        
        // Expo Header (ExpoHeader)
        expoHeader: {
          period: "Period",
          time: "Time",
          location: "Location",
          capacity: "Capacity",
          people: "people",
          currentReservations: "{{count}} people currently reserved",
          status: {
            ongoing: "Ongoing",
            upcoming: "Upcoming",
            ended: "Ended",
            soldOut: "Sold Out"
          },
          badges: {
            premium: "Premium",
            free: "Free"
          },
          buttons: {
            reserve: "Reserve",
            soldOut: "Sold Out",
            ended: "Ended",
            bookmark: "Bookmark",
            bookmarkAdd: "Add Bookmark",
            bookmarkRemove: "Remove Bookmark",
            share: "Share",
            consultation: "1:1 Consultation",
            consultationTitle: "1:1 Consultation Chat"
          }
        },
        
        // Ticket Info (ExpoTickets)
        expoTickets: {
          title: "Ticket Information",
          ticketName: "Ticket Name",
          price: "Price",
          quantity: "Quantity",
          remainingQuantity: "Remaining Quantity",
          salePeriod: "Sale Period",
          available: "Available",
          soldOut: "Sold Out",
          free: "Free",
          won: "",
          tickets: "tickets",
          noTickets: "No tickets registered.",
          ticketTypes: {
            general: "General",
            earlyBird: "Early Bird"
          }
        },
        
        // Event Info (ExpoEvents)
        expoEvents: {
          title: "Event Information",
          eventName: "Event Name",
          eventTime: "Time",
          eventDate: "Date",
          location: "Location",
          description: "Description",
          contact: "Contact Person",
          email: "Email",
          noDescription: "No event description available.",
          filters: {
            all: "All",
            past: "Past Events",
            today: "Today's Events",
            upcoming: "Upcoming Events"
          },
          noEvents: {
            all: "No events registered.",
            past: "No past events.",
            today: "No events scheduled for today.",
            upcoming: "No upcoming events."
          }
        },
        
        // Booth Info (ExpoBooths)
        expoBooths: {
          title: "Booth Information",
          premiumTitle: "Recommended Booths",
          regularTitle: "Booth List",
          boothNumber: "Booth Number",
          boothName: "Booth Name",
          contactName: "Contact Person",
          description: "Description",
          searchPlaceholder: "Search booth name or description",
          noSearchResults: "No search results found.",
          noBooths: "No booths registered.",
          modal: {
            boothLocation: "Booth Location",
            boothDescription: "Booth Description",
            contactInfo: "Contact Information",
            contactNameLabel: "Contact Name",
            emailLabel: "Email",
            noDescription: "No booth description available."
          }
        },
        
        // Reviews (ExpoReviews)
        expoReviews: {
          title: "Reviews",
          titleWithCount: "Reviews ({{count}})",
          averageRating: "Average Rating",
          totalReviews: "Total Reviews",
          reviewsCount: "{{count}} reviews",
          rating: "Rating",
          writeReview: "Write Review",
          editReview: "Edit",
          deleteReview: "Delete",
          myReviewBadge: "My Review",
          noReviews: "No reviews yet.",
          loading: "Loading reviews...",
          noPermissionMessage: "You can write a review after attending the expo.",
          modified: "(Modified)",
          sortBy: "Sort by",
          sortOptions: {
            latest: "Latest",
            rating: "Rating",
            helpful: "Most Helpful"
          },
          ratingLabels: {
            fiveStars: "5 stars",
            fourStars: "4 stars", 
            threeStars: "3 stars",
            twoStars: "2 stars",
            oneStars: "1 star"
          },
          confirmDelete: "Are you sure you want to delete this review?",
          messages: {
            reviewCreated: "Review has been created.",
            reviewUpdated: "Review has been updated.",
            reviewDeleted: "Review has been deleted.",
            reviewError: "An error occurred while processing the review.",
            deleteError: "An error occurred while deleting the review."
          }
        },
        
        // Common
        common: {
          loading: "Loading...",
          error: "An error occurred",
          noData: "No data available",
          close: "Close",
          confirm: "Confirm",
          cancel: "Cancel"
        }
      }
    }
  },
  ja: {
    translation: {
      expoDetail: {
        // 展示会情報 (ExpoInfo)
        expoInfo: {
          description: {
            title: "詳細説明",
            noDescription: "詳細説明がありません。"
          },
          organizer: {
            title: "主催者情報",
            noOrganizerInfo: "主催者情報がありません",
            ceo: "代表者",
            contact: "連絡先",
            email: "メール",
            address: "住所", 
            businessNumber: "事業者登録番号"
          },
          location: {
            title: "位置情報",
            address: "住所",
            detailAddress: "詳細住所",
            noLocationInfo: "位置情報を読み込めません。"
          }
        },
        
        // 展示会ヘッダー (ExpoHeader)
        expoHeader: {
          period: "期間",
          time: "時間",
          location: "場所",
          capacity: "定員",
          people: "名",
          currentReservations: "現在{{count}}名予約中",
          status: {
            ongoing: "開催中",
            upcoming: "開催予定",
            ended: "終了",
            soldOut: "満席"
          },
          badges: {
            premium: "プレミアム",
            free: "無料"
          },
          buttons: {
            reserve: "予約する",
            soldOut: "満席",
            ended: "終了",
            bookmark: "ブックマーク",
            bookmarkAdd: "ブックマーク追加",
            bookmarkRemove: "ブックマーク削除",
            share: "共有",
            consultation: "1:1相談する",
            consultationTitle: "1:1相談チャット"
          }
        },
        
        // チケット情報 (ExpoTickets)
        expoTickets: {
          title: "チケット情報",
          ticketName: "チケット名",
          price: "価格",
          quantity: "数量",
          remainingQuantity: "残り数量",
          salePeriod: "販売期間",
          available: "予約可能",
          soldOut: "満席",
          free: "無料",
          won: "円",
          tickets: "枚",
          noTickets: "登録されたチケットがありません。",
          ticketTypes: {
            general: "一般",
            earlyBird: "アーリーバード"
          }
        },
        
        // イベント情報 (ExpoEvents)
        expoEvents: {
          title: "イベント情報",
          eventName: "イベント名",
          eventTime: "時間",
          eventDate: "日付",
          location: "場所",
          description: "説明",
          contact: "担当者",
          email: "メールアドレス",
          noDescription: "イベントの説明がありません。",
          filters: {
            all: "全て",
            past: "過去のイベント",
            today: "今日のイベント",
            upcoming: "今後のイベント"
          },
          noEvents: {
            all: "登録されたイベントがありません。",
            past: "過去のイベントがありません。",
            today: "今日予定されたイベントがありません。",
            upcoming: "今後のイベントがありません。"
          }
        },
        
        // ブース情報 (ExpoBooths)
        expoBooths: {
          title: "ブース情報",
          premiumTitle: "おすすめブース",
          regularTitle: "ブース一覧",
          boothNumber: "ブース番号",
          boothName: "ブース名",
          contactName: "担当者",
          description: "説明",
          searchPlaceholder: "ブース名または説明で検索",
          noSearchResults: "検索結果がありません。",
          noBooths: "登録されたブースがありません。",
          modal: {
            boothLocation: "ブース位置",
            boothDescription: "ブース説明",
            contactInfo: "担当者情報",
            contactNameLabel: "担当者名",
            emailLabel: "メールアドレス",
            noDescription: "ブースの説明がありません。"
          }
        },
        
        // レビュー (ExpoReviews)
        expoReviews: {
          title: "レビュー",
          titleWithCount: "レビュー ({{count}})",
          averageRating: "平均評価",
          totalReviews: "総レビュー数",
          reviewsCount: "{{count}}件",
          rating: "評価",
          writeReview: "レビューを書く",
          editReview: "編集",
          deleteReview: "削除",
          myReviewBadge: "私のレビュー",
          noReviews: "まだレビューがありません。",
          loading: "レビュー読み込み中...",
          noPermissionMessage: "博覧会に参加後、レビューを書くことができます。",
          modified: "(編集済み)",
          sortBy: "並び替え",
          sortOptions: {
            latest: "最新順",
            rating: "評価順",
            helpful: "参考順"
          },
          ratingLabels: {
            fiveStars: "5つ星",
            fourStars: "4つ星", 
            threeStars: "3つ星",
            twoStars: "2つ星",
            oneStars: "1つ星"
          },
          confirmDelete: "このレビューを本当に削除しますか？",
          messages: {
            reviewCreated: "レビューが作成されました。",
            reviewUpdated: "レビューが更新されました。",
            reviewDeleted: "レビューが削除されました。",
            reviewError: "レビューの処理中にエラーが発生しました。",
            deleteError: "レビューの削除中にエラーが発生しました。"
          }
        },
        
        // 共通
        common: {
          loading: "読み込み中...",
          error: "エラーが発生しました",
          noData: "データがありません",
          close: "閉じる",
          confirm: "確認",
          cancel: "キャンセル"
        }
      }
    }
  }
};

// 리소스만 export (메인 i18n.js에서 병합용)
export default resources;