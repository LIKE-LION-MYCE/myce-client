// 메인 i18n.js에서 병합하므로 별도 초기화 불필요

const resources = {
  ko: {
    translation: {
      homepage: {
        // 메인 페이지 로딩 및 에러 메시지
        loading: {
          categories: "카테고리 로딩중...",
          expos: "박람회 로딩중...",
          banners: "배너 로딩중..."
        },
        errors: {
          categories: "카테고리를 불러오는데 실패했습니다",
          expos: "박람회를 불러오는데 실패했습니다",
          banners: "배너를 불러오는데 실패했습니다",
          network: "네트워크 연결을 확인해주세요"
        },
        
        // 카테고리 탭
        categories: {
          ongoingEvents: "진행중인 행사",
          all: "전체",
          technology: "기술/IT",
          fashion: "패션/뷰티",
          food: "푸드/음료",
          culture: "문화/예술"
        },
        
        // 메인 배너
        banner: {
          viewDetails: "자세히 보기",
          register: "참가 신청",
          moreInfo: "더 알아보기"
        },
        
        // 박람회 카드
        expoCard: {
          period: "기간",
          location: "장소",
          capacity: "정원",
          people: "명",
          remainingTickets: "남은 티켓 수량",
          ticketUnit: "개",
          status: {
            upcoming: "예정",
            ongoing: "진행중",
            ended: "종료",
            soldOut: "매진"
          },
          bookmark: {
            add: "즐겨찾기 추가",
            remove: "즐겨찾기 제거",
            toggle: "즐겨찾기 토글",
            loginRequired: "비회원은 북마크 기능을 이용하실 수 없습니다",
            error: "북마크 기능 처리 중 오류가 발생했습니다."
          },
          buttons: {
            viewDetails: "상세보기",
            reserve: "예약하기",
            soldOut: "매진",
            closed: "예약 마감"
          },
          premium: "프리미엄",
          free: "무료",
          from: "부터"
        },
        
        // 더보기 버튼
        loadMore: {
          button: "더 많은 박람회 보기",
          viewAll: "전체 보기",
          loading: "로딩중...",
          noMore: "더 이상 박람회가 없습니다"
        },
        
        // 예정 박람회 섹션
        upcoming: {
          title: "오픈 예정",
          subtitle: "곧 시작될 흥미진진한 이벤트들을 만나보세요",
          viewAll: "전체 보기",
          viewAllButton: "오픈 예정 공연 전체보기",
          daysLeft: "일 남음",
          comingSoon: "곧 시작",
          defaultCategory: "박람회",
          dateUndetermined: "날짜 미정",
          loading: "이벤트를 불러오는 중...",
          error: "이벤트를 불러오는데 실패했습니다.",
          errorRetry: "잠시 후 다시 시도해주세요.",
          noEvents: "예정된 이벤트가 없습니다",
          noEventsDesc: "새로운 이벤트가 추가되면 알려드리겠습니다.",
          weekdays: {
            sun: "일",
            mon: "월",
            tue: "화", 
            wed: "수",
            thu: "목",
            fri: "금",
            sat: "토"
          }
        },
        
        // 베스트 리뷰 섹션
        bestReviews: {
          title: "베스트 관람후기",
          subtitle: "참가자들이 남긴 생생한 후기",
          viewAll: "전체 리뷰 보기",
          rating: "평점",
          helpful: "도움이 됨",
          moreReviews: "더 많은 리뷰 보기",
          loading: "리뷰를 불러오는 중...",
          error: "리뷰를 불러오는데 실패했습니다.",
          refreshButton: "관람후기 새로 보기"
        },
        
        // 채팅 버튼
        chat: {
          button: "채팅",
          tooltip: "실시간 문의하기",
          offline: "오프라인",
          online: "온라인"
        },
        
        // 검색 및 필터
        search: {
          placeholder: "박람회를 검색해보세요",
          button: "검색",
          filters: "필터",
          sortBy: "정렬",
          sort: {
            latest: "최신순",
            popular: "인기순",
            startDate: "시작일순",
            endDate: "마감일순"
          }
        },
        
        // 공통 메시지
        common: {
          noResults: "박람회가 없습니다.",
          tryAgain: "다시 시도",
          loading: "로딩중...",
          error: "오류가 발생했습니다",
          success: "성공",
          cancel: "취소",
          confirm: "확인",
          close: "닫기"
        }
      }
    }
  },
  en: {
    translation: {
      homepage: {
        // Loading and error messages
        loading: {
          categories: "Loading categories...",
          expos: "Loading exhibitions...",
          banners: "Loading banners..."
        },
        errors: {
          categories: "Failed to load categories",
          expos: "Failed to load exhibitions",
          banners: "Failed to load banners",
          network: "Please check your network connection"
        },
        
        // Category tabs
        categories: {
          ongoingEvents: "Ongoing Events",
          all: "All",
          technology: "Tech/IT",
          fashion: "Fashion/Beauty",
          food: "Food/Beverage",
          culture: "Culture/Art"
        },
        
        // Main banner
        banner: {
          viewDetails: "View Details",
          register: "Register",
          moreInfo: "Learn More"
        },
        
        // Expo cards
        expoCard: {
          period: "Period",
          location: "Location",
          capacity: "Capacity",
          people: "people",
          remainingTickets: "Remaining Tickets",
          ticketUnit: "tickets",
          status: {
            upcoming: "Upcoming",
            ongoing: "Ongoing",
            ended: "Ended",
            soldOut: "Sold Out"
          },
          bookmark: {
            add: "Add to Bookmarks",
            remove: "Remove from Bookmarks",
            toggle: "Toggle Bookmark",
            loginRequired: "Non-members cannot use bookmark feature",
            error: "An error occurred while processing bookmark"
          },
          buttons: {
            viewDetails: "View Details",
            reserve: "Reserve",
            soldOut: "Sold Out",
            closed: "Registration Closed"
          },
          premium: "Premium",
          free: "Free",
          from: "from"
        },
        
        // Load more button
        loadMore: {
          button: "Load More Exhibitions",
          viewAll: "View All",
          loading: "Loading...",
          noMore: "No more exhibitions"
        },
        
        // Upcoming section
        upcoming: {
          title: "Coming Soon",
          subtitle: "Discover exciting upcoming events",
          viewAll: "View All",
          viewAllButton: "View All Upcoming Shows",
          daysLeft: "days left",
          comingSoon: "Coming Soon",
          defaultCategory: "Exhibition",
          dateUndetermined: "Date TBD",
          loading: "Loading events...",
          error: "Failed to load events.",
          errorRetry: "Please try again later.",
          noEvents: "No upcoming events",
          noEventsDesc: "We'll notify you when new events are added.",
          weekdays: {
            sun: "Sun",
            mon: "Mon", 
            tue: "Tue",
            wed: "Wed",
            thu: "Thu",
            fri: "Fri",
            sat: "Sat"
          }
        },
        
        // Best reviews section
        bestReviews: {
          title: "Best Reviews",
          subtitle: "Real experiences from participants",
          viewAll: "View All Reviews",
          rating: "Rating",
          helpful: "Helpful",
          moreReviews: "More Reviews",
          loading: "Loading reviews...",
          error: "Failed to load reviews.",
          refreshButton: "Load New Reviews"
        },
        
        // Chat button
        chat: {
          button: "Chat",
          tooltip: "Ask questions in real-time",
          offline: "Offline",
          online: "Online"
        },
        
        // Search and filters
        search: {
          placeholder: "Search exhibitions",
          button: "Search",
          filters: "Filters",
          sortBy: "Sort by",
          sort: {
            latest: "Latest",
            popular: "Popular",
            startDate: "Start Date",
            endDate: "End Date"
          }
        },
        
        // Common messages
        common: {
          noResults: "No exhibitions found",
          tryAgain: "Try Again",
          loading: "Loading...",
          error: "An error occurred",
          success: "Success",
          cancel: "Cancel",
          confirm: "Confirm",
          close: "Close"
        }
      }
    }
  },
  ja: {
    translation: {
      homepage: {
        // ローディングとエラーメッセージ
        loading: {
          categories: "カテゴリ読み込み中...",
          expos: "展示会読み込み中...",
          banners: "バナー読み込み中..."
        },
        errors: {
          categories: "カテゴリの読み込みに失敗しました",
          expos: "展示会の読み込みに失敗しました",
          banners: "バナーの読み込みに失敗しました",
          network: "ネットワーク接続をご確認ください"
        },
        
        // カテゴリタブ
        categories: {
          ongoingEvents: "開催中のイベント",
          all: "すべて",
          technology: "技術/IT",
          fashion: "ファッション/美容",
          food: "フード/飲料",
          culture: "文化/芸術"
        },
        
        // メインバナー
        banner: {
          viewDetails: "詳細を見る",
          register: "参加申込",
          moreInfo: "もっと詳しく"
        },
        
        // 展示会カード
        expoCard: {
          period: "期間",
          location: "場所",
          capacity: "定員",
          people: "名",
          remainingTickets: "残りチケット数",
          ticketUnit: "枚",
          status: {
            upcoming: "開催予定",
            ongoing: "開催中",
            ended: "終了",
            soldOut: "満席"
          },
          bookmark: {
            add: "ブックマークに追加",
            remove: "ブックマークから削除",
            toggle: "ブックマーク切替",
            loginRequired: "非会員はブックマーク機能をご利用いただけません",
            error: "ブックマーク処理中にエラーが発生しました"
          },
          buttons: {
            viewDetails: "詳細を見る",
            reserve: "予約する",
            soldOut: "満席",
            closed: "受付終了"
          },
          premium: "プレミアム",
          free: "無料",
          from: "から"
        },
        
        // もっと見るボタン
        loadMore: {
          button: "もっと多くの展示会を見る",
          viewAll: "すべて見る",
          loading: "読み込み中...",
          noMore: "これ以上展示会はありません"
        },
        
        // 開催予定セクション
        upcoming: {
          title: "開催予定",
          subtitle: "まもなく始まる魅力的なイベントをお楽しみに",
          viewAll: "すべて見る",
          viewAllButton: "開催予定公演をすべて見る",
          daysLeft: "日後",
          comingSoon: "まもなく開催",
          defaultCategory: "展示会",
          dateUndetermined: "日程未定",
          loading: "イベント読み込み中...",
          error: "イベントの読み込みに失敗しました。",
          errorRetry: "しばらく後でもう一度お試しください。",
          noEvents: "予定されたイベントがありません",
          noEventsDesc: "新しいイベントが追加されましたらお知らせします。",
          weekdays: {
            sun: "日",
            mon: "月",
            tue: "火",
            wed: "水", 
            thu: "木",
            fri: "金",
            sat: "土"
          }
        },
        
        // ベストレビューセクション
        bestReviews: {
          title: "ベストレビュー",
          subtitle: "参加者による生の体験談",
          viewAll: "すべてのレビューを見る",
          rating: "評価",
          helpful: "役に立った",
          moreReviews: "もっとレビューを見る",
          loading: "レビュー読み込み中...",
          error: "レビューの読み込みに失敗しました。",
          refreshButton: "新しいレビューを見る"
        },
        
        // チャットボタン
        chat: {
          button: "チャット",
          tooltip: "リアルタイムでお問い合わせ",
          offline: "オフライン",
          online: "オンライン"
        },
        
        // 検索とフィルター
        search: {
          placeholder: "展示会を検索",
          button: "検索",
          filters: "フィルター",
          sortBy: "並び替え",
          sort: {
            latest: "最新順",
            popular: "人気順",
            startDate: "開始日順",
            endDate: "終了日順"
          }
        },
        
        // 共通メッセージ
        common: {
          noResults: "検索結果がありません",
          tryAgain: "再試行",
          loading: "読み込み中...",
          error: "エラーが発生しました",
          success: "成功",
          cancel: "キャンセル",
          confirm: "確認",
          close: "閉じる"
        }
      }
    }
  }
};

// 리소스만 export (메인 i18n.js에서 병합용)
export default resources;