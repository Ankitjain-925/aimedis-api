const { arabicContainerstart } = require("../common");
const { licenseLink } = require("../patient/constent");

const emailLink = `<b><a href="mailto:contact@aimedis.com."  style="color:black;">contact@aimedis.com.</a></b>`;
const licenceEmail = `<b><a href="mailto:license@aimedis.com"  style="color:black;">license@aimedis.com</a></b>`;
const welcomeEmail_en = `With Aimedis you are always at your patients’ side. You can access and manage their data, talk to them via videochat, issue prescriptions, sick certificates and send second opinions. You can access emergency records, access Aimedis’ eLearning & eTeaching module, can send prescriptions to pharmacies with one click and much more. Learn more about Aimedis via our YouTube channel.<br><br>
Verify your account - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
    Your account will be unlocked within 24 hours, if you have uploaded your license with your registration. If not please send it to ${licenceEmail}.<br><br>
    If you have questions, you can reach us via the Aimedis Support Chat inside the system or email via ${emailLink}.
    `;
const welcomeEmail_rs = `Благодаря Aimedis, вы всегда можете быть на стороне ваших пациентов. Используя нашу систему, вы можете получить доступ к их данным и управлять ими, общаться с ними через видеочат, выписывать рецепты, справки о болезни и составлять второе мнение. Кроме того, вы можете получить доступ к экстренной информации, воспользоваться модулем электронного обучения от Aimedis, а также отправить рецепты в аптеки одним щелчком мыши и делать многое другое. Узнайте больше о проекте Aimedis на нашем канале YouTube.<br><br>
подтвердите ваш аккаунт- <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Ваша учетная запись будет разблокирована в течение 24 часов, если вы уже загрузили свою лицензию во время регистрации. В противном случае, пожалуйста, отправьте ее на электронный адрес ${licenceEmail}.<br><br>
Если у вас есть вопросы, вы можете связаться с нами, используя чат службы поддержки Aimedis или по электронной почте ${emailLink}.
`;
const welcomeEmail_ch = `使用Aimedis，您始终站在患者的身边。 您可以访问和管理他们的数据，通过视频聊天与他们交谈，开具处方，生病证书并发送第二意见。 您可以访问紧急记录，访问aimedis的电子学习和网络教学模块，可以一键将处方发送到药房等等。 通过我们的YouTube频道了解有关Aimedis的更多信息。<br>
验证您的帐户 - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
如果您在注册时上传了许可证，您的帐户将在24小时内解锁。 如果没有，请将其发送到${licenceEmail}。<br><br>
如果您有任何疑问，可以通过系统内的Aimedis支持聊天或通过电子邮件与我们联系${emailLink}。
`;
const welcomeEmail_fr = `Avec Aimedis, vous êtes toujours aux côtés de vos patients. Vous pouvez accéder à leurs données et les gérer, leur parler par vidéo-chat, établir des ordonnances, des certificats de maladie et envoyer des seconds avis. Vous pouvez accéder aux dossiers d'urgence, accéder au module eLearning & eTeaching d'Aimedis, envoyer des ordonnances aux pharmacies en un clic et bien plus encore. Apprenez-en plus sur Aimedis via notre chaîne YouTube.
Vérifiez votre compte - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Votre compte sera débloqué dans un délai de 24 heures, si vous avez téléchargé votre licence lors de votre inscription. Si ce n'est pas le cas, veuillez l'envoyer à ${licenceEmail}.<br><br>
Si vous avez des questions, vous pouvez nous joindre via le chat de support Aimedis à l'intérieur du système ou par email via ${emailLink}.
`;
const welcomeEmail_nl = `Met Aimedis staat u altijd aan de zijde van uw patiënten. U kunt hun gegevens raadplegen en beheren, met hen praten via videochat, recepten uitgeven, ziektecertificaten afgeven en second opinion sturen. U hebt toegang tot noodgegevens, toegang tot de eLearning & eTeaching-module van Aimedis, kunt met één klik recepten naar apotheken sturen en nog veel meer. Lees meer over Aimedis via ons YouTube-kanaal.<br><br>
Verifieer uw account - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Uw account wordt binnen 24 uur ontgrendeld als u uw licentie heeft geüpload bij uw registratie. Als dit niet het geval is, stuur het dan naar ${licenceEmail}.<br><br>
Als u vragen heeft, kunt u ons bereiken via de Aimedis Support Chat in het systeem of per e-mail via ${emailLink}.
`;

const welcomeEmail_sp = `Con Aimedis siempre estará al lado de sus pacientes. Puede acceder y administrar sus datos, hablar con ellos a través de videochat, emitir prescripciones, certificados médicos y enviar segundas opiniones. Puede acceder a los registros de emergencia o al módulo eLearning & eTeaching Aimedis, enviar prescripciones a las farmacias con un solo clic y mucho más. Obtenga más información sobre Aimedis a través de nuestro canal de YouTube.<br><br>
Verifica tu cuenta - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Su cuenta se desbloqueará dentro de 24 horas, si ha cargado su licencia con su registro. En caso contrario, por favor envíela a ${licenceEmail}.<br><br>
Si tiene preguntas, puede comunicarse con nosotros a través del chat de soporte Aimedis dentro del sistema o por correo electrónico a través de ${emailLink}.
`;
const welcomeEmail_de = `Mit Aimedis sind Sie immer an der Seite Ihrer Patienten. Sie können auf ihre Daten zugreifen und sie verwalten, per Videochat mit ihnen sprechen, Rezepte ausstellen, Krankenscheine ausstellen und Zweitmeinungen senden. Sie können auf den Notfalldatensatz zugreifen, auf das eLearning & eTeaching-Modul von Aimedis zugreifen, Rezepte mit einem Klick an Apotheken senden und vieles mehr. Erfahren Sie mehr über Aimedis über unseren YouTube-Kanal.<br><br>
verifizieren Sie Ihr Konto - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Ihr Konto wird innerhalb von 24 Stunden entsperrt, wenn Sie Ihre Lizenz mit Ihrer Registrierung hochgeladen haben. Wenn nicht, senden Sie Ihre Unterlagen bitte an ${licenceEmail}.<br><br>
Wenn Sie Fragen haben, können Sie uns über den Aimedis-Support-Chat im System oder per E-Mail über ${emailLink} erreichen.`;

const welcomeEmail_pt = `Com a Aimedis, está sempre ao lado de seus pacientes. Pode acessar e gerir seus dados, falar com eles via videochat, emitir receitas, atestados médicos e segundas opiniões. Pode acessar registros de emergência, acessar o módulo eLearning & eTeaching da Aimedis, enviar receitas para farmácias com um clique e muito mais. Saiba mais sobre a Aimedis por meio de nosso canal no YouTube.
Verify your account - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Sua conta será desbloqueada dentro de 24 horas, se tiver carregado sua licença com seu registro. Se não, por favor envie-a para ${licenceEmail}.<br><br>
Se tiver dúvidas, pode nos contatar através do Chat de Suporte Aimedis dentro do sistema ou via e-mail em ${emailLink}.
`;

const welcomeEmail_sw = `Ukiwa na Aimedis kila wakati uko upande wa wagonjwa wako.Unaweza kupata na kudhibiti data zao, zungumza nao kupitia videochat, toa maagizo, vyeti vya wagonjwa na utume maoni ya pili.Unaweza kupata rekodi za dharura, fikia moduli ya Aimedis 'eLearning & eTeaching, unaweza tuma maagizo kwa maduka ya dawa kwa mbofyo mmoja na mengi zaidi. Jifunze zaidi kuhusu Aimedis kupitia kituo chetu cha YouTube.<br><br>
Hakikisha akaunti yako - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Akaunti yako itafunguliwa ndani ya masaa 24, ikiwa umepakia leseni yako na usajili wako. Ikiwa sivyo tafadhali tuma kwa ${licenceEmail}.<br><br>
Ikiwa una maswali, unaweza kutufikia kupitia Mazungumzo ya Msaada ya Aimedis ndani ya mfumo au barua pepe kupitia ${emailLink}.

`;
const welcomeEmail_ar = `${arabicContainerstart}
مع Aimedis تستطيع دوما ان تكون  علي تواصل مع مرضاك .  حيث يمكنك الوصول إلى بياناتهم وإدارتها والتحدث معهم عبر دردشة الفيديو وإصدار الوصفات الطبية والشهادات المرضية وإرسال آراء ثانية ، كما يمكنك الوصول إلى سجلات الطوارئ ، والوصول إلى وحدة التعليم الإلكتروني والتعليم الإلكتروني من Aimedis ، وإرسال الوصفات الطبية إلى الصيدليات  فقط بنقرة واحدة وغير ذلك الكثير.  للتعرف على المزيد حول Aimedis من خلال  قناتنا على  يوتيوب YouTube
<br><br>
تحقق من حسابك  - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
فقط إذا قمت بتحميل الترخيص الخاص بك اثناء تسجيلك ، فسيتم إلغاء قفل حسابك في غضون 24 ساعة  وان لم تفعل  فرجاء تواصل معنا عبر ارسال رساله الي ${licenceEmail}.<br><br>
و إذا كانت اية لديك أسئلة ، يمكنك التواصل معنا عبر دردشة الدعم  لAimedis داخل النظام أو عبر البريد الإلكتروني عبر ${emailLink}
<br><br>
`;
const welcomeEmail_tr=`Aimedis ile hep hastanızın yanındasınız. Hastanızın bilgilerine erişebilirsiniz ve organize edebilirsiniz, onlarla videochat yoluyla konuşabilirsiniz, reçeteler ve hasta raporları yazabilirsiniz ve ikinci fikirler gönderebilirsiniz. Acil evraklara erişebilirsiniz, Aimedis eLearning & eTeaching modülüne erişebilirsiniz, eczanelere bir tıklamayla reçeteler gönderebilirsiniz ve çok daha fazlası. YouTube kanalımızı ziyaret ederek  Aimedis hakkında daha fazla bilgi edinebilirsiniz.<br><br>
Hesabınızı doğrulayın - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Kayıdınızla birlikte lisansınızı yüklediyseniz hesabınız 24 saat içinde açılacaktır. Eğer yüklemediyseniz o zaman lisansınızı lütfen   ${licenceEmail}.com ‘a gönderin.<br><br>
Sorularınız varsa, bize sistemin içinde bulunan Aimedis Destek Chat yoluyla veya ${emailLink}
<br><br>‘a emay göndererek ulaşabilirsiniz.
`
const appointment_en = `Dear {0}.<br><br>
You have got an {1} appointment with {2},{3} on {4} at {5}.<br><br>
Please accept the appointment inside your Aimedis profile. If you have any questions, please contact the patient via {6} or {7}. Alternatively, you can contact us via  ${emailLink} or the Aimedis support chat if you have difficulties contacting the patient.`;
const appointment_rs = `Уважаемый(-ая){0}.<br><br> У вас есть запись на прием {1} от пациента {2}, {3} на {4} в {5}.<br><br>
Пожалуйста, примите запись на прием в вашем профиле Aimedis. Если у вас есть вопросы, пожалуйста, свяжитесь с пациентом по {6} или {7}. Кроме того, вы можете связаться с нами по адресу  ${emailLink} или в чате службы поддержки Aimedis, если у вас возникли трудности во время связи с пациентом.
`;
const appointment_nl = `Beste {0}.<br><br>
U heeft een afspraak met {1} met {2}, {3} op {4} om {5}.
Accepteer de afspraak in uw Aimedis-profiel. Als u vragen heeft, neem dan contact op met de patiënt via {6} VAN DE PATIËNT of {7} VAN DE PATIËNT. Als alternatief kunt u contact met ons opnemen via ${emailLink} of de Aimedis-ondersteuningschat als u problemen ondervindt bij het contacteren van de patiënt.
`;

const appointment_sp = `Estimado {0}.<br><br>.
Tiene una cita {1} DE CITAS con {2}, {3} el {4} a las {5}.<br><br>
Por favor, acepte la cita dentro de su perfil Aimedis. Si tiene alguna pregunta, comuníquese con el paciente a través de CORREO {6} o {7}. Alternativamente, puede contactarnos a través de ${emailLink} o mediante el chat de soporte de Aimedis si tiene dificultades para comunicarse con el paciente.
`;
const appointment_sw = `Mpendwa {0}.<br<br>
Umepata jina la {1} na ID ya {2}, {3}, {4}, {5}.<br><br>
Tafadhali kubali uteuzi ndani ya wasifu wako wa Aimedis. Ikiwa una maswali yoyote, tafadhali wasiliana na mgonjwa kupitia ANWANI YA {6} au {7}. Vinginevyo, unaweza kuwasiliana nasi kupitia ${emailLink} au mazungumzo ya msaada wa Aimedis ikiwa una shida kuwasiliana mgonjwa.
`;
const appointment_de = `Sehr geehrter {0}.<br><br>

Sie haben eine Terminanfrage für {2}, {3} am {4} at {5}.<br><br>
Bitte bestätigen Sie den Termin in Ihrem Aimedis-Profil. Bei Fragen wenden Sie sich bitte über die {6} oder die {7} an den Patienten. Alternativ können Sie uns über ${emailLink} oder den Aimedis-Support-Chat kontaktieren, wenn Sie Schwierigkeiten haben, den Patienten zu kontaktieren.
`;
const appointment_fr = `Cher {0}.<br<br>
Vous avez un {1} rendez-vous avec {2}, {3} le {4} à {5}.<br<br>
Veuillez accepter le rendez-vous dans votre profil Aimedis. Si vous avez des questions, veuillez contacter le patient via {6} ou {7}. Vous pouvez également nous contacter via ${emailLink} ou le chat de support Aimedis si vous avez des difficultés à contacter le patient.`;

const appointment_ar = `<div class"arabic">عزيز {0}.<br><br><br>
لديك موعد {1} مع {2} ، {3} في {4} الساعة {5}.<br><br>
نرجو قبول الموعد الموجود  داخل ملف تعريف Aimedis الخاص بك ، و إذاإذا كانت لديك أي أسئلة ، فيرجى الاتصال بالمريض عبر {6} أو {7} المريض .  او بدلاً من ذلك ، يمكنك الاتصال بنا عبر
 ${emailLink}  
أو  في حالة انك تواجه صعوبات في الاتصال بالمريض  تواصل معنا عبر دردشة دعم Aimedis.
`;
const appointment_tr=`Sayın {0}. <br> <br>
{4}, {5} tarihinde {2} ile {3} arasında bir {1} randevunuz var. <br> <br>
Lütfen Aimedis profilinizdeki randevuyu kabul edin. Herhangi bir sorunuz varsa, lütfen hastayla {6} veya {7} aracılığıyla iletişime geçin. Alternatif olarak, hastayla iletişim kurmakta güçlük çekiyorsanız, $ {emailLink} veya Aimedis destek sohbeti aracılığıyla bizimle iletişime geçebilirsiniz.`

const appointment_pt = `Caro {0}.<br><br><br>
Você tem um {1} compromisso com {2}, {3} em {4} às {5}.<br><br>
Por favor, aceite o compromisso dentro do seu perfil Aimedis. Se você tiver alguma dúvida, entre em contato com o paciente por meio de {6} ou {7}. Alternativamente, pode nos contatar via ${emailLink} ou no chat de suporte Aimedis se tiver dificuldades para entrar em contato com o paciente.
`;
const appointment_ch = `亲{0}。<br><br><br>
您已在{5}的{4}上与{2}，{3}进行了{1}约会。<br><br>
请在您的Aimedis个人资料内接受预约。 如有任何疑问，请通过{6}或{7}与患者联系。 或者，您可以通过以下方式与我们联系${emailLink} 或Aimedis支持聊天，如果你有困难联系病人。
`;

///
const precription_en = `Dear {0}.<br><br>
 You received a new <br>prescription request</br> from {1}, {2}, on {3} at {4}.<br><br> 
Please check the request inside your Aimedis profile. If you have any questions, please contact the patient via {5} or {6}. Alternatively, you can contact us via ${emailLink} or the Aimedis support chat if you have difficulties contacting the patient.
`;
const precription_rs = `Уважаемый(-ая){0}.<br><br>Вы получили новый запрос на выписку рецепта от {1}, {2} на {3} в {4}.<br><br> Пожалуйста, примите запрос в вашем профиле Aimedis. Если у вас есть вопросы, пожалуйста, свяжитесь с пациентом по {5} или {6}. Кроме того, вы можете связаться с нами по адресу ${emailLink} или в чате службы поддержки Aimedis, если у вас возникли трудности во время связи с пациентом.
`;
const precription_nl = `Beste {0}.<br><br>
U heeft op {3} om {4} een nieuw recept ontvangen van {1}, {2}.<br><br>
Controleer het verzoek in uw Aimedis-profiel. Als u vragen heeft, neem dan contact op met de patiënt via {5} VAN DE PATIËNT of {6} VAN DE PATIËNT. Als alternatief kunt u contact met ons opnemen via ${emailLink} of de Aimedis-ondersteuningschat als u problemen ondervindt bij het contacteren van de patiënt.
`;
const precription_de = `Sehr geehrter {0}.<br><br>

Sie haben eine Rezeptanfrage für {1}, {2} am {3} at {4}.<br><br>
Bitte bestätigen Sie den Termin in Ihrem Aimedis-Profil. Bei Fragen wenden Sie sich bitte über die {5} oder die {6} an den Patienten. Alternativ können Sie uns über ${emailLink} oder den Aimedis-Support-Chat kontaktieren, wenn Sie Schwierigkeiten haben, den Patienten zu kontaktieren.
`;

const precription_sw = `Mpendwa {0}.<br<br>.
Ulipokea ombi jipya la dawa kutoka kwa kitambulisho cha {1},{2}, {3}, {4}.<br><br>
Tafadhali angalia ombi ndani ya wasifu wako wa Aimedis. Ikiwa una maswali yoyote, tafadhali wasiliana na mgonjwa kupitia ANWANI YA {5} au {6}. Vinginevyo, unaweza kuwasiliana nasi kupitia ${emailLink}  au mazungumzo ya msaada wa Aimedis ikiwa una shida kuwasiliana mgonjwa.
`;
const precription_sp = `Estimado {0}.<br><br>.
Ha recibido una nueva solicitud de prescripción de {1}, {2}, el {3} a las {4}.<br><br>
 Por favor, consulte la solicitud dentro de su perfil de Aimedis. Si tiene alguna pregunta, comuníquese con el paciente a través de CORREO {5} o{6}. Alternativamente, puede contactarnos a través de ${emailLink} o el chat de soporte Aimedis si tiene dificultades para comunicarse con el paciente.
`;
const precription_fr = `Cher {0}.<br><br><br>
Vous avez reçu une nouvelle demande de prescription <br> </br> de {1}, {2}, le {3} à {4}.<br><br>
Veuillez vérifier la demande dans votre profil Aimedis.<br><br> Si vous avez des questions, veuillez contacter le patient via {5} ou {6}. Vous pouvez également nous contacter via ${emailLink} ou le chat d'assistance Aimedis si vous avez des difficultés à contacter le patient.
`;
const precription_ch = `亲{0}。<br><br><br>
您在{3}处{4}的{1}，{2}和{1}收到了新的处方请求。<br><br> 
请检查您的Aimedis个人资料中的请求。 如有任何疑问，请通过{5}或{6}与患者联系。 或者，您可以通过以下方式与我们联系${emailLink} 或Aimedis支持聊天，如果你有困难联系病人。
`;
const precription_ar = `<div class='arabic'>عزيز {0}.<br><br><br> 

لقد تلقيت <br> طلب وصفة طبية جديدًا </br> من {1} ، {2} ، بتاريخ {3} في {4}<br><br>
يرجى التحقق من الطلب الموجود داخل ملف تعريف Aimedis الخاص بك.إذا كانت لديك أي أسئلة ، فيرجى الاتصال بالمريض عبر {5} أو {6}. بدلاً من ذلك ، يمكنك الاتصال بنا عبر   ${emailLink} أو دردشة دعم Aimedis في حالة انك كنت تواجه صعوبات في الاتصال بالمريض.
`;
const precription_pt = `Caro {0}.<br><br><br>
Você recebeu uma nova <br> solicitação de receita </br> de {1}, {2}, em {3} às {4}. <br><br>
Por favor, consulte a solicitação dentro do seu perfil Aimedis. Se você tiver alguma dúvida, entre em contato com o paciente por meio de {5} ou {6}. Alternativamente, pode nos contatar via ${emailLink} ou no chat de suporte Aimedis se tiver dificuldades para entrar em contato com o paciente.
`;
const precription_tr=`Sayın {0}. <br> <br>
{4} {3} tarihinde {1}, {2} adresinden yeni bir reçete talebi </br> aldınız. <br> <br>
Lütfen Aimedis profilinizdeki isteği kontrol edin. Herhangi bir sorunuz varsa, lütfen hastayla {5} veya {6} aracılığıyla iletişime geçin. Alternatif olarak, hastayla iletişim kurmakta güçlük çekiyorsanız, $ {emailLink} veya Aimedis destek sohbeti aracılığıyla bizimle iletişime geçebilirsiniz.`
///
module.exports = {
  welcomeEmail_en,
  welcomeEmail_rs,
  emailLink,
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
};
