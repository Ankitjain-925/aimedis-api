const {
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
} = require("./constent");

const { common, arabicContainerstart } = require("../common");
const { emailLink } = require("../doctor/constent");
const prescription_mssg_en = `${
  common.dear_with_name.en
} You received a new prescription for {0}, {1}, on {5} at {4} from {3}, {2}.<br><br>
Please check the request inside your Aimedis profile. If you have any questions, please contact the doctor via {7} or {8}. Alternatively, you can contact us via ${emailLink} or the Aimedis support chat if you have difficulties contacting the doctor.`;

const prescription_mssg_ch = `${
  common.dear_with_name.ch
}您从{3}，{2}在{4}的{5}处收到了{0}，{1}的新处方。<br><br>
请检查您的Aimedis个人资料中的请求。 如果您有任何问题，请通过医生电子邮件地址或医生电话号{7} 码与{8} <br>医生联系 。 或者，您可以通过以下方式与我们联系${emailLink} 或Aimedis支持聊天，如果你<br>有困难联系医生。`;

const prescription_mssg_de = ` ${
  common.dear_with_name.de
} Sie haben ein neues Rezept für {0}, {1} am {5} um {4} von {3}, {2} erhalten.<br><br>
Bitte überprüfen Sie die Anfrage in Ihrem Aimedis-Profil. Bei Fragen wenden Sie sich bitte über die<br> {7} oder die {8} an den Arzt. Alternativ können Sie<br> uns über ${emailLink} oder den Aimedis-Support-Chat kontaktieren, wenn Sie<br> Schwierigkeiten haben, den Arzt zu kontaktieren.`;

const prescription_mssg_nl = ` ${
  common.dear_with_name.nl
} U heeft een nieuw recept ontvangen voor {0}, {1}, op {5} om {4} van {3}, {2}.<br><br>
Controleer het verzoek in uw Aimedis-profiel. Als u vragen heeft, neem dan contact op met de arts via<br> {7} of {8}. Als alternatief kunt u contact met ons opnemen<br> via ${emailLink} of de Aimedis-ondersteuningschat als u problemen heeft om contact op te<br> nemen met de arts.`;

const prescription_mssg_sp = ` ${
  common.dear_with_name.sp
} Recibió una nueva receta para {0}, {1}, el {5} en {4} de {3}, {2}.<br><br>
Por favor, consulte la solicitud dentro de su perfil Aimedis. Si tiene alguna pregunta, comuníquese con<br> el médico a través de {7} o {8}. Alternativamente,<br> puede contactarnos a través de ${emailLink} o mediante el chat de soporte Aimedis si tiene<br> dificultades para comunicarse con el médico.`;

const prescription_mssg_sw = ` ${
  common.dear_with_name.sw
}Ulipokea dawa mpya ya {0}, {1}, tarehe {5} saa {4} kutoka {3}, {2}.<br><br>
Tafadhali angalia ombi ndani ya wasifu wswako wa Aimedis. Ikiwa una maswali yoyote, tafadhali wasiliana na daktari<br> kupitia {7} au NAMBA YA {8}. Vinginevyo, unaweza kuwasiliana nasi kupitia<br> ${emailLink} au mazungumzo ya msaada wa Aimedis ikiwa una shida kuwasiliana daktari.`;

const prescription_mssg_rs = ` ${
  common.dear_with_name.rs
} Вы получили новый рецепт на {0}, {1}, {5} в {4} от {3}, {2}.<br><br>
Пожалуйста, примите запрос в вашем профиле Aimedis. Если у вас есть вопросы, пожалуйста,<br> свяжитесь с врачом по {7} или {8}. Кроме того, вы <br>можете связаться с нами по адресу ${emailLink} или в чате службы поддержки Aimedis,<br> если у вас возникли трудности во время связи с доктором.`;

const prescription_mssg_pt = ` ${
  common.dear_with_name.pt
} recebeu uma nova receita para ID PACIENTE, NOME-PACIENTE, no DATA às HORA de ID MÉDICO, NOME-MÉDICO.<br><br>
Por favor, consulte a solicitação dentro do seu perfil Aimedis. Se tiver alguma dúvida, entre em contato<br> com o médico via {7} ou {8}. Alternativamente, pode nos<br> contatar via ${emailLink} ou pelo chat de suporte da Aimedis se tiver dificuldades para entrar<br> em contato com o médico.`;

const prescription_mssg_fr = ` ${
  common.dear_with_name.fr
} vous avez reçu une nouvelle prescription pour L'IDENTIFIANT DU PATIENT, LE NOM DU PATIENT, à la<br> DATE et à L'HEURE de L'IDENTIFIANT DU MEDECIN, NOM DU MEDECIN.<br><br>
veuillez vérifier la demande dans votre profil visantis. si vous avez des questions, veuillez contacter le<br> MEDECIN via l'adresse {7} ou son {8}. Vous pouvez également<br> nous contacter via ${emailLink} ou via le chat d'assistance de visantis si vous rencontrez des<br> difficultés pour contacter le médecin.`;

const prescription_mssg_ar = `${arabicContainerstart}${common.dear_with_name.ar}
لقد تلقيت وصفة طبية جديدة لـ {0} ، {1} ، في {5} الساعة {4} من {3} ، {2}. <br> <br>
يرجى التحقق من الطلب الموجود داخل ملف تعريف Aimedis الخاص بك. إذا كانت لديك أية أسئلة ، فيرجى الاتصال بالطبيب عبر {7} أو {8}. بدلاً من ذلك ، يمكنك الاتصال بنا عبر {emailLink} أو دردشة دعم Aimedis إذا واجهتك صعوبات في الاتصال بالطبيب.
`;

module.exports.pharmacyLang = {
  welcome_message_pharmacy: {
    en: welcome_message_pharmacy_en,
    de: welcome_message_pharmacy_de,
    nl: welcome_message_pharmacy_nl,
    rs: welcome_message_pharmacy_rs,
    ch: welcome_message_pharmacy_ch,
    sw: welcome_message_pharmacy_sw,
    sp: welcome_message_pharmacy_sp,
    pt: welcome_message_pharmacy_pt,
    ar: welcome_message_pharmacy_ar,
    fr: welcome_message_pharmacy_fr,
  },
  prescription_mssg_pharmacy: {
    en: prescription_mssg_en,
    de: prescription_mssg_de,
    nl: prescription_mssg_nl,
    rs: prescription_mssg_rs,
    ch: prescription_mssg_ch,
    sw: prescription_mssg_sw,
    sp: prescription_mssg_sp,
    pt: prescription_mssg_pt,
    ar: prescription_mssg_ar,
    fr: prescription_mssg_fr,
  },
};

let messageStuct = {
  patient_name: 1,
  patient_id: 0,
  doctor_name: 2,
  doctor_id: 3,
  time: 4,
  date: 5,
  dear_name: 6,
  doc_email: 7,
  doc_mob: 8,
};
