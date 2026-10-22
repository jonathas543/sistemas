(function () {
  // ===== CONFIGURAÇÃO =====
  // Cole aqui a URL do seu serviço de e-mail/CRM (webhook, Formspree, Google Apps Script...).
  // Se ficar vazio, o e-mail é salvo apenas neste navegador (modo teste).
  var ENDPOINT = "";

  var brl = function (v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
  var $ = function (id) { return document.getElementById(id); };

  // ===== Calculadora do hero =====
  var b = $("b"), s = $("s");
  function calc() {
    var B = Math.max(0, parseFloat(b.value) || 0), S = Math.max(0, parseFloat(s.value) || 0);
    var now = new Date(), total = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), day = now.getDate();
    var left = total - day + 1, rest = B - S, pace = B / total * day, over = S > pace;
    $("d").textContent = brl(rest > 0 ? rest / left : 0);
    $("dl").textContent = rest > 0 ? "para gastar por dia nos próximos " + left + " dias" : "Seu orçamento do mês acabou";
    $("fill").style.width = (B > 0 ? Math.min(100, S / B * 100) : 0) + "%";
    $("bar").classList.toggle("over", over);
    var st = $("st");
    st.classList.toggle("over", over);
    st.textContent = over
      ? "Alerta: você gastou " + brl(S - pace) + " acima do ritmo ideal para hoje."
      : "Você está dentro do ritmo. Siga o valor do dia e feche o mês no azul.";
  }
  b.addEventListener("input", calc);
  s.addEventListener("input", calc);
  calc();

  // ===== Captura de e-mail =====
  $("f").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = this.querySelector("input").value.trim();
    var msg = $("msg"), btn = this.querySelector("button");
    function done(ok, text) { msg.className = "msg " + (ok ? "ok" : "err"); msg.textContent = text; msg.style.display = "block"; btn.disabled = false; }
    btn.disabled = true;
    if (!ENDPOINT) {
      try { localStorage.setItem("meubolso_lead", email); } catch (x) {}
      return done(true, "Pronto! Você está na lista. Avisaremos em " + email + ".");
    }
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email, origem: "landing" }) })
      .then(function (r) { if (!r.ok) throw 0; done(true, "Pronto! Confira seu e-mail para acessar o Meu Bolso."); })
      .catch(function () { done(false, "Não foi possível enviar agora. Tente novamente em instantes."); });
  });

  $("ano").textContent = new Date().getFullYear();
})();
