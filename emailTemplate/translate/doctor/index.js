const {
  welcomeEmail_en,
  emailLink,
  welcomeEmail_rs,
  welcomeEmail_ch,
  welcomeEmail_nl,
  welcomeEmail_sp,
  welcomeEmail_de,
  welcomeEmail_fr,
  welcomeEmail_pt,
  welcomeEmail_sw,
  welcomeEmail_ar,
  welcomeEmail_tr,
  appointment_en,
  appointment_rs,
  appointment_nl,
  appointment_ch,
  appointment_sp,
  appointment_sw,
  appointment_de,
  appointment_fr,
  appointment_ar,
  appointment_pt,
  appointment_tr,
  precription_ar,
  precription_ch,
  precription_de,
  precription_en,
  precription_fr,
  precription_nl,
  precription_pt,
  precription_rs,
  precription_sp,
  precription_sw,
  precription_tr

} = require("./constent");

module.exports.doctorLang = {
  welcome_message_doctor: {
    en: welcomeEmail_en,
    rs: welcomeEmail_rs,
    ch: welcomeEmail_ch,
    nl: welcomeEmail_nl,
    sp: welcomeEmail_sp,
    de: welcomeEmail_de,
    fr: welcomeEmail_fr,
    pt: welcomeEmail_pt,
    sw: welcomeEmail_sw,
    ar: welcomeEmail_ar,
    tr:welcomeEmail_tr
  },
  apponitment_doctor: {
    en: appointment_en,
    rs: appointment_rs,
    ch: appointment_ch,
    nl: appointment_nl,
    sp: appointment_sp,
    de: appointment_de,
    sw: appointment_sw,
    fr: appointment_fr,
    pt: appointment_pt,
    ar: appointment_ar,
    tr:appointment_tr
  },
  prescription_sys_doc: {
    en: precription_en,
    rs: precription_rs,
    nl: precription_nl,
    sp: precription_sp,
    de: precription_de,
    sw: precription_sw,
    pt: precription_pt,
    ar: precription_ar,
    fr: precription_fr,
    ch: precription_ch,
    tr:precription_tr
  },
  sickc_system_doc: {
    en: `Dear {0}.<br><br><br>
    You received a new sick certificate request from {1}, {2}, on {3} at {4}.<br><br> 
    Please check the request inside your Aimedis profile. 
    If you have any questions, please contact the patient via {5} or {6}. Alternatively, you can contact us via ${emailLink} or the Aimedis support chat if you have difficulties contacting the patient.
`,
    ar: `<div class"arabic">عزيز {0}.
    <br><br><br> 
    لقد تلقيت طلب شهادة مرضية جديدة من {1} ، {2} ، بتاريخ {3} في {4}   
    <br><br> 
    يرجى التحقق من الطلب الموجود داخل ملف تعريف Aimedis الخاص بك. وإذا كانت لديك أي أسئلة ، فيرجى إذا كانت لديك أي أسئلة ، فيرجى الاتصال بالمريض عبر {6} أو {5} المريض. بدلاً من ذلك ، يمكنك الاتصال بنا عبر  ${emailLink} أو دردشة دعم Aimedis  في حالة انك كنت تواجه صعوبات في الاتصال بالمريض.
    </div>`,
    rs: `Уважаемый(-ая){0}.<br><br>Вы получили новый запрос на выписку     больничного   листа от пациента {1}, {2} на {3} в {4}.<br><br> Пожалуйста, примите запрос в вашем профиле Aimedis. Если у вас есть вопросы, пожалуйста, свяжитесь с пациентом по {5} или {6}. Кроме того, вы можете связаться с нами по адресу ${emailLink} или в чате службы поддержки Aimedis, если у вас возникли трудности во время связи с пациентом.
`,
    nl: `Beste {0}.<br><br><br>
     U heeft op {3} om {4} een nieuw verklaring van handicap ontvangen van {1}, {2}.
     Controleer het verzoek in uw Aimedis-profiel. Als u vragen heeft, neem dan contact op met de patiënt via {5} VAN DE PATIËNT of {6} VAN DE PATIËNT. Als alternatief kunt u contact met ons opnemen via ${emailLink} of de Aimedis-ondersteuningschat als u problemen ondervindt bij het contacteren van de patiënt.
`,
    sp: `Estimado {0}.<br><br><br>
      Ha recibido una nueva solicitud de certificado médico de {1}, {2}, el {3} a las {4}. Por favor, consulte la solicitud dentro de su perfil Aimedis. Si tiene alguna pregunta, por favor comuníquese con el paciente a través de CORREO {5} o {6}. Alternativamente, puede contactarnos a través de ${emailLink} o el chat de soporte Aimedis si tiene dificultades para comunicarse con el paciente.
`,
    de: `Sehr geehrter {0}.<br><br><br>

      Sie haben eine neue Krankenscheinanfrage von {1}, {2} am {3} um {4} erhalten.<br><br>
      Bitte bestätigen Sie den Termin in Ihrem Aimedis-Profil. 
      Bei Fragen wenden Sie sich bitte über {5} oder {6} an den Patienten. Alternativ können Sie uns über ${emailLink} oder den Aimedis-Support-Chat kontaktieren, wenn Sie Schwierigkeiten haben, den Patienten zu kontaktieren.`,
    sw: `Mpendwa {0}.<br<br>
       Ulipokea ombi jipya la cheti cha mgonjwa kutoka kitambulisho cha MGONJWA, JINA YA MGONGWA, TAREHE, SAA.
       Tafadhali angalia ombi ndani ya wasifu wako wa Aimedis. Ikiwa una maswali yoyote, tafadhali wasiliana na mgonjwa kupitia ANWANI YA EMAIL YA MGONJWA au NAMBA YA SIMU YA MGONJWA. Vinginevyo, unaweza kuwasiliana nasi kupitia ${emailLink} au mazungumzo ya msaada wa Aimedis ikiwa una shida kuwasiliana mgonjwa.
`,
    fr: `Cher {0}.<br<br><br>
       Vous avez reçu une nouvelle demande de certificat de maladie de {1}, {2}, le {3} à {4}. 
       Veuillez vérifier la demande dans votre profil Aimedis. Si vous avez des questions, veuillez contacter le patient via {5} ou {6}. Vous pouvez également nous contacter via ${emailLink} ou le chat d'assistance Aimedis si vous avez des difficultés à contacter le patient.
    `,
    pt: `Caro {0}.<br<br><br>
         Você recebeu uma nova solicitação de atestado de doença de {1}, {2}, em {3} às {4}.<br><br>
         Por favor, consulte a solicitação dentro do seu perfil Aimedis. Se você tiver alguma dúvida, entre em contato com o paciente por meio de {5} ou {6}. Alternativamente, pode nos contatar via ${emailLink} ou no chat de suporte Aimedis se tiver dificuldades para entrar em contato com o paciente.`,
    ch: `亲{0}。<br><br><br>
         您收到了来自{1}，{2}，{3}和{4}的新病假证明请求。
         请检查您的Aimedis个人资料中的请求。 如有任何疑问，请通过{5}或{6}与患者联系。 或者，您可以通过以下方式与我们联系${emailLink} 或Aimedis支持聊天，如果你有困难联系病人。`,
    tr:`Sayın {0}. <br> <br> <br>
    {3} tarihinde, {4} tarihinde {1}, {2} tarafından yeni bir hastalık raporu talebi aldınız. <br> <br>
    Lütfen Aimedis profilinizdeki isteği kontrol edin.
    Herhangi bir sorunuz varsa, lütfen hastayla {5} veya {6} aracılığıyla iletişime geçin. Alternatif olarak, hastayla iletişim kurmakta güçlük çekiyorsanız, $ {emailLink} veya Aimedis destek sohbeti aracılığıyla bizimle iletişime geçebilirsiniz.`
  },
  second_openion_doc: {
    en: `Dear {0}.<br><br>
    You received a new <b>second opinion </b>request from {1}, {2}, on {3} at {4}.<br><br> 
    Please check the request inside your Aimedis profile. 
    If you have any questions, please contact the patient via {5} or {6}. Alternatively, you can contact us via ${emailLink} or the Aimedis support chat if you have difficulties contacting the patient.`,

    ar: `<div class="arabic">عزيز {0}.
    <br><br><br> 
    لقد تلقيت طلب <b> رأي ثان </ b> جديدًا من {1} ، {2} ، بتاريخ {3} في {4}  
    <br><br>
   يرجى التحقق من الطلب الموجود داخل ملف تعريف Aimedis الخاص بك. وإذا كانت لديك أي أسئلة ، فيرجىإذا كانت لديك أي أسئلة ، فيرجى الاتصال بالمريض عبر {5} أو {6} المريض. بدلاً من ذلك ، يمكنك الاتصال بنا عبر  ${emailLink} أو دردشة دعم Aimedis  في حالة انك كنت تواجه صعوبات في الاتصال بالمريض.
   
   </div>`,

    rs: `Уважаемый(-ая){0}.<br><br>Вы получили новый <b>запрос на составление второго мнения</b> от пациента {1}, {2} на {3} в {4}. Пожалуйста, примите запрос в вашем профиле Aimedis. Если у вас есть вопросы, пожалуйста, свяжитесь с пациентом по {5} или {6}. Кроме того, вы можете связаться с нами по адресу ${emailLink} или в чате службы поддержки Aimedis, если у вас возникли трудности во время связи с пациентом.

`,
    nl: `Beste {0}.<br><br>
U heeft op {3} om {4} een nieuw tweede mening ontvangen van {1}, {2}.<br>
Controleer het verzoek in uw Aimedis-profiel. Als u vragen heeft, neem dan contact op met de patiënt via {5} VAN DE PATIËNT of {6} VAN DE PATIËNT. Als alternatief kunt u contact met ons opnemen via ${emailLink} of de Aimedis-ondersteuningschat als u problemen ondervindt bij het contacteren van de patiënt.
`,
    sp: `Estimado {0}.<br><br>.
Ha recibido una nueva solicitud de segunda opinión de {1}, {2}, el {3} a las {4}. Por favor, consulte la solicitud dentro de su perfil Aimedis. Si tiene alguna pregunta, comuníquese con el paciente a través de CORREO {5} o {6}. Alternativamente, puede contactarnos a través de ${emailLink} o el chat de soporte Aimedis si tiene dificultades para comunicarse con el paciente
`,
    de: `sehr geehrter {0}.<br><br><br>
    Sie haben eine Zweitmeinungsanfrage für {1}, {2} am {3} at {4}.
Bitte bestätigen Sie den Termin in Ihrem Aimedis-Profil. Bei Fragen wenden Sie sich bitte über die {5} oder die {6} an den Patienten. Alternativ können Sie uns über ${emailLink} oder den Aimedis-Support-Chat kontaktieren, wenn Sie Schwierigkeiten haben, den Patienten zu kontaktieren.
`,
    sw: `Mpendwa {0}.<br<br><br>
    Ulipokea <b> ombi la pili </b> ombi kutoka kwa {1}, {2}, mnamo {3} saa {4}.<br><br>
Tafadhali angalia ombi ndani ya wasifu wako wa Aimedis. Ikiwa una maswali yoyote, tafadhali wasiliana na mgonjwa kupitia {5} au {6}. Vinginevyo, unaweza kuwasiliana nasi kupitia ${emailLink} au mazungumzo ya msaada wa Aimedis ikiwa una shida kuwasiliana mgonjwa.
`,
    fr: `Cher {0}.<br><br><br>
Vous avez reçu une nouvelle demande de <b> deuxième avis </b> de {1}, {2}, le {3} à {4}. <br><br>
Veuillez vérifier la demande dans votre profil Aimedis. Si vous avez des questions, veuillez contacter le patient via {5} ou {6}. Vous pouvez également nous contacter via ${emailLink} ou le chat d'assistance Aimedis si vous avez des difficultés à contacter le patient.
`,
    pt: `Caro {0}.<br><br><br>

Você recebeu uma nova solicitação de <b> segunda opinião </b> de {1}, {2}, em {3} às {4}. <br><br>

Por favor, consulte a solicitação dentro do seu perfil Aimedis. Se você tiver alguma dúvida, entre em contato com o paciente por meio de {5} ou {6}. Alternativamente, pode nos contatar via ${emailLink} ou no chat de suporte Aimedis se tiver dificuldades para entrar em contato com o paciente.
`,
    ch: `亲 {0}。<br><br><br>

您收到了{1}，{2}在{3}在{4}发出的新的<b>第二意见</ b>请求。<br><br>
请检查您的Aimedis个人资料中的请求。 如有任何疑问，请通过{5}或{6}与患者联系。 或者，您可以通过以下方式与我们联系${emailLink} 或Aimedis支持聊天，如果你有困难联系病人。
`,
tr:`Sayın {0}. <br> <br>
{4} tarihinde {3} tarihinde {1}, {2} tarafından yeni bir <b> ikinci görüş </b> isteği aldınız. <br> <br>
Lütfen Aimedis profilinizdeki isteği kontrol edin.
Herhangi bir sorunuz varsa, lütfen hastayla {5} veya {6} aracılığıyla iletişime geçin. Alternatif olarak, hastayla iletişim kurmakta güçlük çekiyorsanız, $ {emailLink} veya Aimedis destek sohbeti aracılığıyla bizimle iletişime geçebilirsiniz.`
  },
  handled_prescription_doc: {
    en: `Dear {0}.<br><br><br>
    The prescription for {1}, {2}, on {3} at {4}, was handled by the pharmacy {5}, {6} on {9} at {10}.<br><br>
    If you have any questions, please contact the pharmacy via {7} or {8}. Alternatively, you can contact us via ${emailLink} or the Aimedis support chat if you have difficulties contacting the pharmacy.
`,
    ar: `<div class="arabic">عزيز {0}.
      <br><br><br>
      تم التعامل مع وصفة طبية لـ {1} ، {2} ، بتاريخ {3} في {4} ، بواسطة الصيدلية {5} ، {6} بتاريخ {9} في {10}    <br><br>
          إذا كان لديك أي أسئلة ، يرجى الاتصال بالصيدلية عبر عنوان البريد الإلكتروني للصيدلية أو رقم هاتف الصيدلية. بدلاً من ذلك ، يمكنك الاتصال بنا عبر ${emailLink} أو دردشة دعم Aimedis في حالة انك  كنت تواجه صعوبات في الاتصال بالصيدلية.
   `,
    rs: `Уважаемый(-ая){0}.<br><br><br>Рецепт на {1}, {2}, {3} в {4}, был получен   в аптеке {5}, {6} {9} в {10}.<br><br>
      Если у вас есть вопросы, пожалуйста, свяжитесь с аптекой по адресу {7} или {8}. Кроме того, вы можете связаться с нами по адресу  ${emailLink} или в чате службы поддержки Aimedis, если у вас возникли трудности во время связи с аптекой.
`,
    nl: `Beste {0}.<br><br><br>
      Het recept voor {1}, {2}, op {3} om {4}, werd afgehandeld door de apotheek {5}, {6} op {9} om {10}.<br><br>
      Als u vragen heeft, neem dan contact op met de apotheek via {7}  of {8} . Als alternatief kunt u contact met ons opnemen via ${emailLink} of de Aimedis-ondersteuningschat als u problemen ondervindt bij het contacteren van de apotheek.

`,
    sp: `Estimado {0}.<br><br><br>
      La receta de {1}, {2}, el {3} en {4}, fue manejada por la farmacia {5}, {6} el {9} en {10}.<br><br>
      Si tiene alguna pregunta, comuníquese con la farmacia a través de CORREO {7} o {8}. Alternativamente, puede contactarnos a través de ${emailLink} o el chat de soporte Aimedis si tiene dificultades para comunicarse con la farmacia.
`,
    de: `sehr geehrter {0}.<br><br><br>
      Das Rezept für {1}, {2} am {3} um {4} wurde von der Apotheke {5}, {6} am {9} um {10} bearbeitet.<br><br>
      Bei Fragen wenden Sie sich bitte über {7} oder {8} an die Apotheke. Alternativ können Sie uns über ${emailLink} oder den Aimedis-Support-Chat kontaktieren, wenn Sie Schwierigkeiten haben, die Apotheke zu kontaktieren.`,
    sw: `Mpendwa {0}.<br<br><br>
      Dawa ya {1}, {2}, mnamo {3} saa {4}, ilishughulikiwa na duka la dawa {5}, {6} mnamo {9} saa {10}.<br><br>
       Ikiwa una maswali yoyote, tafadhali wasiliana na duka la dawa kupitia {7} au {8}. Vinginevyo, unaweza kuwasiliana nasi kupitia ${emailLink} au mazungumzo ya msaada wa Aimedis ikiwa una shida kuwasiliana na duka la dawa.
`,
    fr: `Cher {0}.<br<br><br>

    La prescription pour {1}, {2}, le {3} à {4}, a été traitée par la pharmacie {5}, {6} le {9} à {10}.<br><br>
    Si vous avez des questions, veuillez contacter la pharmacie via {7} ou {8}. Vous pouvez également nous contacter via ${emailLink} ou le chat d'assistance Aimedis si vous avez des difficultés à contacter la pharmacie.
    `,

    pt: `Caro {0}.<br><br><br>
    A receita para {1}, {2}, em {3} em {4}, foi entregue à farmácia {5}, {6} em {9} em {10}.<br><br>
    Se você tiver alguma dúvida, entre em contato com a farmácia via {7} ou {8}. Alternativamente, pode nos contatar via ${emailLink} ou no chat de suporte Aimedis se tiver dificuldades para entrar em contato com a farmácia.
    `,
    ch: `亲 {0}。<br<br><br><br>

    {4}在{3}的{1} {2}處方由{10}在{9}的{5}，{6}藥房處理。
    如有任何疑问，请通过{7}或{8}与药房联系。 或者，您可以通过以下方式与我们联系${emailLink} 如果您在联系药房时遇到困难，请联系Aimedis支持聊天。`,
    tr:`Sayın {0}. <br> <br> <br>
    {4} adresindeki {3} {1}, {2} reçetesi, {10} {9} tarihinde eczane {5} tarafından {6} ele alındı. <br> <br>
    Herhangi bir sorunuz varsa, lütfen {7} veya {8} aracılığıyla eczaneye başvurun. Eczaneyle iletişime geçmekte güçlük çekiyorsanız, alternatif olarak, $ {emailLink} veya Aimedis destek sohbeti aracılığıyla bizimle iletişime geçebilirsiniz.`
  },
};

const apponitment_doctor_stru = [
  "DOCTORNAME",
  "NAME OF APPOINTMENT CALENDAR",
  "PATIENT ID",
  "PATIENTNAME",
  "DATE",
  "TIME",
  "PATIENT EMAIL ADDRESS",
  "PATIENT PHONE NUMBER",
];
const prescription_sys_doc_stru = [
  "DOCTORNAME",
  "PATIENT ID",
  "PATIENTNAME",
  "DATE",
  "TIME",
  "PATIENT EMAIL ADDRESS",
  "PATIENT PHONE NUMBER",
];

const sickc_system_doc_struc = [
  "DOCTORNAME",
  "PATIENT ID",
  "PATIENTNAME",
  "DATE",
  "TIME",
  "PATIENT EMAIL ADDRESS",
  "PATIENT PHONE NUMBER",
];

const second_openion_doc_strc = [
  "DOCTORNAME",
  "PATIENT ID",
  "PATIENTNAME",
  "DATE",
  "TIME",
  "PATIENT EMAIL ADDRESS ",
  "PATIENT PHONE NUMBER",
];

const handled_prescription_doc = [
  "DOCTORNAME",
  "PATIENT ID",
  "PATIENTNAME",
  "DATE",
  "TIME",
  "PHARMACY ID",
  "PHARMACY NAME",
  "PHARMACY EMAIL ADDRESS",
  "PHARMACY PHONE NUMBER",
  "HANDLEDATE",
  "HANDLEDTIME",
];
