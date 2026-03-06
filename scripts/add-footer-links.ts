/**
 * One-time script to add the 3 new footer support links + content blocks + legal sections.
 * Run with: npx tsx scripts/add-footer-links.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const NEW_LINKS = [
  {
    labelEn: "Deposit & Withdrawal Policy",
    labelAr: "سياسة الإيداع والسحب",
    href: "/deposit-withdrawal-policy",
  },
  {
    labelEn: "Website Verification",
    labelAr: "التحقق من الموقع الرسمي",
    href: "/website-verification",
  },
  {
    labelEn: "Security & Reliability",
    labelAr: "الأمان والموثوقية",
    href: "/security-reliability",
  },
];

async function main() {
  // ── 1. Footer nav links ─────────────────────────────────────────────────────
  const existing = await prisma.navItem.findMany({
    where: { location: "footerSupportLinks" },
    orderBy: { sortOrder: "desc" },
    take: 1,
  });

  let nextOrder = (existing[0]?.sortOrder ?? -1) + 1;

  for (const link of NEW_LINKS) {
    const found = await prisma.navItem.findFirst({
      where: { location: "footerSupportLinks", href: link.href },
    });
    if (found) {
      console.log(`Already exists: ${link.href}`);
      continue;
    }

    await prisma.navItem.create({
      data: {
        location: "footerSupportLinks",
        labelEn: link.labelEn,
        labelAr: link.labelAr,
        href: link.href,
        hasDropdown: false,
        sortOrder: nextOrder++,
        parentId: null,
      },
    });
    console.log(`Added nav link: ${link.labelEn} (${link.href})`);
  }

  // ── 2. Content blocks (hero titles) ─────────────────────────────────────────
  const contentBlocks = [
    { key: "legal.depositWithdrawalHeroTitle", value: { en: "Deposit & Withdrawal Policy", ar: "سياسة الإيداع والسحب" } },
    { key: "legal.websiteVerificationHeroTitle", value: { en: "Official Website Verification", ar: "التحقق من الموقع الرسمي" } },
    { key: "legal.securityReliabilityHeroTitle", value: { en: "Security & Reliability", ar: "الأمان والموثوقية" } },
  ];

  for (const block of contentBlocks) {
    const exists = await prisma.contentBlock.findUnique({ where: { key: block.key } });
    if (exists) {
      console.log(`Content block already exists: ${block.key}`);
      continue;
    }
    await prisma.contentBlock.create({
      data: { key: block.key, valueJson: JSON.stringify(block.value) },
    });
    console.log(`Added content block: ${block.key}`);
  }

  // ── 3. Legal sections — Deposit & Withdrawal ───────────────────────────────
  const dwExists = await prisma.legalSection.findFirst({ where: { pageType: "deposit-withdrawal" } });
  if (dwExists) {
    console.log("Legal sections for deposit-withdrawal already exist, skipping.");
  } else {
    const depositWithdrawalSections = [
      {
        titleAr: "السحب: كيف يتم؟",
        paragraphsAr: [
          "يتم السحب من المحفظة/بوابة العميل عبر تقديم طلب سحب، ثم اختيار وسيلة الاستلام حسب المتاح.",
        ],
      },
      {
        titleAr: "قواعد أساسية للسحب",
        paragraphsAr: [
          "السحب يكون لصاحب الحساب فقط.",
          "غالباً يتم السحب إلى نفس مصدر الإيداع قدر الإمكان (نفس الحساب البنكي/نفس البطاقة) لتقليل مخاطر الاحتيال ومشاكل المطابقة.",
          "إذا طلبت السحب إلى وسيلة مختلفة عن التي أودعت منها: قد يُطلب مستندات إضافية لإثبات الملكية، أو قد يتم تحويل الطلب للطريقة المعتمدة وفق السياسة والمتطلبات.",
        ],
      },
      {
        titleAr: "مدة السحب",
        paragraphsAr: [
          "مدة السحب عادة تمر بمرحلتين واضحتين:",
          "المرحلة 1: المعالجة والمراجعة داخل نمايا - غالباً تتم خلال 24–48 ساعة عمل إذا كانت البيانات مكتملة ولا توجد ملاحظات.",
          "المرحلة 2: وصول المبلغ من البنك/مزود الدفع - تحويل بنكي: غالباً 1–5 أيام عمل حسب البنك. استرجاع إلى البطاقة (Refund): قد يستغرق عدة أيام وقد يصل إلى 14 يوم عمل حسب سياسة البنك وشبكة البطاقة.",
          "إذا تخللت العملية عطلة/ويكند أو كان هناك ضغط لدى البنك، من الطبيعي أن تزيد المدة قليلاً.",
        ],
      },
      {
        titleAr: "الإثباتات: ماذا تحصل عليه؟",
        paragraphsAr: [
          "عادة ستحصل داخل حسابك على: رقم العملية/رقم الطلب (مرجع داخلي)، حالة الطلب (مثل: قيد المعالجة / مكتمل / مرفوض)، سجل عمليات يوضح: التاريخ، المبلغ، طريقة الدفع، وأي رسوم إن وُجدت.",
          "بالنسبة للتحويل البنكي: احتفظ بإيصال التحويل والمرجع البنكي إن توفر.",
        ],
      },
      {
        titleAr: "إثباتات قد تُطلب منك",
        paragraphsAr: [
          "غالباً تُطلب عند: فتح الحساب/أول سحب/تغيير وسيلة السحب/وجود اختلاف بالبيانات أو عملية غير معتادة.",
          "(أ) إثبات الهوية: هوية وطنية / إقامة / جواز سفر (ساري وواضح).",
          "(ب) إثبات العنوان: فاتورة خدمات أو كشف حساب بنكي يظهر فيه الاسم والعنوان (ويُفضّل أن يكون حديثاً).",
          "(ج) إثبات ملكية وسيلة الدفع: للتحويل البنكي: كشف حساب أو شهادة IBAN يظهر اسم صاحب الحساب ورقم الآيبان. للبطاقة: قد يُطلب أحياناً صورة للبطاقة مع إخفاء الأرقام الوسطى (والاحتفاظ بآخر 4 أرقام فقط).",
          "(د) مستندات إضافية عند الحاجة: إذا كان هناك اختلاف اسم، أو إيداع غير معتاد، أو طلب سحب لطريقة مختلفة: قد يُطلب توضيح أو مستند داعم بحسب الحالة.",
        ],
      },
      {
        titleAr: "حالات قد تسبب تأخيراً",
        paragraphsAr: [
          "قد تتأخر العملية إذا وُجد أحد التالي:",
          "الحساب غير مكتمل التوثيق.",
          "اسم المودع/صاحب وسيلة الدفع مختلف عن اسم صاحب الحساب.",
          "بيانات التحويل ناقصة (مثل مرجع التحويل/IBAN/اسم…).",
          "تم تقديم طلب السحب خلال عطلة أو خارج أيام العمل.",
          "وجود مراجعات أو تأخير داخلي لدى البنك/مزود الدفع.",
        ],
      },
      {
        titleAr: "كيف تتتبع طلبك بطريقة صحيحة؟",
        paragraphsAr: [
          "احتفظ دائماً برقم العملية/رقم الطلب داخل بوابة العميل.",
          "في التحويل البنكي تحديداً: احتفظ بإيصال التحويل والمرجع البنكي (إن وجد).",
          "إذا تأخر التنفيذ عن المدة المتوقعة، غالباً أفضل خطوة هي تزويد الدعم بـ: رقم الطلب، تاريخ العملية، طريقة الدفع، صورة/إيصال التحويل أو المرجع البنكي.",
        ],
      },
    ];

    for (let i = 0; i < depositWithdrawalSections.length; i++) {
      const sec = depositWithdrawalSections[i];
      await prisma.legalSection.create({
        data: {
          pageType: "deposit-withdrawal",
          titleEn: sec.titleAr,
          titleAr: sec.titleAr,
          paragraphsEn: JSON.stringify(sec.paragraphsAr),
          paragraphsAr: JSON.stringify(sec.paragraphsAr),
          sortOrder: i,
        },
      });
    }
    console.log("Added legal sections for deposit-withdrawal");
  }

  // ── 4. Legal sections — Website Verification ───────────────────────────────
  const wvExists = await prisma.legalSection.findFirst({ where: { pageType: "website-verification" } });
  if (wvExists) {
    console.log("Legal sections for website-verification already exist, skipping.");
  } else {
    const websiteVerificationSections = [
      {
        titleAr: "تأكد من عنوان الموقع (الدومين)",
        paragraphsAr: [
          "هذا دليل معلوماتي سريع يساعدك تتحقق من الرابط قبل ما تعبي بياناتك أو تسجل دخول.",
          "الموقع الرسمي يكون على نطاق: namaya.ar",
          "الأفضل تكتب الرابط بنفسك في المتصفح بدل ما تضغط من إعلان/رسالة.",
          "انتبه من الروابط اللي فيها: حرف زايد/ناقص (مثل: namayaa / namaaya)، نطاق مختلف (مثل .com / .net)، كلمات إضافية (مثل: namaya-invest… / namaya-official…).",
        ],
      },
      {
        titleAr: "تأكد من القفل و HTTPS",
        paragraphsAr: [
          "قبل تسجيل الدخول أو تعبئة أي نموذج:",
          "لازم تشوف علامة القفل جنب الرابط.",
          "لازم يبدأ الرابط بـ https://",
          "إذا طلع تحذير \"الموقع غير آمن\" أو \"الشهادة فيها مشكلة\" → اطلع ولا تكمل.",
        ],
      },
      {
        titleAr: "طابق قنوات التواصل الرسمية داخل الموقع",
        paragraphsAr: [
          "من داخل الموقع الرسمي راح تلقى وسائل التواصل (مثل الإيميل/نماذج التواصل). قاعدة عامة للتحقق:",
          "الإيميل الرسمي غالباً يكون على نفس النطاق مثل: …@namaya.ar",
          "إذا أحد يتواصل معك من إيميل مجاني (Gmail / Hotmail) أو رقم مجهول ويطلب بيانات حساسة → تعامل بحذر.",
        ],
      },
      {
        titleAr: "انتبه للروابط المختصرة والرسائل المجهولة",
        paragraphsAr: [
          "الروابط المختصرة (مثل bit.ly) ما تبين لك الوجهة الحقيقية بسهولة.",
          "الرسائل اللي تقول \"حسابك بيتوقف\" أو \"فعل الآن بسرعة\" غالباً هدفها استعجالك.",
          "أي رابط يطلب منك \"تسجيل دخول\" مباشرة من داخل رسالة → الأفضل تتجاهله والدخول من namaya.ar يدوياً.",
        ],
      },
      {
        titleAr: "علامات واضحة إن الرابط غير موثوق",
        paragraphsAr: [
          "لا تكمل إذا لاحظت أي شيء من التالي:",
          "يطلب منك رمز التحقق (OTP) أو كلمة المرور عبر واتساب/اتصال.",
          "يطلب منك تثبيت ملف APK أو برنامج غير معروف.",
          "يطلب منك تشغيل \"مشاركة شاشة\" أو \"تحكم عن بُعد\".",
          "يطلب تحويل مالي \"بشكل عاجل\" إلى حساب شخصي.",
        ],
      },
      {
        titleAr: "أفضل طريقة تثبيت \"التحقق\" يومياً",
        paragraphsAr: [
          "بعد ما تتأكد من الرابط الصحيح: احفظ الموقع في المفضلة (Bookmark) وادخل عليه دائماً من المفضلة بدل البحث كل مرة.",
        ],
      },
      {
        titleAr: "قائمة تحقق سريعة",
        paragraphsAr: [
          "الرابط: namaya.ar",
          "يوجد قفل و https",
          "لا توجد تحذيرات أمان من المتصفح",
          "بيانات التواصل داخل الموقع على نفس النطاق",
          "لا تضغط روابط مختصرة/غريبة",
          "لا تعطي OTP أو كلمة المرور لأي شخص",
        ],
      },
    ];

    for (let i = 0; i < websiteVerificationSections.length; i++) {
      const sec = websiteVerificationSections[i];
      await prisma.legalSection.create({
        data: {
          pageType: "website-verification",
          titleEn: sec.titleAr,
          titleAr: sec.titleAr,
          paragraphsEn: JSON.stringify(sec.paragraphsAr),
          paragraphsAr: JSON.stringify(sec.paragraphsAr),
          sortOrder: i,
        },
      });
    }
    console.log("Added legal sections for website-verification");
  }

  // ── 5. Legal sections — Security & Reliability ─────────────────────────────
  const srExists = await prisma.legalSection.findFirst({ where: { pageType: "security-reliability" } });
  if (srExists) {
    console.log("Legal sections for security-reliability already exist, skipping.");
  } else {
    const securityReliabilitySections = [
      {
        titleAr: "الأمان والموثوقية في نمايا",
        paragraphsAr: [
          "نضع حماية أصولك وبياناتك على رأس أولوياتنا. اكتشف لماذا يثق بنا المستثمرون.",
          "تشفير SSL - حماية بيانات 256-bit.",
          "حسابات مفصولة - أموالك في أمان تام.",
        ],
      },
      {
        titleAr: "التزامنا بالأنظمة واللوائح",
        paragraphsAr: [
          "تلتزم منصة نمايا بكافة المعايير التنظيمية المعمول بها لضمان بيئة استثمارية شفافة وعادلة. نحن نعمل وفق بروتوكولات صارمة لمكافحة غسيل الأموال (AML) وتعرف على عميلك (KYC).",
        ],
      },
      {
        titleAr: "كيف نحمي حسابك؟",
        paragraphsAr: [
          "المصادقة الثنائية (2FA) - طبقة حماية إضافية لضمان أنك الوحيد القادر على الوصول لحسابك.",
          "مراقبة مستمرة - أنظمة ذكية لرصد أي نشاط مشبوه على مدار الساعة.",
          "حماية البيانات - لا نشارك بياناتك مع أي طرف ثالث دون موافقتك الصريحة.",
        ],
      },
      {
        titleAr: "توضيح هام",
        paragraphsAr: [
          "نحرص في نمايا على الشفافية التامة. جميع عملياتنا الاستثمارية واضحة وموثقة. في حال وجود أي استفسار حول التراخيص أو الأمان، يرجى التواصل معنا مباشرة عبر القنوات الرسمية.",
        ],
      },
    ];

    for (let i = 0; i < securityReliabilitySections.length; i++) {
      const sec = securityReliabilitySections[i];
      await prisma.legalSection.create({
        data: {
          pageType: "security-reliability",
          titleEn: sec.titleAr,
          titleAr: sec.titleAr,
          paragraphsEn: JSON.stringify(sec.paragraphsAr),
          paragraphsAr: JSON.stringify(sec.paragraphsAr),
          sortOrder: i,
        },
      });
    }
    console.log("Added legal sections for security-reliability");
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
