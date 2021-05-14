const {
  if_lost_2fa_en,
  if_lost_2fa_de,
  if_lost_2fa_nl,
  if_lost_2fa_ch,
  if_lost_2fa_sp,
  if_lost_2fa_pt,
  if_lost_2fa_ru,
  if_lost_2fa_sw,
  if_lost_2fa_ar,
  if_lost_2fa_fr,
} = require("./insurance/constant");

const arabicContainerstart = `<div class='arabic'>`;
const divclose = `</div>`;
module.exports = { arabicContainerstart, divclose };
module.exports.common = {
  reset_password: {
    en: "Aimedis – password reset",
    de: " Aimedis – Passwortwiederherstellung",
    nl: "Aimedis – wachtwoord reset",
    ch: "Aimedis-密码重置",
    sp: "Aimedis – restablecer contraseña",
    pt: "Aimedis – redefinir senha",
    ru: "Aimedis: Сброс пароля",
    sw: "Aimedis - Kuweka upya nenosiri",
    fr: "Aimedis - Réinitialisation du mot de passe",
    ar: `${arabicContainerstart}Aimedis - إعادة تعيين كلمة المرور${divclose}`,
    tr:`Aimedis – şifrenin yeniden düzenlenmesi`
  },
  dear: {
    en: "Dear",
    de: "Sehr geehrte*r",
    nl: "Beste",
    ch: "亲爱的保险/制药/研究-名称。",
    sp: "Estimado",
    pt: "Caro",
    ru: "Уважаемый(-ая)",
    sw: "BIMA Mpendwa",
    fr: "Cher",
    ar: "عزيزي",
    tr:'Sayın'
  },
  you_got_new_one: {
    en: "You forgot your password and requested a new one.",
    de: "Sie haben Ihr Passwort vergessen und ein neues angefordert.",
    nl:
      "U bent uw wachtwoord vergeten en heeft een nieuw wachtwoord aangevraagd.",
    ch: "您忘记了您的密码，并要求一个新的。",
    sp: "Olvido su contraseña y solicitó una nueva.",
    pt: "Esqueceu sua senha e solicitou uma nova.",
    ru: "Вы забыли свой пароль и запросили новый.",
    sw: "Umesahau nywila yako na umeomba mpya.",
    fr: "Vous avez oublié votre mot de passe et en avez demandé un nouveau.",
    ar: `${arabicContainerstart} لقد نسيت كلمة المرور الخاصة بك وطلبت كلمة مرور جديدة. ${divclose}`,
    tr:`Şifrenizi unuttunuz ve yeni bir tane istediniz.`
  },
  please_click_password: {
    en: "Please click this link to choose a new password:",
    de:
      "Bitte klicken Sie auf den folgenden Link, um ein neues Passwort festzulegen:",
    nl: "Klik op deze link om een nieuw wachtwoord te kiezen: ",
    ch: "请点击此链接选择新密码",
    sp:
      "Por favor, haga clic en este enlace para seleccionar una nueva contraseña:",
    pt: "Por favor, clique neste link para escolher uma nova senha:",
    ru: "Пожалуйста, нажмите на эту ссылку, чтобы установить новый пароль:",
    sw: "Tafadhali bonyeza kitufe hiki kuchagua nywila mpya:",
    fr: "Veuillez cliquer sur ce lien pour choisir un nouveau mot de passe:",
    ar: `${arabicContainerstart} الرجاء النقر فوق هذا الارتباط لاختيار كلمة مرور جديدة: ${divclose}`,
    tr:`Yeni bir şifre seçmek için lütfen bu bağlantıyı tıklayın:`
  },
  link_rest: {
    en: "LINK TO RESET PASSWORD",
    de: "LINK TO RESET PASSWORD",
    nl: "LINK TO RESET PASSWORD",
    rs: "LINK TO RESET PASSWORD",
    ch: "链接重置密码",
    sw: "LINK YA KUWEKA PASSWORD",
    sp: "LINK PARA RESTABLECER CONTRASEÑA",
    pt: "LINK PARA REDEFINIR SENHA",
    ar: `${arabicContainerstart} رابط لإعادة تعيين كلمة المرور ${divclose}`,
    fr: "LIEN POUR RÉINITIALISER LE MOT DE PASSE",
    tr:'ŞİFRE SIFIRLAMA BAĞLANTISI'
  },
  is2fa_lost: {
    en: if_lost_2fa_en,
    de: if_lost_2fa_de,
    nl: if_lost_2fa_nl,
    ch: if_lost_2fa_ch,
    sp: if_lost_2fa_sp,
    pt: if_lost_2fa_pt,
    ru: if_lost_2fa_ru,
    sw: if_lost_2fa_sw,
    ar: if_lost_2fa_ar,
    fr: if_lost_2fa_fr,
  },
  your_aimedis_team: {
    en: "Your Aimedis team",
    de: "Your Aimedis team",
    ch: "现在通过登录",
    nl: "Uw Aimedis-team",
    pt: "Timu yako ya Aimedis",
    rs: "Искренне ваша, Команда Aimedis",
    sp: "Su equipo Aimedis",
    sw: "Ingia sasa kupitia",
    fr: "Votre équipe Aimedis",
    ar: `${arabicContainerstart} فريق Aimedis الخاص بك ${divclose}`,
    tr:`Aimedis ekibiniz`
  },
  login_via: {
    en: "Log in now via",
    de: "Log in now via",
    ch: "现在通过登录",
    nl: "Log nu in via",
    pt: "Faça login agora via",
    rs: "Войдите прямо сейчас через",
    sp: "Inicie sesión ahora a través de",
    sw: "Timu yako ya Aimedis",
    fr: "Connectez-vous maintenant via",
    ar: `تسجيل الدخول الآن عبر `,
    tr:"Şimdi giriş yapın"
  },
  or_visit: {
    en: "or visit",
    de: "or visit",
    ch: "或访问",
    nl: "of bezoek",
    pt: "ou visite",
    rs: "или заходите на",
    sp: "o visite",
    sw: "au tembelea",
    fr: "ou visiter",
    ar: `أو زيارة`,
    tr:"veya ziyaret et"
  },
  welcome_title_aimedis: {
    en: "Welcome to Aimedis – your health platform",
    de: "Willkommen bei Aimedis – Ihre Gesundheitsplattform",
    ch: "欢迎来到Aimedis-您的健康平台",
    nl: "Welkom bij Aimedis - uw gezondheidsplatform",
    pt: "Bem-vindo à Aimedis - Sua Plataforma de Saúde",
    rs: "Добро пожаловать в Aimedis: Платформа для управления здоровьем",
    sp: "Bienvenidos a Aimedis – Su Plataforma de la Salud",
    sw: "Karibu Aimedis - Jukwaa lako la afya",
    fr: "Bienvenue sur Aimedis - votre plateforme de santé",
    ar: `${arabicContainerstart}Aimedis – مرحبا بكم في منصتكم `,
    tr:"Sağlık platformunuz Aimedis'e hoş geldiniz"
  },
  on: {
    en: "on",
    de: "am",
    ch: "于",
    nl: "op",
    pt: "on",
    rs: "on",
    sp: "on",
    sw: "mnamo",
    fr: "le",
    ar: "تشغيل",
    tr:'açık'
  },
  aimedis_appointment_system: {
    en: "Aimedis – appointment system",
    ar: "<div class='arabic'>Aimedis- نظام المواعيد</div>",
    ch: "Aimedis-预约系统",
    sw: "Aimedis - mfumo wa miadi",
    nl: "Aimedis – afsprakensysteem",
    de: "Aimedis – Terminbuchungssystem",
    sp: "Aimedis – sistema de citas",
    pt: "Aimedis – sistema de marcar cita",
    rs: "Aimedis: система записи на прием",
    fr: "Aimedis - système de rendez-vous",
    tr:"Aimedis - Randevu Sistemi"
  },
  aimedis_prescription_system: {
    en: "Aimedis – prescription system",
    ar: "<div class='arabic'>Aimedis- نظام الوصفات الطبية</div>",
    ch: "Aimedis –处方系统",
    sw: "Aimedis - mfumo wa Maagizo",
    nl: "Aimedis – receptsysteem",
    de: "Aimedis – eRezept",
    sp: "Aimedis – sistema de prescripción",
    pt: "Aimedis – sistema de prescrição",
    rs: "Aimedis: Система выписки рецептов",
    fr: "Aimedis - Système de prescription",
    tr:"Aimedis - reçete sistemi"
  },
  aimedis_sick_cert_system: {
    en: `Aimedis – sick certificate system`,
    ch: `Aimedis –生病证书系统`,
    nl: `Aimedis – verklaring van handicap`,
    rs: `Aimedis: Система выписки больничных`,
    sp: `Aimedis – sistema de certificado médico`,
    pt: `Aimedis – sistema de atestado médico`,
    fr: `Aimedis - Système de certificat de maladie`,
    de: `Aimedis – Online AU(Arbeitsunfähigkeitsbescheinigung)`,
    sw: `Aimedis - mfumo wa cheti cha wagonjwa`,
    ar: "<div class='arabic'>Aimedis- نظام الشهادات المرضيةد</div>",
    tr:"Aimedis - hastalık sertifika sistemi"
  },
  aimedis_second_opinion_system: {
    en: `Aimedis – second opinion system`,
    ch: `Aimedis –第二意见系统`,
    nl: `Aimedis – tweede mening`,
    rs: `Aimedis: Система второго мнения`,
    sp: `Aimedis – sistema de segunda opinión`,
    pt: `Aimedis – sistema de segunda opinião`,
    fr: `Aimedis - système de deuxième avis`,
    de: `Aimedis – Zweitmeinungsportal`,
    sw: `Aimedis - Mfumo wa maoni ya pili`,
    ar: "<div class='arabic'>Aimedis- نظام الرأي الثاني</div>",
    tr:"Aimedis - ikinci görüş sistemi"
  },
  dear_with_name: {
    en: "Dear {6} <br><br>",
    de: "Sehr geehrte*r {6} <br><br>",
    nl: "Beste {6} <br><br>",
    ch: "亲 {6}<br><br>",
    sp: "Estimado {6}<br><br>",
    pt: "Caro {6}<br><br>",
    ru: "Уважаемый(-ая) {6}<br><br>",
    sw: "BIMA Mpendwa {6}<br><br>",
    fr: "Cher {6}<br><br>",
    ar: "{6} عزيزي <br><br>",
    tr: "Sayın {6} <br><br>",
  },
  dear_with_name_onzero: {
    en: "Dear {0} .<br><br>",
    de: "Sehr geehrte*r {0}. <br><br>",
    nl: "Beste {0}. <br><br>",
    ch: "亲 {0}.<br><br>",
    sp: "Estimado {0}.<br><br>",
    pt: "Caro {0}.<br><br>",
    ru: "Уважаемый(-ая) {0}.<br><br>",
    sw: "BIMA Mpendwa {0}.<br><br>",
    fr: "Cher {0}<br><br>",
    ar: "{0} عزيزي <br><br>",
    tr: "Sayın {0} <br><br>",
  },
  aimedis_emergency_access: {
    en: "Aimedis – emergency access",
    ar: "<div class='arabic'>Aimedis - الوصول في حالات الطوارئ</div>",
    ch: "Aimedis –緊急通道",
    de: "Aimedis - Notfallzugang",
    nl: "Aimedis - noodtoegang",
    sp: "Aimedis - acceso de emergencia",
    sw: "Aimedis - ufikiaji wa dharura",
    pt: "Aimedis - acesso de emergência",
    rs: "Aimedis - экстренный доступ",
    fr: "Aimedis - Accès d'urgence",
    ar: `${arabicContainerstart} Aimedis - الوصول في حالات الطوارئ ${divclose}`,
    tr:"Aimedis - acil erişim"
  },
};
