const {
  welcome_message_patient_de,
  welcome_message_patient_en,
  welcome_message_patient_nl,
  welcome_message_patient_rs,
  welcome_message_patient_ch,
  welcome_message_patient_sw,
  welcome_message_patient_sp,
  welcome_message_patient_pt,
  welcome_message_patient_fr,
  welcome_message_patient_ar,
  emailLink,
  licenseLink,
} = require("./constent");
const { common, arabicContainerstart, divclose } = require("../common");

module.exports.patientLang = {
  welcome_message_patient: {
    en: welcome_message_patient_en,
    de: welcome_message_patient_de,
    nl: welcome_message_patient_nl,
    rs: welcome_message_patient_rs,
    ch: welcome_message_patient_ch,
    sw: welcome_message_patient_sw,
    sp: welcome_message_patient_sp,
    pt: welcome_message_patient_pt,
    ar: welcome_message_patient_ar,
    fr: welcome_message_patient_fr,
  },
  there_was_an_emergancy_access: {
    en: `${
      common.dear_with_name.en
    } There was an emergency access to the data in your Aimedis profile. <br>The emergency access was made by {2} - {0} on {3}. If you believe that the access is improper,<br> please contact us immediately via ${emailLink}`,
    ar: `${common.dear_with_name.ar} عزيزي<br><br><br>

    هناك طريقة للوصول طارئ إلى البيانات الموجودة في ملف تعريف Aimedis الخاص بك. يتم الوصول في حالات الطوارئ بواسطة {2} - {0} on {3}.  إذا كنت تعتقد أن هذا الوصول غير لائق ، فيرجى الاتصال بنا على الفور عبر ${emailLink} .
    `,
    de: `${
      common.dear_with_name.de
    } Es gab einen Notfallzugriff auf die Daten in Ihrem Aimedis-Profil. Der Notfallzugang wurde von {2} - {0} am {3} vorgenommen. Wenn Sie der Meinung sind, dass der Zugang nicht ordnungsgemäß ist, kontaktieren Sie uns bitte umgehend unter ${emailLink}`,
    nl: `${
      common.dear_with_name.nl
    } Er was een noodtoegang tot de gegevens in uw Aimedis-profiel. De noodtoegang is gemaakt door {2} - {0} op {3}. Als u denkt dat de toegang niet correct is, neem dan onmiddellijk contact met ons op via ${emailLink}`,
    rs: `${
      common.dear_with_name.rs
    } Был зафиксирован экстренный доступ к данным в вашем профиле Aimedis. <br> получен {2} - {0} on {3}. Если вы считаете, что произошло<br> несанкционированное использование, обязательно напишите на ${emailLink}`,
    ch: `${
      common.dear_with_name.ch
    } 您的Aimedis配置文件中有一个紧急访问数据。 紧急访问由{2}-{0}于{3}进行。 如果您认为访问不当，请立即通过以下方式与我们联系 ${emailLink}`,
    sw: `${
      common.dear_with_name.sw
    } Kulikuwa na ufikiaji wa dharura wa data kwenye wasifu wako wa Aimedis. Ufikiaji wa dharura ulifanywa na {2}-{0} mnamo {3}. Ikiwa unaamini kuwa ufikiaji sio sahihi, tafadhali wasiliana nasi mara moja kupitia ${emailLink}`,
    sp: `${
      common.dear_with_name.sp
    } Hubo un acceso de emergencia a los datos en tu perfil Aimedis. El acceso de emergencia fue realizado por {2} - {0} on {3}. Si cree que el acceso es inadecuado, comuníquese con nosotros de inmediato a través de ${emailLink}`,
    pt: `${
      common.dear_with_name.pt
    } Houve um acesso de emergência aos dados no seu perfil Aimedis. O acesso de emergência foi feito por {2} - {0} on {3}. Se achar que o acesso é impróprio, entre em contato conosco imediatamente via ${emailLink}`,
    fr: `${
      common.dear_with_name.fr
    }Il y a eu un accès d'urgence aux données de votre profil Aimedis. L'accès d'urgence a été effectué par {2} - {0} le {3}. Si vous pensez que l'accès est inapproprié, veuillez nous contacter immédiatement via ${emailLink}`,
  },
  apoointment_message_pat: {
    en: `${
      common.dear_with_name.en
    } <br><br><br> You have an appointment with {0} on {5} at {3}. <br><br>
        If you cannot take the appointment, please cancel it at least 24 hours before.<br><br>
        If you have any questions, contact your doctor via <b>{4}</b>.<br> Alternatively, you can contact us via ${emailLink}.com or the Aimedis support chat if you have difficulties contacting your doctor.`,
    ar: `${arabicContainerstart} ${common.dear_with_name.ar} <br><br><br>
    لديك موعد مع {0} في {5} الساعة {3}.<br><br>
    إذا لم تتمكن من أخذ الموعد ، فيرجى إلغاؤه قبل 24 ساعة على <br><br>
    إذا كانت لديك أي أسئلة ، فاتصل بطبيبك عبر {4}. بدلاً من ذلك ، يمكنك الاتصال بنا عبر ${emailLink}  أو دردشة دعم Aimedis في حالة انك كنت تواجه صعوبات في الاتصال بطبيبك.`,

    ch: `${common.dear_with_name.ch} 您将在{5}日{3}与{0}约好。
        如果您无法接受预约，请至少提前24小时取消。
        如果您有任何疑问，请通过此处必须联系医生的电话号码与您的医生联系。 另外，如果您难以联系医生，可以通过${emailLink}.com或Aimedis支持聊天与我们联系`,
    nl: `${
      common.dear_with_name.nl
    } U heeft een afspraak met {0} op {5} om {3} uur.<br><br>
        Kunt u de afspraak niet maken, annuleer deze dan minimaal 24 uur van tevoren.<br><br>
        Als u vragen heeft, neem dan contact op met uw arts via <b>{4}<b>. Als alternatief kunt u contact met ons opnemen via ${emailLink}.com of de Aimedis-ondersteuningschat als u problemen heeft om contact op te nemen met uw arts.`,
    rs: `${
      common.dear_with_name.rs
    } У вас назначен прием у {0} на {5} в {3}. <br><br>
        Если вы не можете прийти на прием, пожалуйста, отмените его по крайней мере за 24 часа.<br><br>
        Если у вас есть вопросы, пожалуйста, свяжитесь с вашим доктором по телефону <b>{4}<b>. Кроме того, вы можете связаться с нами по адресу ${emailLink}.com или в чате службы поддержки Aimedis, если у вас возникли трудности во время связи с доктором.`,
    sp: `${
      common.dear_with_name.sp
    } Tiene una cita con {0} el {5} a las {3}. <br><br>
        Si no puede asistir a la cita, cancele al menos 24 horas antes.<br><br>
        Si tiene alguna pregunta, comuníquese con su médico a través del <b>{4}<b>. Alternativamente, puede contactarnos a través de ${emailLink}.com o el chat de soporte de Aimedis si tiene dificultades para comunicarse con su médico.`,
    pt: `${
      common.dear_with_name.pt
    } Tem uma consulta com {0} em {5} às {3}. <br><br>
        Se não puder fazer a consulta, cancele-a pelo menos 24 horas antes.<br><br>
        Se tiver alguma dúvida, entre em contato com seu médico via <b>{4}<b>. Alternativamente, pode nos contatar via ${emailLink}.com ou no chat de suporte Aimedis se tiver dificuldades para entrar em contato com o seu médico.`,
    fr: `${
      common.dear_with_name.fr
    } Vous avez un rendez-vous avec {0} le {5} à {3}. <br><br>
        Si vous ne pouvez pas vous rendre à ce rendez-vous, veuillez l'annuler au moins 24 heures à l'avance.<br><br>
        Si vous avez des questions, contactez votre médecin via <b>{4}<b>. Vous pouvez également nous contacter via ${emailLink}.com ou le chat de support Aimedis si vous avez des difficultés à contacter votre médecin.`,
    de: ` ${
      common.dear_with_name.de
    }Sie haben einen Termin mit {0} am {5} um {3} Uhr.<br><br>
        Wenn Sie den Termin nicht wahrnehmen können, stornieren Sie ihn bitte spätestens 24 Stunden vorher.<br><br>
        Wenn Sie Fragen haben, wenden Sie sich an Ihren Arzt unter<b>{4}<b>. Alternativ können Sie uns unter ${emailLink}.com oder den Aimedis-Support-Chat kontaktieren, wenn Sie Schwierigkeiten haben, Ihren Arzt zu kontaktieren.`,
    sw: ` ${
      common.dear_with_name.sw
    } Una miadi na {0} mnamo {5} saa {3}.<br><br>
        Ikiwa huwezi kufanya miadi, tafadhali ighairi angalau masaa 24 kabla.<br><br>
        Ikiwa una maswali yoyote, wasiliana na daktari wako kupitia <b>{4}<b>. Vinginevyo, unaweza kuwasiliana nasi kupitia ${emailLink}.com au mazungumzo ya msaada ya Aimedis ikiwa una shida kuwasiliana na daktari wako.`,
  },
  //0,6
  prescrtion_message_pat: {
    en: `${common.dear_with_name.en}<br><br><br>
       You have requested a prescription from {0}.<br><br>
        {0} will take care of the matter and contact you via email. We ask for patience for 24 to 48 <br> hours. If you have any questions, please contact us via ${emailLink} or the Aimedis support chat.`,
    ar: `${arabicContainerstart}${common.dear_with_name.ar}<br><br><br>
    لقد طلبت وصفة طبية من {0}.<br><br>
    {0} سيتولى الأمر وسيتواصل معك عبر البريد الإلكتروني. نطلب الصبر لمدة 24 إلى 48 ساعة. إذا كانت لديك أي أسئلة ، فيرجى الاتصال بنا عبر ${emailLink} أو دردشة دعم Aimedis.
    `,
    ch: ` ${common.dear_with_name.ch} 您已要求{0}开处方。<br><br>
        马克·沃尔特斯 {0} 将处理此事，并通过电子邮件与您联系。 我们要求您耐心等待24到48小 <br> 时。 如有任何疑问，请通过${emailLink}或Aimedis支持聊天与我们联系。`,
    nl: ` ${
      common.dear_with_name.nl
    } U heeft een recept aangevraagd bij {0}.<br><br>
        {0} zorgt voor de kwestie en neemt via e-mail contact met u op. We vragen 24 tot 48 uur <br> geduld. Als je vragen hebt, neem dan contact met ons op via ${emailLink} of de ondersteuningschat van Aimedis.`,
    rs: `${common.dear_with_name.rs} Вы запросили рецепт у {0}.<br><br>
        {0} возьмет все заботы на себя и свяжется с вами по электронной почте. Пожалуйста,<br> дождитесь ответа, который будет направлен в течение 24-48 часов. Если у вас есть какие-либо<br> вопросы, пожалуйста, свяжитесь с нами по электронной почте ${emailLink} или через<br> чат службы поддержки Aimedis.`,
    sp: `${
      common.dear_with_name.sp
    } Ha solicitado una prescripción de {0}.<br><br>
        {0} se encargará del asunto y se pondrá en contacto con usted por correo electrónico. Le<br> pedimos paciencia de 24 a 48 horas. Si tiene alguna pregunta, por favor comuníquese con nosotros<br> a través de ${emailLink} o mediante el chat de soporte de Aimedis.`,
    pt: `${common.dear_with_name.pt} solicitou uma prescrição de {0}.<br><br>
        {0} cuidará do assunto e entrará em contato consigo por e-mail. Pedimos ter paciência de<br> 24 a 48 horas. Se tiver alguma dúvida, por favor, entre em contato conosco via<br> ${emailLink} ou no chat de suporte Aimedis.`,
    fr: `${
      common.dear_with_name.fr
    } Vous avez demandé une ordonnance à {0}.<br><br>
        {0} s'occupera de l'affaire de vous contactera par e-mail. Nous demandons de la patience<br> pendant 24 à 48 heures. Si vous avez des questions, veuillez nous contacter via ${emailLink} <br>ou via le chat du support Aimedis.`,
    de: `${
      common.dear_with_name.en
    } Sie haben ein Rezept von {0} angefordert.<br><br>
        {0} kümmert sich um die Angelegenheit und wird Sie per E-Mail kontaktieren. Wir bitten um<br> Geduld für ca. 24 bis 48 Stunden. Bei Fragen wenden Sie sich bitte über ${emailLink} oder<br> den Aimedis-Support-Chat an uns.`,
    sw: `${common.dear_with_name.sw} Umeomba dawa kutoka kwa {0}.<br><br>
        {0} atashughulikia jambo hilo na kuwasiliana na wewe kupitia barua pepe.Tunaomba<br> uvumilivu kwa masaa 24 hadi 48. Ikiwa una maswali yoyote, tafadhali wasiliana nasi kupitia<br> ${emailLink} au mazungumzo ya msaada ya Aimedis.`,
  },
  sick_cert_message_pat: {
    en: `${
      common.dear_with_name.en
    }<br><br><br> You have requested a sick certificate from {0}.<br><br>
        {0} will take care of the matter and contact you via email. We ask for patience for 24 to 48<br> hours. If you have any questions, please contact us via ${emailLink} or the Aimedis support<br> chat.`,
    ar: `${arabicContainerstart}${common.dear_with_name.ar}<br><br><br>
    لقد طلبت شهادة مرضية من {0}.<br><br>
    {0} سيتولى الأمر وسيتواصل معك عبر البريد الإلكتروني. نطلب الصبر لمدة 24 إلى 48 ساعة. إذا كانت لديك أي أسئلة ، فيرجى الاتصال بنا عبر ${emailLink} أو عبر دردشة دعم Aimedis.`,
    ch: `${common.dear_with_name.ch} 您已请求{0}出示病假证明。<br><br>
        马克·沃尔特斯（{0}）将处理此事，并通过电子邮件与您联系。 我们要求您耐心等待24到48小<br>时。 如有任何疑问，请通过${emailLink}或Aimedis支持聊天与我们联系。`,
    nl: `${
      common.dear_with_name.nl
    } U heeft een verklaring van handicap aangevraagd bij {0}.<br><br>
        {0} zorgt voor de kwestie en neemt via e-mail contact met u op. We vragen 24 tot 48 uur<br> geduld. Als je vragen hebt, neem dan contact met ons op via ${emailLink} of de<br> ondersteuningschat van Aimedis.`,
    rs: `${common.dear_with_name.rs} Вы запросили больничный у {0}.<br><br>
        {0} возьмет все заботы на себя и свяжется с вами по электронной почте. Пожалуйста,<br> дождитесь ответа, который будет направлен в течение 24-48 часов. Если у вас есть какие-либо<br> вопросы, пожалуйста, свяжитесь с нами по электронной почте ${emailLink} или через<br> чат службы поддержки Aimedis.`,
    sp: `${
      common.dear_with_name.sp
    } Ha solicitado un certificado médico para {0}.<br><br>
        {0} se encargará del asunto y se pondrá en contacto con usted por correo electrónico. Le<br> pedimos paciencia de 24 a 48 horas. Si tiene alguna pregunta, comuníquese con nosotros a través de<br> ${emailLink} o mediante el chat de soporte de Aimedis.`,
    pt: `${
      common.dear_with_name.pt
    } Solicitou um atestado médico de {0}.<br><br>
        {0} cuidará do assunto e entrará em contato consigo por e-mail. Pedimos ter paciência de <br>24 a 48 horas. Se tiver alguma dúvida, por favor, entre em contato conosco via<br> ${emailLink} ou no chat de suporte Aimedis.`,
    fr: `${
      common.dear_with_name.fr
    } Vous avez demandé un certificat de maladie à {0}.<br><br>
        {0} s'occupera de l'affaire et vous contactera par e-mail. Nous demandons de la patience<br> pendant 24 à 48 heures. Si vous avez des questions, veuillez nous contacter via ${emailLink}<br> ou via le chat du support Aimedis.`,
    de: `${
      common.dear_with_name.de
    } Sie haben eine AU von {0} angefordert.<br><br>
        {0} kümmert sich um die Angelegenheit und wird Sie per E-Mail kontaktieren. Wir bitten um <br>Geduld für ca. 24 bis 48 Stunden. Bei Fragen wenden Sie sich bitte über ${emailLink} oder<br> den Aimedis-Support-Chat an uns.`,
    sw: `${
      common.dear_with_name.sw
    } Umeomba cheti cha ugonjwa kutoka kwa {0}.<br><br>
        {0} atashughulikia jambo hilo na kuwasiliana na wewe kupitia barua pepe.Tunaomba uvumilivu kwa <br>masaa 24 hadi 48. Ikiwa una maswali yoyote, tafadhali wasiliana nasi kupitia ${emailLink} au<br> mazungumzo ya msaada ya Aimedis.`,
  },
  second_opinion_message: {
    en: `${
      common.dear_with_name.en
    } You have requested a second opinion from {0}.<br><br>
        {0} will take care of the matter and contact you via email. We ask for patience for 24 to 48 hours. If you have any questions, please contact us via ${emailLink} or the Aimedis support chat.`,
    ar: `${arabicContainerstart}${common.dear_with_name.ar}<br><br><br>
    لقد طلبت رأيًا ثانيًا من {0}.<br><br>
    س{0} سيتولى الأمر وسيتواصل معك عبر البريد الإلكتروني. نطلب الصبر لمدة 24 إلى 48 ساعة. إذا كانت لديك أي أسئلة ، فيرجى الاتصال بنا عبر ${emailLink} أو دردشة دعم Aimedis.`,
    ch: `${common.dear_with_name.ch} 您已要求{0}提出第二意见。<br><br>
        马克·沃尔特斯（{0}）将处理此事，并通过电子邮件与您联系。 我们要求您耐心等待24到48小<br>时。 如有任何疑问，请通过${emailLink}或Aimedis支持聊天与我们联系。`,
    nl: `${
      common.dear_with_name.nl
    } U heeft een tweede mening aangevraagd bij {0}.<br><br>
        {0} zorgt voor de kwestie en neemt via e-mail contact met u op. We vragen 24 tot 48 uur<br> geduld. Als je vragen hebt, neem dan contact met ons op via ${emailLink} of de<br> ondersteuningschat van Aimedis.`,
    rs: `${common.dear_with_name.rs} Вы запросили второе мнение у {0}.<br><br>
        {0} возьмет все заботы на себя и свяжется с вами по электронной почте. Пожалуйста,<br> дождитесь ответа, который будет направлен в течение 24-48 часов. Если у вас есть какие-либо <br>вопросы, пожалуйста, свяжитесь с нами по электронной почте ${emailLink} или через <br>чат службы поддержки Aimedis.`,
    sp: `${
      common.dear_with_name.sp
    } Ha solicitado una segunda opinión a {0}.<br><br>
        {0} se encargará del asunto y se pondrá en contacto con usted vía correo electrónico. Le<br> pedimos paciencia de 24 a 48 horas. Si tiene alguna pregunta, comuníquese con nosotros a través de<br> ${emailLink} o mediante el chat de soporte de Aimedis.`,
    pt: `${
      common.dear_with_name.pt
    } Solicitou uma segunda opinião de {0}.<br><br>
        {0} cuidará do assunto e entrará em contato consigo por e-mail. Pedimos ter paciência de<br> 24 a 48 horas. Se tiver alguma dúvida, por favor entre em contato conosco via ${emailLink} ou<br> no chat de suporte Aimedis.`,
    fr: `${
      common.dear_with_name.fr
    } Vous avez demandé un deuxième avis à {0}.<br><br>
        {0} s'occupera de l'affaire et vous contactera par e-mail. Nous demandons de la patience<br> pendant 24 à 48 heures. Si vous avez des questions, veuillez nous contacter via ${emailLink}<br> ou via le chat du support Aimedis.`,
    de: `${
      common.dear_with_name.de
    } Sie haben eine Zweitmeinung von {0} angefordert.<br><br>
        {0} kümmert sich um die Angelegenheit und wird Sie per E-Mail kontaktieren. Wir bitten um <br>Geduld für ca. 24 bis 48 Stunden. Bei Fragen wenden Sie sich bitte über ${emailLink} oder<br> den Aimedis-Support-Chat an uns.`,
    sw: `${
      common.dear_with_name.sw
    } Umeomba maoni ya pili kutoka kwa {0}.<br><br>
        {0} atashughulikia jambo hilo na kuwasiliana na wewe kupitia barua pepe.Tunaomba uvumilivu kwa <br> masaa 24 hadi 48. Ikiwa una maswali yoyote, tafadhali wasiliana nasi kupitia ${emailLink} au <br>mazungumzo ya msaada ya Aimedis.`,
  },
};

let messageStuct = {
  name: 0,
  title: 1,
  profile_id: 2,
  time: 3,
  contact: 4,
  date: 5,
  dear_name: 6,
};
