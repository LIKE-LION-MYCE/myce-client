// 영수증/결제완료 관련 번역 리소스

const resources = {
  ko: {
    translation: {
      // AdsPaymentCompleted
      adsPaymentCompleted: {
        title: "광고 배너 등록 결제 완료",
        question: "문제가 있으신가요?",
        contact: "담당자 문의",
        buttons: {
          goToMain: "메인 페이지"
        }
      },

      // ExpoPaymentCompleted
      expoPaymentCompleted: {
        title: "박람회 등록 결제 완료",
        description: "아래는 관리자 코드입니다.",
        notice: "분실하지 않도록 주의해주세요.",
        adminCode: {
          label: "관리자 번호",
          value: "ab12bc123A53" // 실제로는 동적 값
        },
        question: "문제가 있으신가요?",
        contact: "담당자 문의",
        buttons: {
          goToDetail: "박람회 상세 페이지로 이동"
        }
      },

      // AdPaymentDetailModal
      adPaymentDetailModal: {
        title: "광고 결제 정보",
        fields: {
          adTitle: "광고명",
          applicant: "신청자",
          period: "게시 기간",
          totalDays: "총 게시일",
          dailyFee: "일일 광고비",
          totalAmount: "총 결제 금액"
        },
        units: {
          days: "일",
          currency: "원"
        },
        buttons: {
          cancel: "취소",
          pay: "결제하기",
          confirm: "확인"
        }
      },

      // RefundModal
      refundModal: {
        title: "예매 취소 및 환불",
        loading: "환불 정보를 확인하는 중...",
        sections: {
          refundInfo: "환불 정보"
        },
        fields: {
          originalAmount: "원본 결제금액",
          refundFee: "환불 수수료",
          actualRefundAmount: "실제 환불금액",
          restoreMileage: "복원 마일리지",
          deductMileage: "차감 마일리지",
          cancelReason: "취소 사유"
        },
        reasons: {
          personal: "개인 사정",
          schedule: "일정 변경",
          health: "건강상 이유",
          other: "기타"
        },
        units: {
          currency: "원",
          points: "P"
        },
        buttons: {
          cancel: "취소",
          refund: "환불 신청",
          processing: "처리중..."
        },
        messages: {
          confirmRefund: "정말로 환불하시겠습니까?",
          refundCompleted: "환불이 완료되었습니다.",
          errorFetch: "환불 정보를 가져올 수 없습니다.",
          errorProcess: "환불 처리 중 오류가 발생했습니다.",
          noRefundWarning: "환불 불가 기간입니다. 수수료가 100%로 환불금액이 없습니다."
        }
      },

      // 공통 영수증 요소들
      receipt: {
        common: {
          paymentDate: "결제일시",
          paymentMethod: "결제수단",
          totalAmount: "총 결제금액",
          currency: "원",
          status: {
            completed: "결제완료",
            pending: "결제대기",
            failed: "결제실패",
            cancelled: "결제취소"
          },
          buttons: {
            print: "영수증 출력",
            download: "영수증 다운로드",
            close: "닫기",
            confirm: "확인"
          },
          contact: {
            question: "문제가 있으신가요?",
            support: "고객지원 문의",
            phone: "전화 문의",
            email: "이메일 문의"
          }
        },
        details: {
          orderNumber: "주문번호",
          itemName: "상품명",
          period: "이용기간",
          quantity: "수량",
          unitPrice: "단가",
          subtotal: "소계",
          tax: "부가세",
          discount: "할인",
          finalAmount: "최종금액"
        }
      }
    }
  },
  en: {
    translation: {
      // AdsPaymentCompleted
      adsPaymentCompleted: {
        title: "Advertisement Banner Registration Payment Completed",
        question: "Do you have any issues?",
        contact: "Contact Support",
        buttons: {
          goToMain: "Main Page"
        }
      },

      // ExpoPaymentCompleted
      expoPaymentCompleted: {
        title: "Exhibition Registration Payment Completed",
        description: "Below is your admin code.",
        notice: "Please be careful not to lose it.",
        adminCode: {
          label: "Admin Number",
          value: "ab12bc123A53"
        },
        question: "Do you have any issues?",
        contact: "Contact Support",
        buttons: {
          goToDetail: "Go to Exhibition Detail Page"
        }
      },

      // AdPaymentDetailModal
      adPaymentDetailModal: {
        title: "Advertisement Payment Information",
        fields: {
          adTitle: "Advertisement Title",
          applicant: "Applicant",
          period: "Display Period",
          totalDays: "Total Display Days",
          dailyFee: "Daily Advertisement Fee",
          totalAmount: "Total Payment Amount"
        },
        units: {
          days: "days",
          currency: "KRW"
        },
        buttons: {
          cancel: "Cancel",
          pay: "Proceed to Payment",
          confirm: "Confirm"
        }
      },

      // RefundModal
      refundModal: {
        title: "Reservation Cancellation & Refund",
        loading: "Checking refund information...",
        sections: {
          refundInfo: "Refund Information"
        },
        fields: {
          originalAmount: "Original Payment Amount",
          refundFee: "Refund Fee",
          actualRefundAmount: "Actual Refund Amount",
          restoreMileage: "Restored Mileage",
          deductMileage: "Deducted Mileage",
          cancelReason: "Cancellation Reason"
        },
        reasons: {
          personal: "Personal Circumstances",
          schedule: "Schedule Change",
          health: "Health Reasons",
          other: "Other"
        },
        units: {
          currency: "KRW",
          points: "P"
        },
        buttons: {
          cancel: "Cancel",
          refund: "Request Refund",
          processing: "Processing..."
        },
        messages: {
          confirmRefund: "Are you sure you want to request a refund?",
          refundCompleted: "Refund has been completed successfully.",
          errorFetch: "Unable to retrieve refund information.",
          errorProcess: "An error occurred while processing the refund.",
          noRefundWarning: "Refund is not available. The fee is 100% and there is no refund amount."
        }
      },

      // 공통 영수증 요소들
      receipt: {
        common: {
          paymentDate: "Payment Date",
          paymentMethod: "Payment Method",
          totalAmount: "Total Amount",
          currency: "KRW",
          status: {
            completed: "Payment Completed",
            pending: "Payment Pending",
            failed: "Payment Failed",
            cancelled: "Payment Cancelled"
          },
          buttons: {
            print: "Print Receipt",
            download: "Download Receipt",
            close: "Close",
            confirm: "Confirm"
          },
          contact: {
            question: "Do you have any issues?",
            support: "Customer Support",
            phone: "Phone Inquiry",
            email: "Email Inquiry"
          }
        },
        details: {
          orderNumber: "Order Number",
          itemName: "Item Name",
          period: "Usage Period",
          quantity: "Quantity",
          unitPrice: "Unit Price",
          subtotal: "Subtotal",
          tax: "Tax",
          discount: "Discount",
          finalAmount: "Final Amount"
        }
      }
    }
  },
  ja: {
    translation: {
      // AdsPaymentCompleted
      adsPaymentCompleted: {
        title: "広告バナー登録決済完了",
        question: "問題がございますか？",
        contact: "担当者お問い合わせ",
        buttons: {
          goToMain: "メインページ"
        }
      },

      // ExpoPaymentCompleted
      expoPaymentCompleted: {
        title: "博覧会登録決済完了",
        description: "以下は管理者コードです。",
        notice: "紛失しないようご注意ください。",
        adminCode: {
          label: "管理者番号",
          value: "ab12bc123A53"
        },
        question: "問題がございますか？",
        contact: "担当者お問い合わせ",
        buttons: {
          goToDetail: "博覧会詳細ページへ移動"
        }
      },

      // AdPaymentDetailModal
      adPaymentDetailModal: {
        title: "広告決済情報",
        fields: {
          adTitle: "広告名",
          applicant: "申請者",
          period: "掲載期間",
          totalDays: "総掲載日",
          dailyFee: "日当広告費",
          totalAmount: "総決済金額"
        },
        units: {
          days: "日",
          currency: "円"
        },
        buttons: {
          cancel: "キャンセル",
          pay: "決済する",
          confirm: "確認"
        }
      },

      // RefundModal
      refundModal: {
        title: "予約キャンセル・返金",
        loading: "返金情報を確認中...",
        sections: {
          refundInfo: "返金情報"
        },
        fields: {
          originalAmount: "元の決済金額",
          refundFee: "返金手数料",
          actualRefundAmount: "実際の返金金額",
          restoreMileage: "復元マイレージ",
          deductMileage: "差引マイレージ",
          cancelReason: "キャンセル理由"
        },
        reasons: {
          personal: "個人的事情",
          schedule: "日程変更",
          health: "健康上の理由",
          other: "その他"
        },
        units: {
          currency: "円",
          points: "P"
        },
        buttons: {
          cancel: "キャンセル",
          refund: "返金申請",
          processing: "処理中..."
        },
        messages: {
          confirmRefund: "本当に返金しますか？",
          refundCompleted: "返金が完了しました。",
          errorFetch: "返金情報を取得できません。",
          errorProcess: "返金処理中にエラーが発生しました。",
          noRefundWarning: "返金不可期間です。手数料が100%で返金金額がありません。"
        }
      },

      // 공통 영수증 요소들
      receipt: {
        common: {
          paymentDate: "決済日時",
          paymentMethod: "決済手段",
          totalAmount: "総決済金額",
          currency: "円",
          status: {
            completed: "決済完了",
            pending: "決済待機",
            failed: "決済失敗",
            cancelled: "決済キャンセル"
          },
          buttons: {
            print: "領収書印刷",
            download: "領収書ダウンロード",
            close: "閉じる",
            confirm: "確認"
          },
          contact: {
            question: "問題がございますか？",
            support: "カスタマーサポート",
            phone: "電話お問い合わせ",
            email: "メールお問い合わせ"
          }
        },
        details: {
          orderNumber: "注文番号",
          itemName: "商品名",
          period: "利用期間",
          quantity: "数量",
          unitPrice: "単価",
          subtotal: "小計",
          tax: "付加価値税",
          discount: "割引",
          finalAmount: "最終金額"
        }
      }
    }
  }
};

// 리소스만 export (메인 i18n.js에서 병합용)
export default resources;