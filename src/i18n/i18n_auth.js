// 인증 관련 i18n 리소스

const resources = {
  ko: {
    translation: {
      // 로그인 페이지
      login: {
        title: "로그인",
        subtitle: "계정에 로그인하세요",
        tabs: {
          member: "일반 회원",
          admin: "관리자"
        },
        form: {
          userId: "아이디",
          password: "비밀번호",
          userIdPlaceholder: "아이디를 입력하세요",
          passwordPlaceholder: "비밀번호를 입력하세요",
          loginButton: "로그인"
        },
        social: {
          or: "또는",
          kakaoLogin: "카카오로 로그인",
          googleLogin: "Google로 로그인",
          kakaoAlt: "카카오",
          googleAlt: "구글"
        },
        admin: {
          adminId: "관리자 아이디",
          adminCode: "관리자 코드",
          adminIdPlaceholder: "최상위 관리자 아이디를 입력하세요",
          adminCodePlaceholder: "관리자 코드를 입력하세요",
          adminLoginButton: "관리자 로그인"
        },
        footer: {
          findId: "아이디 찾기",
          findPassword: "비밀번호 찾기",
          signup: "회원가입"
        },
        validation: {
          userIdRequired: "아이디를 입력해주세요",
          passwordRequired: "비밀번호를 입력해주세요",
          adminCodeRequired: "사용자 코드를 입력해주세요"
        },
        messages: {
          loginFailed: "로그인에 실패했습니다",
          expoInfoLoadFailed: "박람회 정보를 불러오는데 실패했습니다. 메인 페이지로 이동합니다."
        }
      },

      // 회원가입 페이지
      signup: {
        title: "회원가입",
        form: {
          name: "이름",
          userId: "아이디",
          password: "비밀번호",
          confirmPassword: "비밀번호 확인",
          email: "이메일",
          birth: "생년월일",
          gender: "성별",
          phone: "핸드폰번호",
          male: "남자",
          female: "여자",
          namePlaceholder: "이름을 입력하세요",
          userIdPlaceholder: "아이디를 입력하세요",
          passwordPlaceholder: "비밀번호를 입력하세요",
          confirmPasswordPlaceholder: "비밀번호를 다시 입력하세요",
          emailPlaceholder: "이메일을 입력하세요",
          verificationCodePlaceholder: "인증번호를 입력하세요",
          duplicateCheck: "중복확인",
          sendVerification: "인증발송",
          verify: "확인",
          submitButton: "회원가입"
        },
        footer: {
          alreadyHaveAccount: "이미 계정이 있으신가요?",
          login: "로그인"
        },
        validation: {
          duplicateIdCheck: "아이디 중복 검사를 해주세요",
          emailVerification: "이메일 검증을 해주세요",
          nameLength: "이름은 2자 이상 10자 이하로 입력해주세요",
          passwordLength: "비밀번호는 6자 이상 12자 이하로 입력해주세요",
          passwordMismatch: "비밀번호가 일치하지 않습니다",
          phoneFormat: "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)",
          birthFormat: "생년월일 형식이 올바르지 않습니다.(YYYYMMDD)",
          duplicateId: "이미 존재하는 아이디입니다",
          availableId: "사용 가능한 아이디입니다",
          duplicateCheckFailed: "아이디 중복 검증에 실패했습니다",
          userIdFormat: "로그인 아이디는 5자 이상 20자 이하의 영어와 숫자로만 입력해주세요",
          emailFormat: "이메일 형식이 올바르지 않습니다"
        },
        messages: {
          success: "회원가입이 완료되었습니다",
          emailSent: "메일이 발송되었습니다",
          emailSendFailed: "메일 발송에 실패했습니다",
          verificationSuccess: "인증이 완료되었습니다",
          verificationFailed: "인증에 실패했습니다"
        }
      },

      // 아이디 찾기 페이지
      findId: {
        title: "아이디 찾기",
        form: {
          name: "이름",
          email: "이메일",
          namePlaceholder: "가입한 이메일을 입력하세요",
          emailPlaceholder: "가입한 이메일을 입력하세요",
          verificationCodePlaceholder: "인증번호를 입력하세요.",
          sendVerification: "인증발송",
          verify: "확인",
          submitButton: "아이디 찾기"
        },
        footer: {
          backToLogin: "로그인으로 돌아가기"
        },
        validation: {
          nameRequired: "이름을 입력해주세요",
          emailVerificationRequired: "이메일 인증을 완료해주세요",
          emailFormat: "이메일 형식이 올바르지 않습니다"
        },
        messages: {
          idNotFound: "아이디를 찾을 수 없습니다",
          emailSent: "메일이 발송되었습니다",
          emailSendFailed: "메일 발송에 실패했습니다",
          verificationSuccess: "인증이 완료되었습니다",
          verificationFailed: "인증에 실패했습니다"
        }
      },

      // 비밀번호 찾기 페이지
      findPassword: {
        title: "비밀번호 찾기",
        form: {
          name: "이름",
          userId: "아이디",
          email: "이메일",
          namePlaceholder: "이름을 입력하세요",
          userIdPlaceholder: "아이디를 입력하세요",
          emailPlaceholder: "가입시 사용한 이메일을 입력하세요",
          verificationCodePlaceholder: "인증번호를 입력하세요.",
          sendVerification: "인증발송",
          verify: "확인",
          submitButton: "임시 비밀번호 발송"
        },
        footer: {
          backToLogin: "로그인으로 돌아가기"
        },
        validation: {
          nameRequired: "이름을 입력해주세요",
          userIdRequired: "로그인아이디를 입력해주세요",
          emailVerificationRequired: "이메일 인증을 완료해주세요",
          emailFormat: "이메일 형식이 올바르지 않습니다"
        },
        messages: {
          emailSent: "메일이 발송되었습니다",
          emailSendFailed: "메일 발송에 실패했습니다",
          verificationSuccess: "인증이 완료되었습니다",
          verificationFailed: "인증에 실패했습니다",
          tempPasswordSent: "임시 비밀번호를 전송했습니다",
          memberNotFound: "회원 정보를 찾을 수 없습니다"
        }
      },

      // 공통
      common: {
        loading: "처리 중...",
        error: "오류가 발생했습니다",
        retry: "다시 시도",
        cancel: "취소",
        confirm: "확인",
        next: "다음",
        previous: "이전",
        complete: "완료",
        close: "닫기"
      }
    }
  },

  en: {
    translation: {
      // Login Page
      login: {
        title: "Login",
        tabs: {
          member: "General Member",
          admin: "Administrator"
        },
        form: {
          userId: "Username",
          password: "Password",
          userIdPlaceholder: "Enter username",
          passwordPlaceholder: "Enter password",
          loginButton: "Login"
        },
        social: {
          or: "Or",
          kakaoLogin: "Login with Kakao",
          googleLogin: "Login with Google",
          kakaoAlt: "Kakao",
          googleAlt: "Google"
        },
        admin: {
          adminId: "Administrator ID",
          adminCode: "Administrator Code",
          adminIdPlaceholder: "Enter administrator ID",
          adminCodePlaceholder: "Enter administrator code",
          adminLoginButton: "Administrator Login"
        },
        footer: {
          findId: "Find Username",
          findPassword: "Find Password",
          signup: "Sign Up"
        },
        validation: {
          userIdRequired: "Please enter your username",
          passwordRequired: "Please enter your password",
          adminCodeRequired: "Please enter user code"
        },
        messages: {
          loginFailed: "Login failed",
          expoInfoLoadFailed: "Failed to load exhibition information. Redirecting to main page."
        }
      },

      // Signup Page
      signup: {
        title: "Sign Up",
        form: {
          name: "Name",
          userId: "Username",
          password: "Password",
          confirmPassword: "Confirm Password",
          email: "Email",
          birth: "Date of Birth",
          gender: "Gender",
          phone: "Phone Number",
          male: "Male",
          female: "Female",
          namePlaceholder: "Enter your name",
          userIdPlaceholder: "Enter username",
          passwordPlaceholder: "Enter password",
          confirmPasswordPlaceholder: "Confirm password",
          emailPlaceholder: "Enter email",
          verificationCodePlaceholder: "Enter verification code",
          duplicateCheck: "Check Duplicate",
          sendVerification: "Send Verification",
          verify: "Verify",
          submitButton: "Sign Up"
        },
        footer: {
          alreadyHaveAccount: "Already have an account?",
          login: "Login"
        },
        validation: {
          duplicateIdCheck: "Please check for duplicate username",
          emailVerification: "Please verify your email",
          nameLength: "Name must be 2-10 characters long",
          passwordLength: "Password must be 6-12 characters long",
          passwordMismatch: "Passwords do not match",
          phoneFormat: "Invalid phone number format. (e.g., 010-1234-5678)",
          birthFormat: "Invalid date format (YYYYMMDD)",
          duplicateId: "Username already exists",
          availableId: "Username is available",
          duplicateCheckFailed: "Failed to check for duplicate username",
          userIdFormat: "Username must be 5-20 characters with letters and numbers only",
          emailFormat: "Invalid email format"
        },
        messages: {
          success: "Sign up completed successfully",
          emailSent: "Email sent successfully",
          emailSendFailed: "Failed to send email",
          verificationSuccess: "Verification completed",
          verificationFailed: "Verification failed"
        }
      },

      // Find ID Page
      findId: {
        title: "Find Username",
        form: {
          name: "Name",
          email: "Email",
          namePlaceholder: "Enter registered email",
          emailPlaceholder: "Enter registered email",
          verificationCodePlaceholder: "Enter verification code.",
          sendVerification: "Send Verification",
          verify: "Verify",
          submitButton: "Find Username"
        },
        footer: {
          backToLogin: "Back to Login"
        },
        validation: {
          nameRequired: "Name is required",
          emailVerificationRequired: "Please complete email verification",
          emailFormat: "Invalid email format"
        },
        messages: {
          idNotFound: "Username not found",
          emailSent: "Email sent",
          emailSendFailed: "Failed to send email",
          verificationSuccess: "Verification completed",
          verificationFailed: "Verification failed"
        }
      },

      // Find Password Page
      findPassword: {
        title: "Find Password",
        form: {
          name: "Name",
          userId: "Username",
          email: "Email",
          namePlaceholder: "Enter your name",
          userIdPlaceholder: "Enter username",
          emailPlaceholder: "Enter registered email",
          verificationCodePlaceholder: "Enter verification code.",
          sendVerification: "Send Verification",
          verify: "Verify",
          submitButton: "Send Temporary Password"
        },
        footer: {
          backToLogin: "Back to Login"
        },
        validation: {
          nameRequired: "Name is required",
          userIdRequired: "Username is required",
          emailVerificationRequired: "Please complete email verification",
          emailFormat: "Invalid email format"
        },
        messages: {
          emailSent: "Email sent",
          emailSendFailed: "Failed to send email",
          verificationSuccess: "Verification completed",
          verificationFailed: "Verification failed",
          tempPasswordSent: "Temporary password sent",
          memberNotFound: "Member information not found"
        }
      },

      // Common
      common: {
        loading: "Processing...",
        error: "An error occurred",
        retry: "Retry",
        cancel: "Cancel",
        confirm: "Confirm",
        next: "Next",
        previous: "Previous",
        complete: "Complete",
        close: "Close"
      }
    }
  },

  ja: {
    translation: {
      // ログインページ
      login: {
        title: "ログイン",
        tabs: {
          member: "一般会員",
          admin: "管理者"
        },
        form: {
          userId: "ユーザーID",
          password: "パスワード",
          userIdPlaceholder: "ユーザーIDを入力してください",
          passwordPlaceholder: "パスワードを入力してください",
          loginButton: "ログイン"
        },
        social: {
          or: "または",
          kakaoLogin: "カカオでログイン",
          googleLogin: "Googleでログイン",
          kakaoAlt: "カカオ",
          googleAlt: "Google"
        },
        admin: {
          adminId: "管理者ID",
          adminCode: "管理者コード",
          adminIdPlaceholder: "最上位管理者IDを入力してください",
          adminCodePlaceholder: "管理者コードを入力してください",
          adminLoginButton: "管理者ログイン"
        },
        footer: {
          findId: "ID検索",
          findPassword: "パスワード検索",
          signup: "会員登録"
        },
        validation: {
          userIdRequired: "ユーザーIDを入力してください",
          passwordRequired: "パスワードを入力してください",
          adminCodeRequired: "ユーザーコードを入力してください"
        },
        messages: {
          loginFailed: "ログインに失敗しました",
          expoInfoLoadFailed: "展示会情報の読み込みに失敗しました。メインページに移動します。"
        }
      },

      // 会員登録ページ
      signup: {
        title: "会員登録",
        form: {
          name: "お名前",
          userId: "ユーザーID",
          password: "パスワード",
          confirmPassword: "パスワード確認",
          email: "メールアドレス",
          birth: "生年月日",
          gender: "性別",
          phone: "携帯電話番号",
          male: "男性",
          female: "女性",
          namePlaceholder: "お名前を入力してください",
          userIdPlaceholder: "ユーザーIDを入力してください",
          passwordPlaceholder: "パスワードを入力してください",
          confirmPasswordPlaceholder: "パスワードを再入力してください",
          emailPlaceholder: "メールアドレスを入力してください",
          verificationCodePlaceholder: "認証番号を入力してください",
          duplicateCheck: "重複確認",
          sendVerification: "認証送信",
          verify: "確認",
          submitButton: "会員登録"
        },
        footer: {
          alreadyHaveAccount: "すでにアカウントをお持ちですか？",
          login: "ログイン"
        },
        validation: {
          duplicateIdCheck: "ユーザーIDの重複確認をしてください",
          emailVerification: "メール認証をしてください",
          nameLength: "お名前は2文字以上10文字以下で入力してください",
          passwordLength: "パスワードは6文字以上12文字以下で入力してください",
          passwordMismatch: "パスワードが一致しません",
          phoneFormat: "電話番号の形式が正しくありません。(例: 010-1234-5678)",
          birthFormat: "生年月日の形式が正しくありません。(YYYYMMDD)",
          duplicateId: "すでに存在するユーザーIDです",
          availableId: "使用可能なユーザーIDです",
          duplicateCheckFailed: "ユーザーID重複確認に失敗しました",
          userIdFormat: "ユーザーIDは5文字以上20文字以下の英数字のみで入力してください",
          emailFormat: "メールアドレスの形式が正しくありません"
        },
        messages: {
          success: "会員登録が完了しました",
          emailSent: "メールが送信されました",
          emailSendFailed: "メール送信に失敗しました",
          verificationSuccess: "認証が完了しました",
          verificationFailed: "認証に失敗しました"
        }
      },

      // ID検索ページ
      findId: {
        title: "ID検索",
        form: {
          name: "お名前",
          email: "メールアドレス",
          namePlaceholder: "登録されたメールアドレスを入力してください",
          emailPlaceholder: "登録されたメールアドレスを入力してください",
          verificationCodePlaceholder: "認証番号を入力してください。",
          sendVerification: "認証送信",
          verify: "確認",
          submitButton: "ID検索"
        },
        footer: {
          backToLogin: "ログインに戻る"
        },
        validation: {
          nameRequired: "お名前を入力してください",
          emailVerificationRequired: "メール認証を完了してください",
          emailFormat: "メールアドレスの形式が正しくありません"
        },
        messages: {
          idNotFound: "IDが見つかりません",
          emailSent: "メールが送信されました",
          emailSendFailed: "メール送信に失敗しました",
          verificationSuccess: "認証が完了しました",
          verificationFailed: "認証に失敗しました"
        }
      },

      // パスワード検索ページ
      findPassword: {
        title: "パスワード検索",
        form: {
          name: "お名前",
          userId: "ユーザーID",
          email: "メールアドレス",
          namePlaceholder: "お名前を入力してください",
          userIdPlaceholder: "ユーザーIDを入力してください",
          emailPlaceholder: "登録時に使用したメールアドレスを入力してください",
          verificationCodePlaceholder: "認証番号を入力してください。",
          sendVerification: "認証送信",
          verify: "確認",
          submitButton: "臨時パスワード送信"
        },
        footer: {
          backToLogin: "ログインに戻る"
        },
        validation: {
          nameRequired: "お名前を入力してください",
          userIdRequired: "ログインIDを入力してください",
          emailVerificationRequired: "メール認証を完了してください",
          emailFormat: "メールアドレスの形式が正しくありません"
        },
        messages: {
          emailSent: "メールが送信されました",
          emailSendFailed: "メール送信に失敗しました",
          verificationSuccess: "認証が完了しました",
          verificationFailed: "認証に失敗しました",
          tempPasswordSent: "臨時パスワードを送信しました",
          memberNotFound: "会員情報が見つかりません"
        }
      },

      // 共通
      common: {
        loading: "処理中...",
        error: "エラーが発生しました",
        retry: "再試行",
        cancel: "キャンセル",
        confirm: "確認",
        next: "次へ",
        previous: "前へ",
        complete: "完了",
        close: "閉じる"
      }
    }
  }
};

// 리소스만 export (메인 i18n.js에서 병합용)
export default resources;