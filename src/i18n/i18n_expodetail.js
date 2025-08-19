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
          },
          dropdown: {
            title: "티켓 구매",
            selectTicket: "티켓을 선택하세요",
            purchaseButton: "구매하기",
            remainingQuantityLabel: "남은 수량",
            saleNotStarted: "판매기간 아님",
            soldOutTooltip: "매진된 티켓입니다",
            salePeriodTooltip: "판매기간: {{start}} ~ {{end}}",
            alerts: {
              selectTicket: "티켓을 선택해주세요.",
              ticketSoldOut: "선택한 티켓이 매진되었습니다.",
              notInSalePeriod: "선택한 티켓의 판매 기간이 아닙니다."
            }
          },
          modal: {
            title: "티켓 구매",
            remainingLabel: "남은 수량",
            quantityLabel: "구매 수량",
            unitPriceLabel: "단가",
            quantityCount: "수량",
            totalPriceLabel: "총 결제 금액",
            noticesTitle: "구매 유의사항",
            cancelButton: "취소",
            purchaseButton: "구매하기",
            processing: "처리 중...",
            tickets: "매",
            notices: {
              refundPolicy: "환불 및 취소 정책",
              refundRules: {
                sevenDays: "박람회 시작 7일 전까지: 100% 환불",
                threeDays: "박람회 시작 3~6일 전까지: 80% 환불",
                oneDay: "박람회 시작 1~2일 전까지: 50% 환불",
                sameDay: "박람회 당일: 환불 불가"
              },
              ticketUsage: "티켓 사용 안내",
              usageRules: {
                qrGeneration: "구매 완료 후 박람회 개최 2일 전부터 QR 코드가 생성됩니다.",
                qrActivation: "티켓의 사용 개시 일자부터 QR 코드가 활성화 됩니다.",
                showQr: "박람회 당일 QR 코드를 제시해 주세요",
                noTransfer: "타인에게 양도/전매 시 입장이 제한될 수 있습니다",
                noReissue: "분실 시 재발급이 불가능하니 주의해 주세요"
              },
              otherInfo: "기타 안내",
              otherRules: {
                scheduleChange: "박람회 일정 변경 시 사전 공지됩니다",
                memberLimit: "회원의 경우 1인당 최대 4매까지 구매 가능합니다",
                guestLimit: "비회원의 경우 1인당 1매까지 구매 가능합니다",
                confirmation: "결제 완료 후 예매 확인서가 이메일로 발송됩니다",
                support: "문의사항은 AI 상담사 찍찍봇을 이용해 주세요"
              }
            },
            errors: {
              purchaseFailed: "티켓 구매 준비에 실패했습니다. 다시 시도해주세요."
            }
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
        
        // 결제 (ExpoPayment)
        expoPayment: {
          loading: "결제 정보를 불러오는 중...",
          error: "오류: {{error}}",
          personalInfo: {
            title: "개인정보 입력",
            loadMemberInfo: "회원 정보 불러오기",
            name: "이름",
            namePlaceholder: "이름을 입력하세요",
            email: "이메일 주소",
            emailPlaceholder: "example@email.com",
            birthdate: "생년월일",
            phone: "전화번호",
            gender: "성별",
            male: "남자",
            female: "여자"
          },
          expoInfo: {
            loading: "로딩 중...",
            noLocation: "장소 정보 없음",
            noSchedule: "일정 정보 없음",
            eventTitle: "행사 제목"
          },
          mileage: {
            title: "마일리지",
            available: "보유 마일리지",
            loading: "불러오는 중...",
            usagePlaceholder: "사용할 마일리지",
            useAll: "전액사용",
            apply: "마일리지 적용",
            afterApply: "적용 후 마일리지",
            loginRequired: "로그인 후 이용 가능합니다.",
            loadingError: "보유 마일리지 조회 중입니다. 잠시 후 다시 시도해주세요.",
            validNumberRequired: "사용할 마일리지는 0 이상의 숫자여야 합니다.",
            maxUsageExceeded: "최대 {{maxUse}} M 까지 사용할 수 있습니다.",
            loadFailed: "보유 마일리지를 불러오지 못했습니다."
          },
          summary: {
            title: "결제 요약",
            ticketCount: "티켓 매수",
            ticketPrice: "티켓 가격",
            serviceFee: "서비스 수수료",
            mileage: "마일리지",
            total: "총계",
            currency: "원"
          },
          paymentMethod: {
            title: "결제 방법 선택"
          },
          errors: {
            reservationNotFound: "예약 정보를 찾을 수 없습니다.",
            paymentInfoLoadFailed: "결제 정보를 불러오지 못했습니다."
          },
          alerts: {
            memberInfoLoaded: "회원 정보가 불러와졌습니다.",
            memberInfoLoadFailed: "회원 정보를 불러오는데 실패했습니다. (데이터 없음)",
            memberInfoLoadError: "회원 정보를 불러오는데 실패했습니다. 오류: {{error}}",
            loginRequired: "로그인 상태가 아닙니다."
          }
        },

        // 박람회 상세 메인 페이지 (ExpoDetail)
        expoDetailMain: {
          loading: "로딩 중...",
          navigation: {
            back: "이전으로"
          },
          tabs: {
            info: "상세 정보",
            tickets: "티켓 정보",
            booths: "부스 정보",
            events: "이벤트",
            reviews: "리뷰"
          },
          alerts: {
            bookmarkAdded: "북마크에 추가되었습니다.",
            bookmarkRemoved: "북마크에서 제거되었습니다.",
            loginRequired: "로그인이 필요한 서비스입니다.",
            bookmarkError: "찜하기 처리에 실패했습니다."
          },
          errors: {
            expoNotFound: "박람회 정보를 찾을 수 없습니다."
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
          },
          dropdown: {
            title: "Purchase Tickets",
            selectTicket: "Select a ticket",
            purchaseButton: "Purchase",
            remainingQuantityLabel: "Remaining",
            saleNotStarted: "Not for sale",
            soldOutTooltip: "This ticket is sold out",
            salePeriodTooltip: "Sale period: {{start}} ~ {{end}}",
            alerts: {
              selectTicket: "Please select a ticket.",
              ticketSoldOut: "The selected ticket is sold out.",
              notInSalePeriod: "The selected ticket is not in the sale period."
            }
          },
          modal: {
            title: "Purchase Tickets",
            remainingLabel: "Remaining",
            quantityLabel: "Quantity",
            unitPriceLabel: "Unit Price",
            quantityCount: "Quantity",
            totalPriceLabel: "Total Amount",
            noticesTitle: "Purchase Notice",
            cancelButton: "Cancel",
            purchaseButton: "Purchase",
            processing: "Processing...",
            tickets: "tickets",
            notices: {
              refundPolicy: "Refund & Cancellation Policy",
              refundRules: {
                sevenDays: "Up to 7 days before expo: 100% refund",
                threeDays: "3-6 days before expo: 80% refund",
                oneDay: "1-2 days before expo: 50% refund",
                sameDay: "Expo day: No refund"
              },
              ticketUsage: "Ticket Usage Guide",
              usageRules: {
                qrGeneration: "QR code will be generated 2 days before the expo starts.",
                qrActivation: "QR code will be activated from the ticket start date.",
                showQr: "Please present your QR code on the expo day",
                noTransfer: "Entry may be restricted if transferred to others",
                noReissue: "Reissue is not possible if lost, please be careful"
              },
              otherInfo: "Other Information",
              otherRules: {
                scheduleChange: "Schedule changes will be announced in advance",
                memberLimit: "Members can purchase up to 4 tickets per person",
                guestLimit: "Guests can purchase up to 1 ticket per person",
                confirmation: "Reservation confirmation will be sent via email after payment",
                support: "Please use AI chatbot for inquiries"
              }
            },
            errors: {
              purchaseFailed: "Failed to prepare ticket purchase. Please try again."
            }
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
        
        // Payment (ExpoPayment)
        expoPayment: {
          loading: "Loading payment information...",
          error: "Error: {{error}}",
          personalInfo: {
            title: "Personal Information",
            loadMemberInfo: "Load Member Info",
            name: "Name",
            namePlaceholder: "Enter your name",
            email: "Email Address",
            emailPlaceholder: "example@email.com",
            birthdate: "Date of Birth",
            phone: "Phone Number",
            gender: "Gender",
            male: "Male",
            female: "Female"
          },
          expoInfo: {
            loading: "Loading...",
            noLocation: "No location information",
            noSchedule: "No schedule information",
            eventTitle: "Event Title"
          },
          mileage: {
            title: "Mileage",
            available: "Available Mileage",
            loading: "Loading...",
            usagePlaceholder: "Mileage to use",
            useAll: "Use All",
            apply: "Apply Mileage",
            afterApply: "Mileage After Apply",
            loginRequired: "Available after login.",
            loadingError: "Checking available mileage. Please try again later.",
            validNumberRequired: "Mileage to use must be a number above 0.",
            maxUsageExceeded: "You can use up to {{maxUse}} M.",
            loadFailed: "Failed to load available mileage."
          },
          summary: {
            title: "Payment Summary",
            ticketCount: "Ticket Count",
            ticketPrice: "Ticket Price",
            serviceFee: "Service Fee",
            mileage: "Mileage",
            total: "Total",
            currency: "KRW"
          },
          paymentMethod: {
            title: "Select Payment Method"
          },
          errors: {
            reservationNotFound: "Reservation information not found.",
            paymentInfoLoadFailed: "Failed to load payment information."
          },
          alerts: {
            memberInfoLoaded: "Member information loaded.",
            memberInfoLoadFailed: "Failed to load member information. (No data)",
            memberInfoLoadError: "Failed to load member information. Error: {{error}}",
            loginRequired: "Not logged in."
          }
        },

        // Expo Detail Main Page (ExpoDetail)
        expoDetailMain: {
          loading: "Loading...",
          navigation: {
            back: "Back"
          },
          tabs: {
            info: "Details",
            tickets: "Tickets",
            booths: "Booths",
            events: "Events",
            reviews: "Reviews"
          },
          alerts: {
            bookmarkAdded: "Added to bookmarks.",
            bookmarkRemoved: "Removed from bookmarks.",
            loginRequired: "Login is required for this service.",
            bookmarkError: "Failed to process bookmark."
          },
          errors: {
            expoNotFound: "Expo information not found."
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
          },
          dropdown: {
            title: "チケット購入",
            selectTicket: "チケットを選択してください",
            purchaseButton: "購入する",
            remainingQuantityLabel: "残り",
            saleNotStarted: "販売期間外",
            soldOutTooltip: "このチケットは満席です",
            salePeriodTooltip: "販売期間: {{start}} ~ {{end}}",
            alerts: {
              selectTicket: "チケットを選択してください。",
              ticketSoldOut: "選択したチケットは満席です。",
              notInSalePeriod: "選択したチケットは販売期間ではありません。"
            }
          },
          modal: {
            title: "チケット購入",
            remainingLabel: "残り数量",
            quantityLabel: "購入数量",
            unitPriceLabel: "単価",
            quantityCount: "数量",
            totalPriceLabel: "合計金額",
            noticesTitle: "購入時のご注意",
            cancelButton: "キャンセル",
            purchaseButton: "購入する",
            processing: "処理中...",
            tickets: "枚",
            notices: {
              refundPolicy: "返金・キャンセルポリシー",
              refundRules: {
                sevenDays: "博覧会開始7日前まで: 100% 返金",
                threeDays: "博覧会開始3~6日前まで: 80% 返金",
                oneDay: "博覧会開始1~2日前まで: 50% 返金",
                sameDay: "博覧会当日: 返金不可"
              },
              ticketUsage: "チケット使用案内",
              usageRules: {
                qrGeneration: "購入完了後、博覧会開催2日前からQRコードが生成されます。",
                qrActivation: "チケット使用開始日からQRコードが有効化されます。",
                showQr: "博覧会当日にQRコードを提示してください",
                noTransfer: "他人への譲渡・転売時は入場制限される場合があります",
                noReissue: "紛失時の再発行はできませんのでご注意ください"
              },
              otherInfo: "その他のご案内",
              otherRules: {
                scheduleChange: "博覧会日程変更時は事前にお知らせします",
                memberLimit: "会員の場合、1人最大4枚まで購入可能です",
                guestLimit: "非会員の場合、1人1枚まで購入可能です",
                confirmation: "決済完了後、予約確認書がメールで送信されます",
                support: "お問い合わせはAIチャットボットをご利用ください"
              }
            },
            errors: {
              purchaseFailed: "チケット購入の準備に失敗しました。もう一度お試しください。"
            }
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
        
        // 決済 (ExpoPayment)
        expoPayment: {
          loading: "決済情報を読み込み中...",
          error: "エラー: {{error}}",
          personalInfo: {
            title: "個人情報入力",
            loadMemberInfo: "会員情報を読み込む",
            name: "氏名",
            namePlaceholder: "氏名を入力してください",
            email: "メールアドレス",
            emailPlaceholder: "example@email.com",
            birthdate: "生年月日",
            phone: "電話番号",
            gender: "性別",
            male: "男性",
            female: "女性"
          },
          expoInfo: {
            loading: "読み込み中...",
            noLocation: "場所情報がありません",
            noSchedule: "日程情報がありません",
            eventTitle: "イベントタイトル"
          },
          mileage: {
            title: "マイレージ",
            available: "保有マイレージ",
            loading: "読み込み中...",
            usagePlaceholder: "使用するマイレージ",
            useAll: "全額使用",
            apply: "マイレージ適用",
            afterApply: "適用後マイレージ",
            loginRequired: "ログイン後ご利用いただけます。",
            loadingError: "保有マイレージ照会中です。しばらく後でもう一度お試しください。",
            validNumberRequired: "使用するマイレージは0以上の数字である必要があります。",
            maxUsageExceeded: "最大{{maxUse}} Mまで使用できます。",
            loadFailed: "保有マイレージを読み込めませんでした。"
          },
          summary: {
            title: "決済要約",
            ticketCount: "チケット枚数",
            ticketPrice: "チケット価格",
            serviceFee: "サービス手数料",
            mileage: "マイレージ",
            total: "合計",
            currency: "円"
          },
          paymentMethod: {
            title: "決済方法選択"
          },
          errors: {
            reservationNotFound: "予約情報が見つかりません。",
            paymentInfoLoadFailed: "決済情報を読み込めませんでした。"
          },
          alerts: {
            memberInfoLoaded: "会員情報が読み込まれました。",
            memberInfoLoadFailed: "会員情報の読み込みに失敗しました。（データなし）",
            memberInfoLoadError: "会員情報の読み込みに失敗しました。エラー: {{error}}",
            loginRequired: "ログイン状態ではありません。"
          }
        },

        // 展示会詳細メインページ (ExpoDetail)
        expoDetailMain: {
          loading: "読み込み中...",
          navigation: {
            back: "戻る"
          },
          tabs: {
            info: "詳細情報",
            tickets: "チケット情報",
            booths: "ブース情報",
            events: "イベント",
            reviews: "レビュー"
          },
          alerts: {
            bookmarkAdded: "ブックマークに追加されました。",
            bookmarkRemoved: "ブックマークから削除されました。",
            loginRequired: "このサービスにはログインが必要です。",
            bookmarkError: "ブックマークの処理に失敗しました。"
          },
          errors: {
            expoNotFound: "展示会情報が見つかりません。"
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