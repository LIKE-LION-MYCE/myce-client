// 메인 i18n.js에서 병합하므로 별도 초기화 불필요

const resources = {
  ko: {
    translation: {
      // EstimatedAdCostModal
      estimatedAdCostModal: {
        title: "예상 광고 이용료",
        loading: "광고 정보를 불러오는 중...",
        error: "광고 정보를 불러오는데 실패했습니다.",
        summary: {
          period: "광고 기간:",
          position: "광고 위치:",
          description: "위치 설명:",
          days: "일"
        },
        costDetails: {
          title: "상세 요금",
          dailyFee: "일 이용료",
          period: "광고 기간",
          totalCost: "예상 총 이용료",
          currency: "원",
          dailyUnit: "원/일"
        },
        notice: {
          title: "💡 안내사항",
          items: [
            "위 금액은 입력하신 정보를 바탕으로 한 예상 금액입니다.",
            "실제 결제 시 금액이 다를 수 있습니다.",
            "모든 요금은 부가세(VAT) 포함 금액입니다.",
            "광고 승인 후 결제가 진행됩니다."
          ]
        },
        noData: {
          selectPosition: "광고 위치를 선택해주세요.",
          selectPeriod: "광고 기간을 입력해주세요.",
          cannotCalculate: "예상 이용료를 계산할 수 없습니다."
        },
        buttons: {
          close: "×",
          confirm: "확인"
        }
      },

      // EstimatedPaymentModal
      estimatedPaymentModal: {
        title: "예상 결제금액",
        loading: "요금 정보를 불러오는 중...",
        error: "요금 정보를 불러오는데 실패했습니다.",
        cannotCalculate: "결제 금액을 계산할 수 없습니다.",
        summary: {
          period: "게시 기간:",
          plan: "요금제:",
          days: "일",
          basic: "기본",
          premium: "프리미엄"
        },
        paymentDetails: {
          title: "상세 요금",
          dailyUsageFee: "일 사용료",
          periodUsageFee: "기간별 사용료",
          basicDeposit: "기본 등록금",
          premiumFee: "프리미엄 이용료",
          estimatedDeposit: "예상 등록금",
          estimatedUsageFee: "예상 사용료",
          estimatedTotal: "예상 총 결제금액",
          currency: "원",
          dailyUnit: "원/일"
        },
        notice: {
          title: "💡 안내사항",
          items: [
            "위 금액은 입력하신 정보를 바탕으로 한 예상 금액입니다.",
            "실제 결제 시 금액이 다를 수 있습니다.",
            "모든 요금은 부가세(VAT) 포함 금액입니다."
          ]
        },
        buttons: {
          close: "×",
          confirm: "확인"
        }
      }
    }
  },
  en: {
    translation: {
      // EstimatedAdCostModal
      estimatedAdCostModal: {
        title: "Estimated Ad Cost",
        loading: "Loading ad information...",
        error: "Failed to load ad information.",
        summary: {
          period: "Ad Period:",
          position: "Ad Position:",
          description: "Position Description:",
          days: "days"
        },
        costDetails: {
          title: "Cost Details",
          dailyFee: "Daily Fee",
          period: "Ad Period",
          totalCost: "Estimated Total Cost",
          currency: "KRW",
          dailyUnit: "KRW/day"
        },
        notice: {
          title: "💡 Notice",
          items: [
            "The above amount is an estimated amount based on the information you entered.",
            "The actual payment amount may differ.",
            "All fees include VAT.",
            "Payment will proceed after ad approval."
          ]
        },
        noData: {
          selectPosition: "Please select an ad position.",
          selectPeriod: "Please enter the ad period.",
          cannotCalculate: "Cannot calculate estimated cost."
        },
        buttons: {
          close: "×",
          confirm: "Confirm"
        }
      },

      // EstimatedPaymentModal
      estimatedPaymentModal: {
        title: "Estimated Payment",
        loading: "Loading fee information...",
        error: "Failed to load fee information.",
        cannotCalculate: "Cannot calculate payment amount.",
        summary: {
          period: "Display Period:",
          plan: "Plan:",
          days: "days",
          basic: "Basic",
          premium: "Premium"
        },
        paymentDetails: {
          title: "Payment Details",
          dailyUsageFee: "Daily Usage Fee",
          periodUsageFee: "Period Usage Fee",
          basicDeposit: "Basic Registration Fee",
          premiumFee: "Premium Fee",
          estimatedDeposit: "Estimated Registration Fee",
          estimatedUsageFee: "Estimated Usage Fee",
          estimatedTotal: "Estimated Total Payment",
          currency: "KRW",
          dailyUnit: "KRW/day"
        },
        notice: {
          title: "💡 Notice",
          items: [
            "The above amount is an estimated amount based on the information you entered.",
            "The actual payment amount may differ.",
            "All fees include VAT."
          ]
        },
        buttons: {
          close: "×",
          confirm: "Confirm"
        }
      }
    }
  },
  ja: {
    translation: {
      // EstimatedAdCostModal
      estimatedAdCostModal: {
        title: "予想広告利用料",
        loading: "広告情報を読み込み中...",
        error: "広告情報の読み込みに失敗しました。",
        summary: {
          period: "広告期間:",
          position: "広告位置:",
          description: "位置説明:",
          days: "日"
        },
        costDetails: {
          title: "詳細料金",
          dailyFee: "日利用料",
          period: "広告期間",
          totalCost: "予想総利用料",
          currency: "円",
          dailyUnit: "円/日"
        },
        notice: {
          title: "💡 ご案内",
          items: [
            "上記金額は入力された情報に基づく予想金額です。",
            "実際の決済時に金額が異なる場合があります。",
            "すべての料金は付加価値税（VAT）込みの金額です。",
            "広告承認後に決済が進行されます。"
          ]
        },
        noData: {
          selectPosition: "広告位置を選択してください。",
          selectPeriod: "広告期間を入力してください。",
          cannotCalculate: "予想利用料を計算できません。"
        },
        buttons: {
          close: "×",
          confirm: "確認"
        }
      },

      // EstimatedPaymentModal
      estimatedPaymentModal: {
        title: "予想決済金額",
        loading: "料金情報を読み込み中...",
        error: "料金情報の読み込みに失敗しました。",
        cannotCalculate: "決済金額を計算できません。",
        summary: {
          period: "掲載期間:",
          plan: "料金プラン:",
          days: "日",
          basic: "基本",
          premium: "プレミアム"
        },
        paymentDetails: {
          title: "詳細料金",
          dailyUsageFee: "日使用料",
          periodUsageFee: "期間別使用料",
          basicDeposit: "基本登録金",
          premiumFee: "プレミアム利用料",
          estimatedDeposit: "予想登録金",
          estimatedUsageFee: "予想使用料",
          estimatedTotal: "予想総決済金額",
          currency: "円",
          dailyUnit: "円/日"
        },
        notice: {
          title: "💡 ご案内",
          items: [
            "上記金額は入力された情報に基づく予想金額です。",
            "実際の決済時に金額が異なる場合があります。",
            "すべての料金は付加価値税（VAT）込みの金額です。"
          ]
        },
        buttons: {
          close: "×",
          confirm: "確認"
        }
      }
    }
  }
};

// 리소스만 export (메인 i18n.js에서 병합용)
export default resources;