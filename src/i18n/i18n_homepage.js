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
          tech: "IT/테크/보안",
          fashion: "뷰티/라이프스타일",
          medical: "의료/헬스케어",
          culture: "예술/디자인/기타",
          food: "식품/1차산업",
          create: "제조/생산",
          infra: "건설/인프라",
          mobility: "모빌리티/조선/해양",
          energy: "에너지/환경",
          retail: "리테일/유통/물류",
          space: "방위산업/우주",
          education: "교육/학습",
          service: "경영/금융/서비스"
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
        },
        
        // UpcomingCard
        upcomingCard: {
          status: {
            soldout: "매진",
            upcoming: "오픈예정", 
            available: "예매가능"
          }
        },

        // SidebarFilters
        sidebarFilters: {
          search: {
            placeholder: "박람회를 검색하세요."
          },
          period: {
            title: "기간",
            months: "{{count}}개월",
            start: "시작",
            end: "종료"
          },
          category: {
            title: "카테고리",
            all: "전체"
          },
          reset: "필터 초기화"
        },

        // Footer
        footer: {
          companyAddress: "회사 도로명 주소 정보",
          service: {
            title: "서비스",
            reservation: "박람회 예약",
            inquiry: "예약 조회",
            consultation: "일대일 상담"
          },
          business: {
            title: "비즈니스",
            application: "박람회 신청",
            advertising: "광고 신청"
          },
          copyright: "© 2024 Myce. All rights reserved."
        },

        // ExpoApply
        expoApply: {
          validation: {
            maxCapacity: {
              required: "최대 수용 인원을 입력해주세요.",
              numbersOnly: "숫자만 입력 가능합니다."
            },
            description: "박람회 상세 소개를 입력해주세요.",
            companyName: "회사명을 입력해주세요.",
            businessNumber: "사업자 번호를 입력해주세요.",
            companyAddress: "회사 주소를 입력해주세요.",
            representativeName: "대표자명을 입력해주세요.",
            representativeContact: "대표자 연락처를 입력해주세요.",
            representativeEmail: "대표자 이메일을 입력해주세요.",
            emailFormat: "올바른 이메일 형식이 아닙니다.",
            categorySelection: "카테고리를 1개 이상 선택해주세요."
          },
          alerts: {
            noPreviousData: "이전 페이지 데이터가 없습니다. 첫 번째 페이지를 먼저 작성해주세요.",
            noDisplayPeriod: "게시 기간 정보가 없습니다. 첫 번째 페이지에서 게시 기간을 입력해주세요.",
            validationError: "필수 정보를 모두 올바르게 입력해주세요.",
            registrationSuccess: "박람회 등록 완료!",
            registrationError: "등록 중 오류가 발생했습니다."
          },
          form: {
            maxCapacity: "최대 수용 인원",
            maxCapacityPlaceholder: "예: 1000",
            description: "박람회 상세 소개",
            category: "카테고리",
            categoryPlaceholder: "카테고리를 선택해주세요",
            premiumService: "프리미엄 상위 노출 서비스 신청",
            estimatedPayment: "💰 예상 결제금액 확인",
            estimatedPaymentDesc: "입력하신 정보를 바탕으로 예상 결제금액을 확인할 수 있습니다.",
            companyInfo: "회사 정보",
            companyName: "회사명",
            businessNumber: "사업자 번호",
            companyAddress: "회사 주소",
            addressPlaceholder: "주소 검색 버튼을 눌러주세요",
            addressSearch: "주소 검색",
            close: "닫기",
            representativeName: "대표자명",
            representativeContact: "대표자 연락처",
            representativeEmail: "대표자 이메일",
            emailPlaceholder: "예: hello@myce.com",
            cancel: "취소",
            submit: "등록"
          }
        },

        // BrowseExpo
        browseExpo: {
          loadingCategories: "카테고리 로딩중...",
          errorCategories: "카테고리 로딩 오류: {{message}}",
          title: "전체 행사",
          count: "{{count}}개의 행사"
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
          tech: "IT/Tech/Security",
          fashion: "Beauty/Lifestyle",
          medical: "Medical/Healthcare",
          culture: "Art/Design/Others",
          food: "Food/Primary Industry",
          create: "Manufacturing/Production",
          infra: "Construction/Infrastructure",
          mobility: "Mobility/Shipbuilding/Maritime",
          energy: "Energy/Environment",
          retail: "Retail/Distribution/Logistics",
          space: "Defense/Aerospace",
          education: "Education/Learning",
          service: "Business/Finance/Service"
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
        },
        
        // UpcomingCard
        upcomingCard: {
          status: {
            soldout: "Sold Out",
            upcoming: "Coming Soon", 
            available: "Available"
          }
        },

        // SidebarFilters
        sidebarFilters: {
          search: {
            placeholder: "Search exhibitions"
          },
          period: {
            title: "Period",
            months: "{{count}} months",
            start: "Start",
            end: "End"
          },
          category: {
            title: "Category",
            all: "All"
          },
          reset: "Reset Filters"
        },

        // Footer
        footer: {
          companyAddress: "Company Address Information",
          service: {
            title: "Services",
            reservation: "Exhibition Booking",
            inquiry: "Booking Inquiry",
            consultation: "1:1 Consultation"
          },
          business: {
            title: "Business",
            application: "Exhibition Application",
            advertising: "Advertisement Application"
          },
          copyright: "© 2024 Myce. All rights reserved."
        },

        // ExpoApply
        expoApply: {
          validation: {
            maxCapacity: {
              required: "Please enter maximum capacity.",
              numbersOnly: "Only numbers are allowed."
            },
            description: "Please enter exhibition description.",
            companyName: "Please enter company name.",
            businessNumber: "Please enter business registration number.",
            companyAddress: "Please enter company address.",
            representativeName: "Please enter representative name.",
            representativeContact: "Please enter representative contact.",
            representativeEmail: "Please enter representative email.",
            emailFormat: "Invalid email format.",
            categorySelection: "Please select at least one category."
          },
          alerts: {
            noPreviousData: "No previous page data. Please complete the first page first.",
            noDisplayPeriod: "No display period information. Please enter display period on the first page.",
            validationError: "Please enter all required information correctly.",
            registrationSuccess: "Exhibition registration completed!",
            registrationError: "An error occurred during registration."
          },
          form: {
            maxCapacity: "Maximum Capacity",
            maxCapacityPlaceholder: "e.g.: 1000",
            description: "Exhibition Description",
            category: "Category",
            categoryPlaceholder: "Please select a category",
            premiumService: "Apply for Premium Top Exposure Service",
            estimatedPayment: "💰 Check Estimated Payment",
            estimatedPaymentDesc: "You can check the estimated payment amount based on the entered information.",
            companyInfo: "Company Information",
            companyName: "Company Name",
            businessNumber: "Business Registration Number",
            companyAddress: "Company Address",
            addressPlaceholder: "Please click the address search button",
            addressSearch: "Search Address",
            close: "Close",
            representativeName: "Representative Name",
            representativeContact: "Representative Contact",
            representativeEmail: "Representative Email",
            emailPlaceholder: "e.g.: hello@myce.com",
            cancel: "Cancel",
            submit: "Register"
          }
        },

        // BrowseExpo
        browseExpo: {
          loadingCategories: "Loading categories...",
          errorCategories: "Error loading categories: {{message}}",
          title: "All Events",
          count: "{{count}} events"
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
          tech: "IT/テック/セキュリティ",
          fashion: "ビューティ/ライフスタイル",
          medical: "医療/ヘルスケア",
          culture: "芸術/デザイン/その他",
          food: "食品/1次産業",
          create: "製造/生産",
          infra: "建設/インフラ",
          mobility: "モビリティ/造船/海洋",
          energy: "エネルギー/環境",
          retail: "リテール/流通/物流",
          space: "防衛産業/宇宙",
          education: "教育/学習",
          service: "経営/金融/サービス"
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
        },
        
        // UpcomingCard
        upcomingCard: {
          status: {
            soldout: "満席",
            upcoming: "開催予定", 
            available: "予約可能"
          }
        },

        // SidebarFilters
        sidebarFilters: {
          search: {
            placeholder: "展示会を検索"
          },
          period: {
            title: "期間",
            months: "{{count}}ヶ月",
            start: "開始",
            end: "終了"
          },
          category: {
            title: "カテゴリ",
            all: "すべて"
          },
          reset: "フィルターリセット"
        },

        // Footer
        footer: {
          companyAddress: "会社住所情報",
          service: {
            title: "サービス",
            reservation: "展示会予約",
            inquiry: "予約照会",
            consultation: "1対1相談"
          },
          business: {
            title: "ビジネス",
            application: "展示会申込",
            advertising: "広告申込"
          },
          copyright: "© 2024 Myce. All rights reserved."
        },

        // ExpoApply
        expoApply: {
          validation: {
            maxCapacity: {
              required: "最大収容人数を入力してください。",
              numbersOnly: "数字のみ入力可能です。"
            },
            description: "展示会詳細紹介を入力してください。",
            companyName: "会社名を入力してください。",
            businessNumber: "事業者番号を入力してください。",
            companyAddress: "会社住所を入力してください。",
            representativeName: "代表者名を入力してください。",
            representativeContact: "代表者連絡先を入力してください。",
            representativeEmail: "代表者メールアドレスを入力してください。",
            emailFormat: "正しいメール形式ではありません。",
            categorySelection: "カテゴリを1つ以上選択してください。"
          },
          alerts: {
            noPreviousData: "前のページデータがありません。最初のページを先に作成してください。",
            noDisplayPeriod: "掲示期間情報がありません。最初のページで掲示期間を入力してください。",
            validationError: "必須情報をすべて正しく入力してください。",
            registrationSuccess: "展示会登録完了！",
            registrationError: "登録中にエラーが発生しました。"
          },
          form: {
            maxCapacity: "最大収容人数",
            maxCapacityPlaceholder: "例：1000",
            description: "展示会詳細紹介",
            category: "カテゴリ",
            categoryPlaceholder: "カテゴリを選択してください",
            premiumService: "プレミアム上位露出サービス申込",
            estimatedPayment: "💰 予想決済金額確認",
            estimatedPaymentDesc: "入力された情報をもとに予想決済金額を確認できます。",
            companyInfo: "会社情報",
            companyName: "会社名",
            businessNumber: "事業者番号",
            companyAddress: "会社住所",
            addressPlaceholder: "住所検索ボタンを押してください",
            addressSearch: "住所検索",
            close: "閉じる",
            representativeName: "代表者名",
            representativeContact: "代表者連絡先",
            representativeEmail: "代表者メールアドレス",
            emailPlaceholder: "例：hello@myce.com",
            cancel: "キャンセル",
            submit: "登録"
          }
        },

        // BrowseExpo
        browseExpo: {
          loadingCategories: "カテゴリ読み込み中...",
          errorCategories: "カテゴリ読み込みエラー: {{message}}",
          title: "全てのイベント",
          count: "{{count}}件のイベント"
        }
      }
    }
  }
};

// 리소스만 export (메인 i18n.js에서 병합용)
export default resources;