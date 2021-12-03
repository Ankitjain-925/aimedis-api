const { arabicContainerstart } = require("../common");

const emailLink = `<b><a href="mailto:contact@aimedis.com"  style="color:black;">contact@aimedis.com</a></b>`;
const welcome_message_hospital_de = `Mit Aimedis sind Sie immer an der Seite Ihrer Patienten*innen und Gesundheitsprofis. Sie können auf ihre Daten und die Daten der Patienten*innen zugreifen und diese verwalten, per Videochat mit ihnen sprechen, Rezepte ausstellen, Krankenscheine ausstellen und Zweitmeinungen senden. Sie können auf Notfalldatensätze zugreifen, auf das eLearning & eTeaching-Modul von Aimedis zugreifen, Rezepte mit einem Klick an Apotheken senden und vieles mehr. Erfahren Sie mehr über Aimedis über unseren YouTube-Kanal.<br/><br/>
Das Aimedis Virtual Hospital ist das neue Krankenhausinformationssystem. Es verbindet alle Teilnehmer und bietet einzigartige Einblicke in die Prozesse innerhalb Ihrer Einrichtung.<br/><br/>
verifizieren Sie Ihr Konto - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Ein separates Benutzerhandbuch ist dieser E-Mail beigefügt. Sie können alle Funktionen von Aimedis im YouTube-Kanal einsehen.<br/><br/>
Ihr Konto wird innerhalb von 24 Stunden nach Vertragsunterzeichnung freigeschaltet.<br/><br/>
Wenn Sie Fragen haben, können Sie uns über den Aimedis-Support-Chat im System oder per E-Mail über ${emailLink}  erreichen.`;

const welcome_message_hospital_en = `With Aimedis you are always at your patients’, doctors’ and healthcare professionals’ side. They can access and manage their and the patients’ data, talk to them via videochat, issue prescriptions, sick certificates and send second opinions. They can access emergency records, access Aimedis’ eLearning & eTeaching module, can send prescriptions to pharmacies with one click and much more. Learn more about Aimedis via our YouTube channel.<br/><br/>
Verify your account - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
The Aimedis Virtual Hospital offers a completely new type of hospital information system and connects all participants while offering unique insides of the processes inside the institution.<br/><br/>
A separate user manual is attached to this mail and you can check out all of Aimedis functionalities inside the YouTube channel.<br/><br/>
Your account will be unlocked within 24 hours after the contract has been signed.<br/><br/>
If you have questions, you can reach us via the Aimedis Support Chat inside the system or email via <b><a href="mailto:contact@aimedis.com"  style="color:black;">contact@aimedis.com</a></b>.`;

const welcome_message_hospital_nl = `Met Aimedis staat u altijd aan de zijde van uw patiënten, artsen en zorgverleners. Ze hebben toegang tot de gegevens van henzelf en die van de patiënten, kunnen met hen praten via videochat, recepten uitgeven, ziektecertificaten afgeven en second opinion sturen. Ze hebben toegang tot noodrecords, toegang tot de eLearning & eTeaching-module van Aimedis, kunnen recepten met één klik naar apotheken sturen en nog veel meer. Lees meer over Aimedis via ons YouTube-kanaal.<br/><br/>
Verifieer uw account - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Het Aimedis Virtual Hospital biedt een volledig nieuw type ziekenhuisinformatiesysteem en verbindt alle deelnemers met een unieke binnenkant van de processen binnen de instelling.<br/><br/>
Bij deze mail is een aparte gebruikershandleiding gevoegd en je kunt alle functionaliteiten van Aimedis binnen het YouTube-kanaal bekijken.<br/><br/>
Uw account wordt binnen 24 uur na ondertekening van het contract ontgrendeld.<br/><br/>
Als u vragen heeft, kunt u ons bereiken via de Aimedis Support Chat in het systeem of per e-mail via ${emailLink}.`;

const welcome_message_hospital_rs = `Благодаря Aimedis, вы всегда можете быть на стороне ваших пациентов, врачей и медицинских работников. Используя нашу систему, они могут получить доступ к данным и управлять ими, общаться через видеочат, выписывать рецепты, справки о болезни и составлять второе мнение. Кроме того, они могут получить доступ к экстренной информации, воспользоваться модулем электронного обучения от Aimedis, а также отправить рецепты в аптеки одним щелчком мыши и делать многое другое. Узнайте больше о проекте Aimedis на нашем канале YouTube.<br/><br/>
подтвердите ваш аккаунт - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Виртуальная больница Aimedis предлагает совершенно новый тип больничной информационной системы, которая объединяет всех участников, предлагая уникальную систему автоматизации процессов внутри лечебного учреждения.<br/><br/>
К этому письму прилагается руководство пользователя. Кроме того, вы можете ознакомиться со всеми функциями Aimedis на канале YouTube.<br/><br/>
Ваша учетная запись будет разблокирована в течение 24 часов после подписания контракта.<br/><br/>
Если у вас есть вопросы, вы можете связаться с нами, используя чат службы поддержки Aimedis или по электронной почте ${emailLink}.`;

const welcome_message_hospital_ch = `在Aimedis，您始终站在患者、医生和医疗保健专业人员的身边。 他们可以访问和管理他们和患者的数据，通过视频聊天与他们交谈，开具处方，病证并发送第二意见。 他们可以访问紧急记录，访问aimedis的电子学习和网络教学模块，可以一键将处方发送到药房等等。 通过我们的YouTube频道了解有关Aimedis的更多信息。<br/><br/>
验证您的帐户 - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Aimedis虚拟医院提供了一种全新类型的医院信息系统，并连接所有参与者，同时提供机构内部流程的独特内部。<br/><br/>
此邮件附带一份单独的用户手册，您可以查看YouTube频道内的所有Aimedis功能。<br/><br/>
您的帐户将在合同签署后的24小时内解锁。	<br/><br/>
如果您有任何疑问，可以通过系统内的Aimedis支持聊天或通过电子邮件与我们联系 ${emailLink}。`;

const welcome_message_hospital_sw = `Ukiwa na Aimedis uko kila wakati upande wa wagonjwa wako, madaktari na wataalamu wa afya.Wanaweza kufikia na kusimamia data zao na za wagonjwa, kuzungumza nao kupitia videochat, kutoa maagizo, vyeti vya wagonjwa na kutuma maoni ya pili. Wanaweza kupata dharura. rekodi, ufikiaji wa moduli ya Aimedis 'eLearning & eTeaching, inaweza kutuma maagizo kwa maduka ya dawa kwa kubofya moja na mengi zaidi. Jifunze zaidi kuhusu Aimedis kupitia kituo chetu cha YouTube.<br/><br/>
Hakikisha akaunti yako - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Hospitali ya Aimedis Virtual hutoa aina mpya kabisa ya mfumo wa habari wa hospitali na inaunganisha washiriki wote wakati ikitoa insides za kipekee za michakato ndani ya taasisi hiyo.<br/><br/>
Mwongozo tofauti wa mtumiaji umeambatanishwa na barua hii na unaweza kuangalia utendaji wote wa Aimedis ndani ya kituo cha YouTube.<br/><br/>
Akaunti yako itafunguliwa ndani ya masaa 24 baada ya kutiwa saini kwa mkataba.<br/><br/>
Ikiwa una maswali, unaweza kutufikia kupitia Mazungumzo ya Msaada ya Aimedis ndani ya mfumo au barua pepe kupitia ${emailLink} .`;

const welcome_message_hospital_sp = `Con Aimedis siempre estará al lado de sus pacientes, médicos y profesionales sanitarios. Puede acceder y gestionar sus datos y los de los pacientes, hablar con ellos por videochat, emitir prescripciones, o certificados médicos y enviar segundas opiniones. Puedes acceder a los registros de emergencia, acceder al módulo eLearning & eTeaching Aimedis, enviar prescripciones a las farmacias con un solo clic y mucho más. Obtenga más información sobre Aimedis a través de nuestro canal de YouTube.<br/><br/>
Verifica tu cuenta - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
El Hospital Virtual Aimedis ofrece un tipo completamente nuevo de sistema de información hospitalaria y conecta a todos los integrantes mientras ofrece un entorno único con los procesos dentro de la institución.<br/><br/>
Se adjunta un manual de usuario separado a este correo,  además puede consultar todas las funcionalidades de Aimedis dentro del canal de YouTube.<br/><br/>
Su cuenta se desbloqueará dentro de las 24 horas posteriores a la firma del contrato.<br/><br/>
Si tiene preguntas, puedes comunicarse con nosotros a través del chat de soporte Aimedis dentro del sistema o por correo electrónico a través de ${emailLink}.`;

const welcome_message_hospital_pt = `Com a Aimedis, está sempre ao lado de seus pacientes, médicos e profissionais de saúde. Eles podem acessar e gerir seus dados e os dos pacientes, falar com eles via videochat, emitir prescrições, atestados médicos e segundas opiniões médicas. Podem acessar registros de emergência, o módulo eLearning e eTeaching Aimedis, enviar prescrições para farmácias com um clique e muito mais. Saiba mais sobre a Aimedis por meio de nosso canal no YouTube.<br/><br/>
Verifique sua conta - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
O Hospital Virtual Aimedis oferece um tipo completamente novo de sistema de informação hospitalar e conecta todos os participantes, ao mesmo tempo em que oferece detalhes únicos dos processos dentro da instituição.<br/><br/>
Um manual do usuário é anexado a este e-mail e pode verificar todas as funcionalidades da Aimedis dentro do canal do YouTube.<br/><br/>
Sua conta será desbloqueada dentro de 24 horas depois da assinatura do contrato.<br/><br/>
Se tiver dúvidas, pode nos contatar através do Chat de Suporte Aimedis dentro do sistema ou via e-mail em ${emailLink}.`;

const welcome_message_hospital_fr = `Avec Aimedis, vous êtes toujours aux côtés de vos patients, des médecins et des professionnels de la santé. Ils peuvent accéder à leurs données et à celles de leurs patients et les gérer, leur parler par vidéoconférence, délivrer des ordonnances, des certificats de maladie et envoyer des seconds avis. Ils peuvent accéder aux dossiers d'urgence, accéder au module eLearning & eTeaching d'Aimedis, envoyer des ordonnances aux pharmacies en un clic et bien plus encore. Apprenez-en davantage sur Aimedis via notre chaîne YouTube.<br/><br/>
Vérifiez votre compte - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
L'hôpital virtuel Aimedis offre un tout nouveau type de système d'information hospitalier et connecte tous les participants tout en offrant des aperçus uniques des processus au sein de l'institution.<br/><br/>
Un manuel d'utilisation distinct est joint à ce courrier et vous pouvez découvrir toutes les fonctionnalités d'Aimedis sur la chaîne YouTube.<br/><br/>
Votre compte sera débloqué dans les 24 heures suivant la signature du contrat.<br/><br/>
Si vous avez des questions, vous pouvez nous joindre par le biais du chat de support Aimedis dans le système ou par e-mail à l'adresse ${emailLink}`;

const welcome_message_hospital_ar = `${arabicContainerstart}مع Aimedis ، تستطيع دوما ان تكون بجانب مرضاك وأطبائك ومتخصصي الرعاية الصحية. حيث يمكنهم من خلاله  الوصول إلى بياناتهم وبيانات المرضى وإدارتها ، والتحدث معهم عبر دردشة الفيديو ، وإصدار الوصفات الطبية ، والشهادات المرضية ، وإرسال الآراء الثانية. كما يمكنهم الوصول إلى سجلات الطوارئ ، والوصول إلى وحدة التعليم الإلكتروني والتعليم الإلكتروني من Aimedis ، وإرسال الوصفات الطبية إلى الصيدليات بنقرة واحدة وأكثر من ذلك بكثير. للتعرف على المزيد حول Aimedis  شاهد  قناتنا على اليوتيوب  YouTube
<br><br>
تحقق من حسابك - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
يقدم مستشفى Aimedis الافتراضي نوعًا جديدًا تمامًا من نظام معلومات المستشفى  حيث يربط جميع المشاركين مع تقديم عروض فريدة للعمليات داخل المؤسسة.
تم إرفاق دليل مستخدم منفصل بهذا البريد ويمكنك التحقق من جميع وظائف Aimedis داخل قناة YouTube.
<br><br>
سيتم إلغاء قفل حسابك في غضون 24 ساعة ، بعد توقيع العقد .
<br><br>
إذا كانت لديك أسئلة ، يمكنك الوصول إلينا من خلال دردشة الدعم الخاصة بAimedis داخل النظام أو البريد الإلكتروني عبر ${emailLink}`;
const welcome_message_hospital_tr =`Aimedis ile hep hastanızın, doktorlarınızın ve sağlık personelinizin yanındasınız. Kendinizin ve hastanızın bilgilerine erişebilirsiniz ve organize edebilirsiniz, onlarla videochat yoluyla konuşabilirsiniz, reçeteler ve hasta raporları yazabilirsiniz ve ikinci fikirler gönderebilirsiniz. Acil evraklara erişebilirsiniz, Aimedis eLearning & eTeaching modülüne erişebilirsiniz, eczanelere bir tıklamayla reçeteler gönderebilirsiniz ve çok daha fazlası. YouTube kanalımızı ziyaret ederek Aimedis hakkında daha fazla bilgi edinebilirsiniz.<br><br>
Hesabınızı doğrulayın - <b><a href="{0}" style="color:black;"> Here</a></b><br/><br/>
Aimedis Sanal Hastanesi komple yeni bir hastane bilgi sistem tipi sunuyor ve bütün katılımcıları birbirileriyle bağlarken kuruluşun içindeki benzersiz iç dünyayıda size sunuyor.<br><br>
Bu emaye özel bir kullanma kılavuzu eklendi ve Aimedis’in bütün fonksiyonlarını YouTube kanalından öğrenebilirsiniz.<br><br>
Hesabınız sözleşme imzalandığından sonra 24 saat içinde açılacak.
Sorularınız varsa, bize sistemin içinde bulunan Aimedis Destek Chat yoluyla veya  ${emailLink} ‘a emay göndererek ulaşabilirsiniz.

`

module.exports = {
  welcome_message_hospital_de,
  welcome_message_hospital_en,
  welcome_message_hospital_nl,
  welcome_message_hospital_rs,
  welcome_message_hospital_ch,
  welcome_message_hospital_sw,
  welcome_message_hospital_sp,
  welcome_message_hospital_pt,
  welcome_message_hospital_fr,
  welcome_message_hospital_ar,
  welcome_message_hospital_tr
};
