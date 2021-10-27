const { arabicContainerstart } = require("../common");

const emailLink = `<b><a href="mailto:contact@aimedis.com"  style="color:black;">contact@aimedis.com</a></b>`;
const licenseLink = `<b><a href="mailto:license@aimedis.com" style=color:black;">license@aimedis.com</a></b>`;

const welcome_message_pharmacy_de = `Mit Aimedis sind Sie immer an der Seite Ihrer Patienten*innen und in direkter Verbindung zu Ihren kooperierenden Ärzten*innen. Erhalten und bearbeiten Sie Rezepte online in Echtzeit und kommunizieren Sie mit den Ärzten*innen und Patienten*innen.<br><br>
verifizieren Sie Ihr Konto - <a href="{0}"> Here</a><br/><br/>
Bei Fragen oder in einer Notsituation können Sie auf die Notfallinformationen Ihrer Patienten zugreifen, um die Bedürfnisse der Patienten besser zu verstehen.<br><br>
Ihr Konto wird innerhalb von 24 Stunden entsperrt, wenn Sie Ihre Lizenz mit Ihrer Registrierung hochgeladen haben. Wenn nicht, senden Sie es bitte an ${licenseLink}.<br><br>
Wenn Sie Fragen haben, können Sie uns über den Aimedis-Support-Chat im System oder per E-Mail über ${emailLink} erreichen.`;

const welcome_message_pharmacy_en = `With Aimedis you are always at your patients’ side and in direct connection to your associated doctors. Receive and handle prescriptions online in real time and communicate with the doctors and patients.<br><br>
Verify your account - <a href="{0}"> Here</a><br/><br/>
In case of questions or an emergency situation you can access your patients emergency information to better understand the patients’ needs.<br><br>
Your account will be unlocked within 24 hours, if you have uploaded your license with your registration. If not please send it to ${licenseLink}.<br><br>
If you have questions, you can reach us via the Aimedis Support Chat inside the system or email via ${emailLink}.`;

const welcome_message_pharmacy_nl = `Met Aimedis staat u altijd aan de zijde van uw patiënten en staat u in directe verbinding met uw aangesloten artsen. Ontvang en behandel recepten online in realtime en communiceer met de artsen en patiënten.<br><br>
Verifieer uw account - <a href="{0}"> Here</a><br/><br/>
In geval van vragen of een noodsituatie heeft u toegang tot de noodinformatie van uw patiënten om de behoeften van de patiënten beter te begrijpen.<br><br>
Uw account wordt binnen 24 uur ontgrendeld als u uw licentie heeft geüpload bij uw registratie. Als dit niet het geval is, stuur het dan naar ${licenseLink}.<br><br>
Als u vragen heeft, kunt u ons bereiken via de Aimedis Support Chat in het systeem of per e-mail via ${emailLink}.`;

const welcome_message_pharmacy_rs = `Благодаря Aimedis, вы всегда находитесь рядом со своими пациентами и получаете возможность быстрого общения с вашими врачами. Получайте и обрабатывайте рецепты онлайн в режиме реального времени, а также общайтесь с врачами и пациентами.<br><br>
подтвердите ваш аккаунт - <a href="{0}"> Here</a><br/><br/>
В случае возникновения вопросов или экстренной ситуации вы можете получить доступ к экстренной информации ваших пациентов, чтобы понять, что именно могло случиться.<br><br>
Ваша учетная запись будет разблокирована в течение 24 часов, если вы уже загрузили свою лицензию во время регистрации. В противном случае, пожалуйста, отправьте ее на электронный адрес ${licenseLink}.<br><br>
Если у вас есть вопросы, вы можете связаться с нами, используя чат службы поддержки Aimedis или по электронной почте ${emailLink}.
`;

const welcome_message_pharmacy_ch = `使用Aimedis，您始终站在患者身边，并与相关医生建立间接联系。 实时在线接收和处理处方，并与医生和患者沟通。<br><br>
验证您的帐户 - <a href="{0}"> Here</a><br/><br/>
如果出现问题或紧急情况，您可以访问患者的紧急信息，以更好地了解患者的需求。<br><br>
如果您在注册时上传了许可证，您的帐户将在24小时内解锁。 如果没有，请将其发送到${licenseLink}。<br><br>
如果您有任何疑问，可以通过系统内的Aimedis支持聊天或通过电子邮件与我们联系${emailLink}。<br><br>
`;

const welcome_message_pharmacy_sw = `Ukiwa na Aimedis kila wakati uko upande wa wagonjwa wako na unahusiana moja kwa moja na madaktari wako wanaohusika. Pokea na ushughulikie maagizo mtandaoni kwa wakati halisi na uwasiliane na madaktari na wagonjwa.<br><br>
Hakikisha akaunti yako - <a href="{0}"> Here</a><br/><br/>
Ikiwa kuna maswali au hali ya dharura unaweza kupata habari za dharura za wagonjwa wako ili uelewe vizuri mahitaji ya wagonjwa.<br><br>
Akaunti yako itafunguliwa ndani ya masaa 24, ikiwa umepakia leseni yako na usajili wako. Ikiwa sivyo tafadhali tuma kwa ${licenseLink}.<br><br>
Ikiwa una maswali, unaweza kutufikia kupitia Mazungumzo ya Msaada ya Aimedis ndani ya mfumo au barua pepe kupitia ${emailLink}.`;

const welcome_message_pharmacy_sp = `Con Aimedis siempre estará al lado de sus pacientes y en conexión directa con sus médicos asociados. Reciba y maneje prescripciones en línea en tiempo real y comuníquese con los médicos y pacientes.<br><br>
Verifica tu cuenta - <a href="{0}"> Here</a><br/><br/>
En caso de preguntas o en una situación de emergencia, puede acceder a la información de emergencia de sus pacientes para comprender mejor sus necesidades.<br><br>
Su cuenta se desbloqueará dentro de 24 horas si ha cargado su licencia con su registro. En caso contrario, envíela a ${licenseLink}.<br><br>
Si tiene preguntas, puede comunicarse con nosotros a través del chat de soporte Aimedis dentro del sistema o por correo electrónico a través de ${emailLink}.`;

const welcome_message_pharmacy_pt = `Com a Aimedis, está sempre ao lado dos seus pacientes e em contato direto com os médicos associados. Receba e trate prescrições online em tempo real e comunique-se com médicos e pacientes.<br><br>
Verifique sua conta - <a href="{0}"> Here</a><br/><br/>
Em caso de dúvidas ou situação de emergência, pode acessar as informações de emergência dos seus pacientes para entender melhor as necessidades deles.<br><br>
Sua conta será desbloqueada em 24 horas, se tiver carregado sua licença com seu registro. Se não, por favor envie para ${licenseLink}.<br><br>
Se tiver dúvidas, pode nos contatar através do Chat de Suporte Aimedis dentro do sistema ou via e-mail em ${emailLink}.`;

const welcome_message_pharmacy_fr = `Avec Aimedis, vous êtes toujours aux côtés de vos patients et en lien direct avec vos médecins associés. Recevez et gérez les ordonnances en ligne en temps réel et communiquez avec les médecins et les patients.<br><br>
Vérifiez votre compte - <a href="{0}"> Here</a><br/><br/>
En cas de questions ou de situation d’urgence, vous pouvez accéder aux informations d’urgence de vos patients pour mieux comprendre les besoins des patients.<br><br>
Votre compte sera déverrouillé dans les 24 heures, si vous avez téléchargé votre licence avec votre inscription. Sinon, veuillez l'envoyer à ${licenseLink}.<br><br>
Si vous avez des questions, vous pouvez nous joindre via le chat d'assistance Aimedis dans le système ou par e-mail via ${emailLink}.`;

const welcome_message_pharmacy_ar = `${arabicContainerstart}الصحية
مع Aimedis ، تستطيع دوما أن تكون بجانب مرضاك وعلى اتصال مباشر بالأطباء المرتبطين بك. تلقي الوصفات الطبية والتعامل معها عبر الإنترنت في الوقت الفعلي والتواصل مع الأطباء والمرضى<br><br>
تحقق من حسابك - <a href="{0}"> Here</a><br/><br/>
في حالة وجود أي أسئلة أو وجود حالة طارئة ، يمكنك الوصول إلى معلومات الطوارئ الخاصة بمرضاك لفهم احتياجاتهم بشكل أفضل.<br><br>
سيتم إلغاء قفل حسابك في غضون 24 ساعة ، فقط إذا قمت بتحميل الترخيص الخاص بك اثناء تسجيلك. إذا لم يكن كذلك ، يرجى إرساله إلى ${licenseLink} .<br><br>

إذا كانت لديك أسئلة ، يمكنك الوصول إلينا من خلال دردشة الدعم الخاصة بAimedis داخل النظام أو البريد الإلكتروني عبر ${emailLink}`;
const welcome_message_pharmacy_tr = `Aimedis ile hep hastanızın yanındasınız ve bağlı olduğunuz doktorlarla direk bağlantıdasınız. Reçeteleri gerçek zaman içinde teslim alabiliyorsunuz ve işleyebiliyorsunuz ve doktorlarla ve hastalarla haberleşebiliyorsunuz.<br><br>
Hesabınızı doğrulayın - <a href="{0}"> Here</a><br/><br/>
Sorularınız olduğunda veya acil bir durumda hastalarınızın ihtiyaçlarını daha iyi anlıyabilmek için acil bilgilerine giriş yapabilirsiniz.<br><br>
Kayıdınızla birlikte lisansınızı yüklediyseniz hesabınız 24 saat içinde açılacaktır. Eğer yüklemediyseniz o zaman lisansınızı lütfen  license@aimedis.com ‘a gönderin.<br><br>
Sorularınız varsa, bize sistemin içinde bulunan Aimedis Destek Chat yoluyla veya ${licenseLink} . emay göndererek ulaşabilirsiniz.  

`

module.exports = {
  welcome_message_pharmacy_de,
  welcome_message_pharmacy_en,
  welcome_message_pharmacy_nl,
  welcome_message_pharmacy_rs,
  welcome_message_pharmacy_ch,
  welcome_message_pharmacy_sw,
  welcome_message_pharmacy_sp,
  welcome_message_pharmacy_pt,
  welcome_message_pharmacy_fr,
  welcome_message_pharmacy_ar,
  welcome_message_pharmacy_tr
};
