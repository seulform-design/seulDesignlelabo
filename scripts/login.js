/**
 * LE LABO · login.js — demo-safe validation + social affordances
 */
(() => {
  if (typeof document === "undefined") return;

  const form = document.getElementById("login-form");
  const status = document.getElementById("login-status");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email");
    const pw = document.getElementById("login-password");
    if (email && !email.checkValidity()) {
      email.reportValidity();
      return;
    }
    if (pw && !pw.checkValidity()) {
      pw.reportValidity();
      return;
    }
    if (status) {
      status.textContent =
        "데모: 인증 서버에 연결되지 않았습니다. 비회원 주문은 체크아웃에서 이어갈 수 있습니다.";
    }
  });

  document.querySelectorAll(".social-btns .social-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (status) status.textContent = "데모: 소셜 로그인 위젯은 준비 중입니다.";
    });
  });

  document.getElementById("login-forgot-btn")?.addEventListener("click", () => {
    if (status) {
      status.textContent = "비밀번호 재설정은 데모에서 준비 중입니다. 고객센터로 문의해 주세요.";
    }
  });
})();
