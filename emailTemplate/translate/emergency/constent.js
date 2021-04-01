const { arabicContainerstart } = require("../common");

const emailLink = `<b><a href="mailto:contact@aimedis.com"  style="color:black;">contact@aimedis.com</a></b>`;
const licenseLink = `<b><a href="mailto:license@aimedis.com" style=color:black;">license@aimedis.com</a></b>`;

const welcome_message_emergency_de = `Mit Aimedis sind Sie immer an der Seite Ihrer Patienten*innen und in direkter Verbindung zu Ärzten und dem Aimedis-Support-Team.<br><br>
Greifen Sie auf den Notfalldatensatz der Patienten*innen zu, indem Sie einfach den QR-Code auf dem Personalausweis oder der Krankenversicherungskarte scannen.<br>
Ihr Konto wird innerhalb von 24 Stunden entsperrt, wenn Sie Ihre Lizenz mit Ihrer Registrierung hochgeladen haben. Wenn nicht, senden Sie es bitte an ${licenseLink}.<br><br>
Wenn Sie Fragen haben, können Sie uns über den Aimedis-Support-Chat im System oder per E-Mail über ${emailLink} erreichen.
`;

const welcome_message_emergency_en = `With Aimedis you are always at your patients’ side and in direct connection to doctors and the Aimedis support team.<br><br>
Access patients’ emergency records by simply scanning the QR-code on a patient’s ID or health insurance card.<br><br>
Your account will be unlocked within 24 hours, if you have uploaded your license with your registration. If not please send it to ${licenseLink}.<br>
If you have questions, you can reach us via the Aimedis Support Chat inside the system or email via ${emailLink}.
`;

const welcome_message_emergency_nl = `Met Aimedis staat u altijd aan de zijde van uw patiënten en staat u in directe verbinding met artsen en het ondersteuningsteam van Aimedis.<br><br>
Krijg toegang tot de noodgegevens van patiënten door simpelweg de QR-code op de ID van een patiënt of de ziekteverzekeringskaart te scannen.
Uw account wordt binnen 24 uur ontgrendeld als u uw licentie heeft geüpload bij uw registratie. Als dit niet het geval is, stuur het dan naar ${licenseLink}.<br><br>
Als u vragen heeft, kunt u ons bereiken via de Aimedis Support Chat in het systeem of per e-mail via ${emailLink}.
`;

const welcome_message_emergency_rs = `Благодаря Aimedis, вы всегда можете быть на стороне ваших пациентов, общаясь с врачами и службой поддержки Aimedis.<br><br>
Вы можете получить доступ к экстренным записям пациентов простым сканированием QR-кода на удостоверении личности пациента или карте медицинского страхования.<br><br>
Ваша учетная запись будет разблокирована в течение 24 часов, если вы уже загрузили свою лицензию во время регистрации. В противном случае, пожалуйста, отправьте ее на электронный адрес ${licenseLink}.<br><br>
Если у вас есть вопросы, вы можете связаться с нами, используя чат службы поддержки Aimedis или по электронной почте ${emailLink}.
`;

const welcome_message_emergency_ch = `在Aimedis，您始终站在患者身边，并与医生和Aimedis支持团队直接联系。<br><br>
只需扫描患者身份证或健康保险卡上的QR码即可访问患者的紧急记录。
如果您在注册时上传了许可证，您的帐户将在24小时内解锁。 如果没有，请将其发送到${licenseLink}。<br><br>
如果您有任何疑问，可以通过系统内的Aimedis支持聊天或通过电子邮件与我们联系 ${emailLink}。`;

const welcome_message_emergency_sw = `Ukiwa na Aimedis wewe huwa upande wa wagonjwa wako na kwa uhusiano wa moja kwa moja na madaktari na timu ya msaada ya Aimedis.<br><br>
Pata rekodi za dharura za wagonjwa kwa skana tu nambari ya QR kwenye kitambulisho cha mgonjwa au kadi ya bima ya afya.
Akaunti yako itafunguliwa ndani ya masaa 24, ikiwa umepakia leseni yako na usajili wako. Ikiwa sivyo tafadhali tuma kwa ${licenseLink}.<br><br>
Ikiwa una maswali, unaweza kutufikia kupitia Mazungumzo ya Msaada ya Aimedis ndani ya mfumo au barua pepe kupitia ${emailLink}.
`;

const welcome_message_emergency_sp = `Con Aimedis, siempre estará al lado de sus pacientes y en conexión directa con médicos y con el equipo de soporte Aimedis.<br><br>
Tenga acceso a los registros de emergencia de los pacientes simplemente escaneando el código QR en la identificación del paciente o en la tarjeta de seguro médico.
Su cuenta se desbloqueará en 24 horas si ha cargado su licencia con su registro. En caso contrario, envíela a ${licenseLink}.<br><br>
Si tiene preguntas, puede comunicarse con nosotros a través del chat de soporte Aimedis dentro del sistema o por correo electrónico a través de ${emailLink}.
`;

const welcome_message_emergency_pt = `Com a Aimedis, está sempre ao lado de seus pacientes e em contato direto com os médicos e a equipe de suporte da Aimedis.<br><br>
Acesse os registros de emergência dos pacientes simplesmente digitalizando o código QR na identificação de um paciente ou no cartão de seguro de saúde.
Sua conta será desbloqueada dentro de 24 horas, se tiver carregado sua licença com seu registro. Se não, por favor envie para ${licenseLink}.<br><br>
Se tiver dúvidas, pode nos contatar através do Chat de Suporte Aimedis dentro do sistema ou via e-mail em ${emailLink}.
`;

const welcome_message_emergency_fr = `Avec Aimedis, vous êtes toujours aux côtés de vos patients et en connexion directe avec les médecins et l'équipe d'assistance Aimedis.<br><br>
Accédez aux dossiers d'urgence des patients en scannant simplement le QR-code figurant sur la carte d'identité ou la carte d'assurance maladie du patient.
Votre compte sera débloqué sous 24 heures, si vous avez téléchargé votre licence lors de votre inscription. Si ce n'est pas le cas, veuillez l'envoyer à ${licenseLink}.<br><br>
Si vous avez des questions, vous pouvez nous joindre par le biais du chat de soutien Aimedis à l'intérieur du système ou par courriel à l'adresse ${emailLink}.
`;

const welcome_message_emergency_ar = `${arabicContainerstart}
يمكنك الوصول إلى سجلات الطوارئ الخاصة بالمرضى عن طريق المسح  الضوئي لرمز الاستجابة السريعة الموجود على هوية المريض أو بطاقة التأمين الصحي
<br><br>
. سيتم إلغاء قفل حسابك في غضون 24 ساعة ، فقط إذا قمت بتحميل الترخيص الخاص بك اثناء تسجيلك. إذا لم يكن كذلك ، يرجى إرساله إلى ${licenseLink} .<br><br>
إذا كانت لديك أسئلة ، يمكنك الوصول إلينا من خلال دردشة الدعم الخاصة بAimedis داخل النظام أو البريد الإلكتروني عبر ${emailLink}<br><br>`;
module.exports = {
  welcome_message_emergency_de,
  welcome_message_emergency_en,
  welcome_message_emergency_nl,
  welcome_message_emergency_rs,
  welcome_message_emergency_ch,
  welcome_message_emergency_sw,
  welcome_message_emergency_sp,
  welcome_message_emergency_pt,
  welcome_message_emergency_fr,
  welcome_message_emergency_ar,
};
