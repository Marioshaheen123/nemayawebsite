const Database = require('better-sqlite3');
const db = new Database('prisma/dev.db');

// Create tables if they don't exist
db.exec(`
CREATE TABLE IF NOT EXISTS EconomicDevelopment (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  imageUrl TEXT NOT NULL,
  day TEXT NOT NULL,
  monthEn TEXT NOT NULL,
  monthAr TEXT NOT NULL,
  readTimeEn TEXT NOT NULL,
  readTimeAr TEXT NOT NULL,
  titleEn TEXT NOT NULL,
  titleAr TEXT NOT NULL,
  excerptEn TEXT NOT NULL,
  excerptAr TEXT NOT NULL,
  bodyEn TEXT NOT NULL,
  bodyAr TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS SuggestedEconomicDevelopment (
  id TEXT PRIMARY KEY NOT NULL,
  imageUrl TEXT NOT NULL,
  titleEn TEXT NOT NULL,
  titleAr TEXT NOT NULL,
  slug TEXT NOT NULL,
  sortOrder INTEGER NOT NULL DEFAULT 0
);
`);
console.log('Tables ensured');

// Insert ContentBlock for hero title
const heroTitleKey = 'economicDevelopments.pageHeroTitle';
const heroTitleValue = JSON.stringify({ en: 'Economic Developments', ar: 'التطورات الاقتصادية' });

const existing = db.prepare('SELECT id FROM ContentBlock WHERE key = ?').get(heroTitleKey);
if (existing) {
  db.prepare('UPDATE ContentBlock SET valueJson = ? WHERE key = ?').run(heroTitleValue, heroTitleKey);
  console.log('Updated content block');
} else {
  const id = 'econdev-hero-' + Date.now();
  const now = new Date().toISOString();
  db.prepare('INSERT INTO ContentBlock (id, key, valueJson, updatedAt) VALUES (?, ?, ?, ?)').run(id, heroTitleKey, heroTitleValue, now);
  console.log('Inserted content block');
}

// Insert sample economic development articles
const articles = [
  { slug: 'somalia-eritrea-bilateral-cooperation', imageUrl: '/uploads/econ-dev-1.jpg', day: '12', monthEn: 'January', monthAr: 'يناير', readTimeEn: '10 min read', readTimeAr: '10 دقائق قراءة', titleEn: 'Somalia and Eritrea resume bilateral diplomatic missions and strengthen bilateral cooperation', titleAr: 'الصومال وإريتريا تستأنفان الرحلات الجوية المباشرة وتعززان التعاون الثنائي', excerptEn: 'Somalia and Eritrea have taken a significant step towards strengthening their bilateral relations.', excerptAr: 'اتخذت الصومال وإريتريا خطوة مهمة نحو تعزيز علاقاتهما الثنائية.', bodyEn: '["Somalia and Eritrea have taken a significant step.","The two nations agreed to establish permanent embassies."]', bodyAr: '["اتخذت الصومال وإريتريا خطوة مهمة.","اتفقت الدولتان على إنشاء سفارات دائمة."]', featured: 1, published: 1, sortOrder: 0 },
  { slug: 'imf-calls-nigeria-fiscal-policy', imageUrl: '/uploads/econ-dev-2.jpg', day: '09', monthEn: 'January', monthAr: 'يناير', readTimeEn: '8 min read', readTimeAr: '8 دقائق قراءة', titleEn: 'The IMF calls on Nigeria to implement tighter fiscal policies to reduce the inflation rate', titleAr: 'صندوق النقد الدولي يدعو نيجيريا إلى إعادة ضبط سياساتها لتخفيض أسعار الغذاء', excerptEn: 'The International Monetary Fund has urged Nigeria to adopt stricter fiscal measures.', excerptAr: 'حث صندوق النقد الدولي نيجيريا على تبني إجراءات مالية أكثر صرامة.', bodyEn: '["The IMF has urged Nigeria to adopt stricter measures.","The IMF recommends reducing government spending."]', bodyAr: '["حث صندوق النقد الدولي نيجيريا.","يوصي صندوق النقد الدولي بتقليل الإنفاق."]', featured: 0, published: 1, sortOrder: 1 },
  { slug: 'imf-announces-global-economy-achievements', imageUrl: '/uploads/econ-dev-3.jpg', day: '08', monthEn: 'January', monthAr: 'يناير', readTimeEn: '7 min read', readTimeAr: '7 دقائق قراءة', titleEn: 'The IMF announces that the global economy has achieved better than expected results', titleAr: 'صندوق النقد الدولي يعلن أن الاقتصاد العالمي حقق نتائج أفضل من المتوقع', excerptEn: 'The International Monetary Fund highlighted global economic resilience.', excerptAr: 'أبرز صندوق النقد الدولي أن الاقتصاد العالمي أظهر مرونة ملحوظة.', bodyEn: '["The IMF highlighted global resilience.","Key factors include strong consumer spending."]', bodyAr: '["أبرز صندوق النقد الدولي مرونة عالمية.","تشمل العوامل الرئيسية الإنفاق الاستهلاكي."]', featured: 0, published: 1, sortOrder: 2 },
  { slug: 'world-bank-calls-financing-solutions', imageUrl: '/uploads/econ-dev-4.jpg', day: '10', monthEn: 'January', monthAr: 'يناير', readTimeEn: '6 min read', readTimeAr: '6 دقائق قراءة', titleEn: 'The World Bank calls for new financing solutions to support developing countries', titleAr: 'البنك الدولي يدعو إلى حلول تمويل جديدة لدعم البلدان النامية', excerptEn: 'The World Bank has called for innovative financing mechanisms.', excerptAr: 'دعا البنك الدولي إلى آليات تمويل مبتكرة لدعم الدول النامية.', bodyEn: '["The World Bank has called for innovative financing.","Developing countries face funding shortfalls."]', bodyAr: '["دعا البنك الدولي إلى آليات تمويل مبتكرة.","تواجه البلدان النامية عجزاً تمويلياً سنوياً."]', featured: 0, published: 1, sortOrder: 3 },
  { slug: 'somalia-eritrea-air-travel-cooperation', imageUrl: '/uploads/econ-dev-5.jpg', day: '09', monthEn: 'January', monthAr: 'يناير', readTimeEn: '5 min read', readTimeAr: '5 دقائق قراءة', titleEn: 'Somalia and Eritrea resume direct air travel and strengthen regional cooperation', titleAr: 'الصومال وإريتريا تستأنفان الرحلات الجوية المباشرة وتعززان التعاون الإقليمي', excerptEn: 'In a landmark move, Somalia and Eritrea restored direct flights.', excerptAr: 'في خطوة تاريخية، أعادت الصومال وإريتريا الاتصالات الجوية.', bodyEn: '["Somalia and Eritrea restored direct flights.","The resumption is expected to boost tourism."]', bodyAr: '["أعادت الصومال وإريتريا الاتصالات الجوية.","من المتوقع أن يعزز السياحة."]', featured: 0, published: 1, sortOrder: 4 },
  { slug: 'imf-global-economy-resilience', imageUrl: '/uploads/econ-dev-6.jpg', day: '10', monthEn: 'January', monthAr: 'يناير', readTimeEn: '9 min read', readTimeAr: '9 دقائق قراءة', titleEn: 'IMF: The global economy shows resilience despite ongoing trade tensions', titleAr: 'صندوق النقد الدولي: الاقتصاد العالمي يُظهر مرونة رغم التوترات التجارية', excerptEn: 'Despite trade disputes, global growth maintained its trajectory.', excerptAr: 'رغم تصاعد النزاعات التجارية، حافظ النمو العالمي على مساره.', bodyEn: '["Despite trade disputes, growth maintained.","Central bank policies played a crucial role."]', bodyAr: '["رغم النزاعات التجارية، حافظ النمو.","لعبت السياسات النقدية دوراً حاسماً."]', featured: 0, published: 1, sortOrder: 5 },
];

const nowStr = new Date().toISOString();
const insertArticle = db.prepare('INSERT OR REPLACE INTO EconomicDevelopment (id, slug, imageUrl, day, monthEn, monthAr, readTimeEn, readTimeAr, titleEn, titleAr, excerptEn, excerptAr, bodyEn, bodyAr, featured, published, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

for (const a of articles) {
  insertArticle.run('econdev-' + a.slug, a.slug, a.imageUrl, a.day, a.monthEn, a.monthAr, a.readTimeEn, a.readTimeAr, a.titleEn, a.titleAr, a.excerptEn, a.excerptAr, a.bodyEn, a.bodyAr, a.featured, a.published, a.sortOrder, nowStr, nowStr);
}
console.log('Inserted', articles.length, 'articles');

// Insert suggested economic developments
const suggestions = [
  { slug: 'somalia-eritrea-bilateral-cooperation', titleEn: 'Somalia and Eritrea bilateral cooperation', titleAr: 'التعاون الثنائي بين الصومال وإريتريا', imageUrl: '/uploads/econ-dev-1.jpg' },
  { slug: 'imf-calls-nigeria-fiscal-policy', titleEn: 'IMF fiscal policy for Nigeria', titleAr: 'سياسة صندوق النقد لنيجيريا', imageUrl: '/uploads/econ-dev-2.jpg' },
  { slug: 'imf-announces-global-economy-achievements', titleEn: 'Global economy exceeds expectations', titleAr: 'الاقتصاد العالمي يتجاوز التوقعات', imageUrl: '/uploads/econ-dev-3.jpg' },
  { slug: 'world-bank-calls-financing-solutions', titleEn: 'World Bank financing solutions', titleAr: 'حلول تمويل البنك الدولي', imageUrl: '/uploads/econ-dev-4.jpg' },
];

const insertSuggested = db.prepare('INSERT OR REPLACE INTO SuggestedEconomicDevelopment (id, imageUrl, titleEn, titleAr, slug, sortOrder) VALUES (?, ?, ?, ?, ?, ?)');

for (let i = 0; i < suggestions.length; i++) {
  const s = suggestions[i];
  insertSuggested.run('econdev-sug-' + s.slug, s.imageUrl, s.titleEn, s.titleAr, s.slug, i);
}
console.log('Inserted', suggestions.length, 'suggested items');

db.close();
console.log('Done seeding economic developments!');
