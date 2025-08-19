import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 번역 리소스 (as const로 리터럴 타입 고정)
const resources = {
  ko: {
    translation: {
      // 공통
      common: {
        save: "저장",
        cancel: "취소",
        confirm: "확인",
        close: "닫기",
        loading: "로딩 중...",
        error: "오류",
        success: "성공",
        warning: "경고"
      },
      // 네비게이션
      nav: {
        home: "홈",
        expo: "박람회",
        mypage: "마이페이지",
        admin: "관리자",
        expoList: "박람회 목록",
        expoApply: "박람회 신청",
        adApply: "광고 신청",
        platformAdmin: "플랫폼 관리",
        logout: "로그아웃",
        login: "로그인",
        signup: "회원가입",
        reservationCheck: "예매 확인"
      },
      // 마이페이지
      mypage: {
        title: "마이페이지",
        userInfo: "회원 정보",
        reservation: "예매 내역",
        savedExpo: "찜한 박람회",
        systemSettings: "시스템 설정",
        languageSettings: "언어 설정",
        advertiserMenu: "광고주 메뉴",
        adsStatusMenu: "광고 현황",
        expoAdminMenu: "박람회 관리자 메뉴",
        expoStatusMenu: "박람회 신청 현황",
        mileage: "마일리지",
        basicInfo: "기본 정보",
        accountManagement: "계정 관리",
        name: "이름",
        birthDate: "생년월일",
        userId: "아이디",
        phoneNumber: "전화번호",
        email: "이메일",
        gender: "성별",
        female: "여자",
        male: "남자",
        modifyInfo: "정보 수정",
        changePassword: "비밀번호 변경",
        save: "저장",
        cancel: "취소",
        withdraw: "회원 탈퇴",
        withdrawWarning: "계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.",
        withdrawConfirm: "정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.",
        infoUpdated: "회원 정보가 수정되었습니다.",
        infoUpdateFailed: "회원 정보 수정에 실패했습니다.",
        withdrawSuccess: "회원 탈퇴가 완료되었습니다.",
        withdrawFailed: "회원 탈퇴에 실패했습니다.",
        adsStatus: {
          title: "내 광고 현황",
          totalAds: "총 {{count}}개의 광고",
          noAds: "등록된 광고가 없습니다.",
          loadError: "광고 목록을 불러오는데 실패했습니다.",
          table: {
            title: "제목",
            location: "광고 위치",
            period: "게시 기간",
            status: "상태"
          },
          status: {
            PENDING_APPROVAL: "승인 대기",
            PENDING_PAYMENT: "결제 대기",
            PENDING_PUBLISH: "게시 대기",
            PENDING_CANCEL: "취소 대기",
            PUBLISHED: "게시 중",
            REJECTED: "승인 거절",
            CANCELLED: "취소 완료",
            COMPLETED: "종료됨"
          },
          pagination: {
            prev: "이전",
            next: "다음"
          },
          aria: {
            goToDetail: "{{title}} 상세로 이동"
          }
        }
      },
      // 예매 내역
      reservation: {
        title: "예매 내역",
        reservationNumber: "예매번호",
        ticketName: "티켓 이름",
        ticketCount: "티켓수",
        ticketUnit: "매",
        reservationDate: "예매일",
        reservationDetail: "예매 상세",
        status: {
          cancelled: "취소됨",
          pending: "결제 대기",
          confirmed: "결제 완료"
        },
        noData: "예매 내역이 없습니다.",
        loadError: "예매 내역을 불러오는데 실패했습니다.",
        previous: "이전",
        next: "다음"
      },
      // 예매 상세
      reservationDetail: {
        title: "예약 확인",
        eventInfo: "참여 행사 정보",
        participants: "참여 인원",
        reservationInfo: "예매 정보",
        paymentInfo: "결제 정보",
        edit: "편집",
        save: "저장",
        cancel: "취소",
        loadError: "예약 정보를 불러오는데 실패했습니다.",
        notFound: "예약 정보를 찾을 수 없습니다.",
        updateSuccess: "참여 인원 정보가 성공적으로 업데이트되었습니다.",
        updateError: "참여 인원 정보 업데이트에 실패했습니다.",
        updateFailAlert: "업데이트에 실패했습니다. 다시 시도해주세요.",
        expoNotActive: "박람회 기간이 아닙니다.",
        table: {
          name: "이름",
          reservationNumber: "예매번호",
          gender: "성별",
          phone: "전화번호",
          email: "이메일",
          qrCheck: "QR 확인",
          select: "선택",
          male: "남자",
          female: "여자",
          cancelled: "취소됨",
          detail: "상세보기",
          outOfPeriod: "기간 외"
        },
        reservationFields: {
          reservationDate: "예매일",
          ticketName: "티켓 이름",
          ticketType: "티켓 타입",
          ticketCount: "티켓 장수",
          unitPrice: "단가",
          serviceFee: "서비스 수수료",
          expectedPayment: "예상 결제금액"
        },
        paymentFields: {
          paymentMethod: "결제방법",
          paymentDetail: "결제수단",
          totalAmount: "총 결제금액",
          usedMileage: "사용 마일리지",
          savedMileage: "적립 마일리지",
          memberGrade: "회원등급",
          mileageRate: "적립률",
          paidAt: "결제일시"
        },
        ticketTypes: {
          general: "일반",
          earlyBird: "얼리버드"
        },
        paymentMethods: {
          card: "카드",
          bankTransfer: "계좌이체",
          virtualAccount: "가상계좌",
          simplePay: "간편결제"
        },
        statusLabels: {
          confirmed: "예약 확정",
          cancelled: "예약 취소",
          pending: "결제 대기"
        },
        cancelButton: "예약 취소",
        cancelCompleted: "취소 완료"
      },
      // 찜한 박람회
      savedExpo: {
        title: "찜한 박람회",
        eventPeriod: "행사 기간",
        eventLocation: "행사 위치",
        noData: "찜한 박람회가 없습니다.",
        loadError: "찜한 박람회를 불러오는데 실패했습니다.",
        detailView: "상세보기",
        loading: "로딩 중..."
      },
      // 언어 설정
      language: {
        korean: "한국어",
        english: "English",
        japanese: "日本語",
        selectLanguage: "언어를 선택하세요",
        changeLanguage: "언어 변경",
        languageChanged: "언어가 변경되었습니다"
      },
      // 박람회
      expo: {
        title: "박람회",
        name: "박람회 이름",
        location: "위치",
        capacity: "최대 수용 인원",
        period: "개최 기간",
        operatingTime: "운영 시간",
        postPeriod: "게시 기간",
        premium: "프리미엄 노출",
        category: "카테고리",
        description: "상세 설명",
        companyInfo: "회사 정보",
        ticketInfo: "티켓 정보"
      }
    },
    expoStatus: {
      title: "신청 박람회 현황",
      loading: "로딩 중...",
      loadError: "신청 박람회를 불러오는데 실패했습니다.",
      noData: "신청한 박람회가 없습니다.",
      table: {
        no: "No.",
        expoName: "박람회명",
        appliedAt: "신청일",
        postPeriod: "게시 기간",
        location: "개최 장소",
        status: "상태",
        premium: "프리미엄"
      },
      pagination: {
        prev: "이전",
        next: "다음"
      },
      modal: {
        confirm: "확인"
      },
      status: {
        PENDING_APPROVAL: "승인 대기",
        PENDING_PAYMENT: "결제 대기",
        PENDING_PUBLISH: "게시 대기",
        PENDING_CANCEL: "취소 대기",
        PUBLISHED: "게시 중",
        PUBLISH_ENDED: "게시 종료",
        SETTLEMENT_REQUESTED: "정산 요청",
        COMPLETED: "종료됨",
        REJECTED: "승인 거절",
        CANCELLED: "취소 완료"
      }
    }
  },
  en: {
    translation: {
      // Common
      common: {
        save: "Save",
        cancel: "Cancel",
        confirm: "Confirm",
        close: "Close",
        loading: "Loading...",
        error: "Error",
        success: "Success",
        warning: "Warning"
      },
      // Navigation
      nav: {
        home: "Home",
        expo: "Expo",
        mypage: "My Page",
        admin: "Admin",
        expoList: "Expo List",
        expoApply: "Apply for Expo",
        adApply: "Apply for Ad",
        platformAdmin: "Platform Admin",
        logout: "Logout",
        login: "Login",
        signup: "Sign Up",
        reservationCheck: "Check Reservation"
      },
      // My Page
      mypage: {
        title: "My Page",
        userInfo: "User Information",
        reservation: "Reservation History",
        savedExpo: "Saved Expos",
        systemSettings: "System Settings",
        languageSettings: "Language Settings",
        advertiserMenu: "Advertiser Menu",
        adStatusMenu: "Ad Status",
        expoAdminMenu: "Expo Admin Menu",
        expoStatusMenu: "Expo Application Status",
        mileage: "Mileage",
        basicInfo: "Basic Information",
        accountManagement: "Account Management",
        name: "Name",
        birthDate: "Date of Birth",
        userId: "User ID",
        phoneNumber: "Phone Number",
        email: "Email",
        gender: "Gender",
        female: "Female",
        male: "Male",
        modifyInfo: "Edit Information",
        changePassword: "Change Password",
        save: "Save",
        cancel: "Cancel",
        withdraw: "Withdraw Membership",
        withdrawWarning: "Deleting your account will permanently delete all data.",
        withdrawConfirm: "Are you sure you want to withdraw? All data will be deleted.",
        infoUpdated: "Member information has been updated.",
        infoUpdateFailed: "Failed to update member information.",
        withdrawSuccess: "Membership withdrawal completed.",
        withdrawFailed: "Failed to withdraw membership.",
        adsStatus: {
          title: "My Ad Status",
          totalAds: "Total {{count}} ads",
          noAds: "No registered ads.",
          loadError: "Failed to load ad list.",
          table: {
            title: "Title",
            location: "Ad Location",
            period: "Display Period",
            status: "Status"
          },
          status: {
            PENDING_APPROVAL: "Pending Approval",
            PENDING_PAYMENT: "Pending Payment",
            PENDING_PUBLISH: "Pending Publication",
            PENDING_CANCEL: "Pending Cancellation",
            PUBLISHED: "Published",
            REJECTED: "Rejected",
            CANCELLED: "Cancelled",
            COMPLETED: "Completed"
          },
          pagination: {
            prev: "Prev",
            next: "Next"
          },
          aria: {
            goToDetail: "Go to {{title}} details"
          }
        }
      },
      // Reservation History
      reservation: {
        title: "Reservation History",
        reservationNumber: "Reservation Number",
        ticketName: "Ticket Name",
        ticketCount: "Ticket Count",
        ticketUnit: "tickets",
        reservationDate: "Reservation Date",
        reservationDetail: "Reservation Details",
        status: {
          cancelled: "Cancelled",
          pending: "Payment Pending",
          confirmed: "Payment Confirmed"
        },
        noData: "No reservation history found.",
        loadError: "Failed to load reservation history.",
        previous: "Previous",
        next: "Next"
      },
      // Reservation Detail
      reservationDetail: {
        title: "Reservation Confirmation",
        eventInfo: "Event Information",
        participants: "Participants",
        reservationInfo: "Reservation Information",
        paymentInfo: "Payment Information",
        edit: "Edit",
        save: "Save",
        cancel: "Cancel",
        loadError: "Failed to load reservation information.",
        notFound: "Reservation information not found.",
        updateSuccess: "Participant information has been successfully updated.",
        updateError: "Failed to update participant information.",
        updateFailAlert: "Update failed. Please try again.",
        expoNotActive: "Not during expo period.",
        table: {
          name: "Name",
          reservationNumber: "Reservation Number",
          gender: "Gender",
          phone: "Phone",
          email: "Email",
          qrCheck: "QR Check",
          select: "Select",
          male: "Male",
          female: "Female",
          cancelled: "Cancelled",
          detail: "Details",
          outOfPeriod: "Out of Period"
        },
        reservationFields: {
          reservationDate: "Reservation Date",
          ticketName: "Ticket Name",
          ticketType: "Ticket Type",
          ticketCount: "Ticket Count",
          unitPrice: "Unit Price",
          serviceFee: "Service Fee",
          expectedPayment: "Expected Payment"
        },
        paymentFields: {
          paymentMethod: "Payment Method",
          paymentDetail: "Payment Details",
          totalAmount: "Total Amount",
          usedMileage: "Used Mileage",
          savedMileage: "Earned Mileage",
          memberGrade: "Member Grade",
          mileageRate: "Mileage Rate",
          paidAt: "Payment Date"
        },
        ticketTypes: {
          general: "General",
          earlyBird: "Early Bird"
        },
        paymentMethods: {
          card: "Card",
          bankTransfer: "Bank Transfer",
          virtualAccount: "Virtual Account",
          simplePay: "Simple Pay"
        },
        statusLabels: {
          confirmed: "Reservation Confirmed",
          cancelled: "Reservation Cancelled",
          pending: "Payment Pending"
        },
        cancelButton: "Cancel Reservation",
        cancelCompleted: "Cancellation Completed"
      },
      // Saved Expos
      savedExpo: {
        title: "Saved Expos",
        eventPeriod: "Event Period",
        eventLocation: "Event Location",
        noData: "No saved expos found.",
        loadError: "Failed to load saved expos.",
        detailView: "View Details",
        loading: "Loading..."
      },
      // Language Settings
      language: {
        korean: "한국어",
        english: "English",
        japanese: "日本語",
        selectLanguage: "Select Language",
        changeLanguage: "Change Language",
        languageChanged: "Language has been changed"
      },
      // Expo
      expo: {
        title: "Expo",
        name: "Expo Name",
        location: "Location",
        capacity: "Maximum Capacity",
        period: "Event Period",
        operatingTime: "Operating Hours",
        postPeriod: "Posting Period",
        premium: "Premium Exposure",
        category: "Category",
        description: "Description",
        companyInfo: "Company Information",
        ticketInfo: "Ticket Information"
      }
    },
    expoStatus: {
      title: "My Expo Applications",
      loading: "Loading...",
      loadError: "Failed to load applied expos.",
      noData: "No applied expos.",
      table: {
        no: "No.",
        expoName: "Expo Name",
        appliedAt: "Applied On",
        postPeriod: "Posting Period",
        location: "Location",
        status: "Status",
        premium: "Premium"
      },
      pagination: { prev: "Prev", next: "Next" },
      modal: { confirm: "Confirm" },
      status: {
        PENDING_APPROVAL: "Pending Approval",
        PENDING_PAYMENT: "Pending Payment",
        PENDING_PUBLISH: "Pending Publication",
        PENDING_CANCEL: "Pending Cancellation",
        PUBLISHED: "Published",
        PUBLISH_ENDED: "Publication Ended",
        SETTLEMENT_REQUESTED: "Settlement Requested",
        COMPLETED: "Completed",
        REJECTED: "Rejected",
        CANCELLED: "Cancelled"
      }
    }
  },
  ja: {
    translation: {
      // 共通
      common: {
        save: "保存",
        cancel: "キャンセル",
        confirm: "確認",
        close: "閉じる",
        loading: "読み込み中...",
        error: "エラー",
        success: "成功",
        warning: "警告"
      },
      // ナビゲーション
      nav: {
        home: "ホーム",
        expo: "博覧会",
        mypage: "マイページ",
        admin: "管理者",
        expoList: "博覧会一覧",
        expoApply: "博覧会申請",
        adApply: "広告申請",
        platformAdmin: "プラットフォーム管理",
        logout: "ログアウト",
        login: "ログイン",
        signup: "会員登録",
        reservationCheck: "予約確認"
      },
      // マイページ
      mypage: {
        title: "マイページ",
        userInfo: "会員情報",
        reservation: "予約履歴",
        savedExpo: "お気に入り博覧会",
        systemSettings: "システム設定",
        languageSettings: "言語設定",
        advertiserMenu: "広告主メニュー",
        adStatusMenu: "広告状況",
        expoAdminMenu: "博覧会管理者メニュー",
        expoStatusMenu: "博覧会申請状況",
        mileage: "マイレージ",
        basicInfo: "基本情報",
        accountManagement: "アカウント管理",
        name: "名前",
        birthDate: "生年月日",
        userId: "ユーザーID",
        phoneNumber: "電話番号",
        email: "メールアドレス",
        gender: "性別",
        female: "女性",
        male: "男性",
        modifyInfo: "情報修正",
        changePassword: "パスワード変更",
        save: "保存",
        cancel: "キャンセル",
        withdraw: "会員脱退",
        withdrawWarning: "アカウントを削除すると、すべてのデータが永続的に削除されます。",
        withdrawConfirm: "本当に脱退しますか？すべてのデータが削除されます。",
        infoUpdated: "会員情報が修正されました。",
        infoUpdateFailed: "会員情報の修正に失敗しました。",
        withdrawSuccess: "会員脱退が完了しました。",
        withdrawFailed: "会員脱退に失敗しました。",
        adsStatus: {
          title: "私の広告状況",
          totalAds: "総{{count}}件の広告",
          noAds: "登録された広告がありません。",
          loadError: "広告リストの読み込みに失敗しました。",
          table: {
            title: "タイトル",
            location: "広告の場所",
            period: "掲載期間",
            status: "ステータス"
          },
          status: {
            PENDING_APPROVAL: "承認待ち",
            PENDING_PAYMENT: "支払い待ち",
            PENDING_PUBLISH: "公開待ち",
            PENDING_CANCEL: "キャンセル待ち",
            PUBLISHED: "公開中",
            REJECTED: "承認拒否",
            CANCELLED: "キャンセル済み",
            COMPLETED: "終了"
          },
          pagination: {
            prev: "前へ",
            next: "次へ"
          },
          aria: {
            goToDetail: "{{title}} の詳細に移動"
          }
        }
      },
      // 予約履歴
      reservation: {
        title: "予約履歴",
        reservationNumber: "予約番号",
        ticketName: "チケット名",
        ticketCount: "チケット枚数",
        ticketUnit: "枚",
        reservationDate: "予約日",
        reservationDetail: "予約詳細",
        status: {
          cancelled: "キャンセル済み",
          pending: "決済待ち",
          confirmed: "決済完了"
        },
        noData: "予約履歴がありません。",
        loadError: "予約履歴の読み込みに失敗しました。",
        previous: "前へ",
        next: "次へ"
      },
      // 予約詳細
      reservationDetail: {
        title: "予約確認",
        eventInfo: "参加イベント情報",
        participants: "参加者",
        reservationInfo: "予約情報",
        paymentInfo: "決済情報",
        edit: "編集",
        save: "保存",
        cancel: "キャンセル",
        loadError: "予約情報の読み込みに失敗しました。",
        notFound: "予約情報が見つかりません。",
        updateSuccess: "参加者情報が正常に更新されました。",
        updateError: "参加者情報の更新に失敗しました。",
        updateFailAlert: "更新に失敗しました。もう一度お試しください。",
        expoNotActive: "博覧会期間ではありません。",
        table: {
          name: "名前",
          reservationNumber: "予約番号",
          gender: "性別",
          phone: "電話番号",
          email: "メールアドレス",
          qrCheck: "QR確認",
          select: "選択",
          male: "男性",
          female: "女性",
          cancelled: "キャンセル済み",
          detail: "詳細",
          outOfPeriod: "期間外"
        },
        reservationFields: {
          reservationDate: "予約日",
          ticketName: "チケット名",
          ticketType: "チケットタイプ",
          ticketCount: "チケット枚数",
          unitPrice: "単価",
          serviceFee: "サービス手数料",
          expectedPayment: "予想決済金額"
        },
        paymentFields: {
          paymentMethod: "決済方法",
          paymentDetail: "決済手段",
          totalAmount: "総決済金額",
          usedMileage: "使用マイレージ",
          savedMileage: "獲得マイレージ",
          memberGrade: "会員等級",
          mileageRate: "積立率",
          paidAt: "決済日時"
        },
        ticketTypes: {
          general: "一般",
          earlyBird: "アーリーバード"
        },
        paymentMethods: {
          card: "カード",
          bankTransfer: "銀行振込",
          virtualAccount: "仮想口座",
          simplePay: "簡単決済"
        },
        statusLabels: {
          confirmed: "予約確定",
          cancelled: "予約キャンセル",
          pending: "決済待ち"
        },
        cancelButton: "予約キャンセル",
        cancelCompleted: "キャンセル完了"
      },
      // お気に入り博覧会
      savedExpo: {
        title: "お気に入り博覧会",
        eventPeriod: "イベント期間",
        eventLocation: "イベント場所",
        noData: "お気に入り博覧会がありません。",
        loadError: "お気に入り博覧会の読み込みに失敗しました。",
        detailView: "詳細を見る",
        loading: "読み込み中..."
      },
      // 言語設定
      language: {
        korean: "한국어",
        english: "English",
        japanese: "日本語",
        selectLanguage: "言語を選択してください",
        changeLanguage: "言語変更",
        languageChanged: "言語が変更されました"
      },
      // 博覧会
      expo: {
        title: "博覧会",
        name: "博覧会名",
        location: "場所",
        capacity: "最大収容人数",
        period: "開催期間",
        operatingTime: "運営時間",
        postPeriod: "掲載期間",
        premium: "プレミアム露出",
        category: "カテゴリー",
        description: "詳細説明",
        companyInfo: "会社情報",
        ticketInfo: "チケット情報"
      }
    }
  },
  expoStatus: {
    title: "申請博覧会の状況",
    loading: "読み込み中...",
    loadError: "申請した博覧会の読み込みに失敗しました。",
    noData: "申請した博覧会はありません。",
    table: {
      no: "No.",
      expoName: "博覧会名",
      appliedAt: "申請日",
      postPeriod: "掲載期間",
      location: "開催場所",
      status: "ステータス",
      premium: "プレミアム"
    },
    pagination: { prev: "前へ", next: "次へ" },
    modal: { confirm: "確認" },
    status: {
      PENDING_APPROVAL: "承認待ち",
      PENDING_PAYMENT: "支払い待ち",
      PENDING_PUBLISH: "公開待ち",
      PENDING_CANCEL: "キャンセル待ち",
      PUBLISHED: "公開中",
      PUBLISH_ENDED: "公開終了",
      SETTLEMENT_REQUESTED: "精算依頼",
      COMPLETED: "終了",
      REJECTED: "承認拒否",
      CANCELLED: "キャンセル済み"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    lng: localStorage.getItem('language') || 'ko',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });

export default i18n;
