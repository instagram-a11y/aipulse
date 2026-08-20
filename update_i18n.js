const fs = require('fs');

const en = JSON.parse(fs.readFileSync('./messages/en.json', 'utf8'));
const fa = JSON.parse(fs.readFileSync('./messages/fa.json', 'utf8'));

en.hero = {
  ...en.hero,
  title_part1: "Diagnosing business problems.",
  title_part2: "Building bespoke AI systems.",
  line3: "We build custom AI agents, automation, CRM systems, dynamic websites and intelligent workflows that scale with your enterprise."
};

en.trust = {
  steps: ["Strategy", "Prototype", "Integration", "Training", "Optimization"]
};

en.impact = {
  heading_part1: "Intelligent Automation,",
  heading_part2: "Built for Scale.",
  body: "From highly sophisticated conversational AI that qualifies leads, to deep CRM automation that coordinates your entire pipeline. We deploy infrastructure that performs."
};

fa.hero = {
  ...fa.hero,
  title_part1: "تشخیص چالش‌های کسب‌وکار.",
  title_part2: "ساخت سیستم‌های هوش مصنوعی اختصاصی.",
  line3: "ما نمایندگان هوش مصنوعی (AI Agents)، اتوماسیون، سیستم‌های مدیریت ارتباط با مشتری (CRM)، وب‌سایت‌های داینامیک و ورک‌فلوهای هوشمندی می‌سازیم که همراه با سازمان شما رشد می‌کنند.",
  cta_primary: "رزرو جلسه مشاوره هوش مصنوعی"
};

fa.trust = {
  steps: ["استراتژی", "پروتوتایپ", "یکپارچه‌سازی", "آموزش", "بهینه‌سازی"]
};

fa.impact = {
  heading_part1: "اتوماسیون هوشمند،",
  heading_part2: "ساخته شده برای مقیاس‌پذیری.",
  body: "از هوش مصنوعی مکالمه‌ای بسیار پیشرفته که مشتریان را ارزیابی می‌کند، تا اتوماسیون عمیق CRM که کل پایپ‌لاین شما را هماهنگ می‌سازد. ما زیرساختی را پیاده‌سازی می‌کنیم که بالاترین عملکرد را دارد."
};

fa.problem = {
  ...fa.problem,
  heading: "اگر کاری تکراری است، تاخیر دارد یا به یک شخص خاص وابسته است، احتمالاً قابلیت طراحی مجدد دارد.",
  sub: "ما گلوگاه‌هایی که سرعت کسب‌وکار شما را کم می‌کنند کشف کرده و سیستم‌های هوش مصنوعی را طراحی و پیاده‌سازی می‌کنیم که در زمان صرفه‌جویی کرده، هزینه‌ها را کاهش داده و تجربه بهتری رقم می‌زنند.",
  items: {
    support: "سوالات مشتریان که هر روز به صورت دستی پاسخ داده می‌شوند",
    leads: "سرنخ‌های فروش که در پیام‌ها، اکسل و ایمیل‌ها پراکنده‌اند",
    calendar: "قرارهای ملاقات، یادآوری‌ها و پیگیری‌هایی که دستی انجام می‌شوند",
    content: "تولید محتوایی که با شلوغ شدن تیم متوقف می‌شود",
    training: "آموزش‌هایی که با سطح یادگیری هر فرد تطبیق پیدا نمی‌کنند",
    reports: "گزارش‌هایی که به سختی از سیستم‌های جداگانه جمع‌آوری می‌شوند"
  }
};

fa.services = {
  ...fa.services,
  label: "آنچه برای شما می‌سازیم",
  heading: "راه‌حل‌هایی که حول جریان کاری و داده‌های شما طراحی شده‌اند",
  items: {
    agents: { title: "نمایندگان هوشمند (Agents)", body: "هم‌تیمی‌های دیجیتالی که تحقیق می‌کنند، تصمیم می‌گیرند، پیش‌نویس می‌نویسند و کارهای تایید شده را تکمیل می‌کنند." },
    chatbots: { title: "چت‌بات‌های پیشرفته", body: "پشتیبانی دوزبانه مشتریان و ارزیابی سرنخ‌های فروش در وب‌سایت و پیام‌رسان‌ها." },
    crm: { title: "سیستم CRM اختصاصی", body: "یک منبع یکپارچه برای سرنخ‌ها، وظایف، پیگیری‌ها، اسناد و عملکرد." },
    websites: { title: "وب‌سایت‌های داینامیک", body: "صفحات، لیست‌ها، قیمت‌ها و محتوایی که با داده‌های زنده به‌روز می‌شوند." },
    content: { title: "موتور تولید محتوای AI", body: "ایده‌پردازی ایمن برای برند، کپشن‌ها، تصاویر، زمان‌بندی و یادگیری از عملکرد." },
    learning: { title: "یادگیری تطبیقی", body: "آموزشی که به هر فرد واکنش نشان داده و تنها پس از تسلط کامل، سطح بعدی را باز می‌کند." }
  }
};

fa.team = {
  ...fa.team,
  label: "بنیان‌گذار",
  heading: "هوش مصنوعی کاربردی، بر اساس واقعیت‌های کسب‌وکار.",
  title: "بنیان‌گذار و مدیر اجرایی",
  bio: "«من این مجموعه را برای پر کردن شکاف بین وعده‌های هوش مصنوعی و آنچه کسب‌وکارها واقعاً می‌توانند استفاده کنند ایجاد کردم. ما کار را با واقعیت روزمره شما شروع می‌کنیم، نه با یک ابزار—و تنها چیزی را می‌سازیم که ارزش ملموس خلق کند.»"
};

fa.homeCta = {
  heading: "کسب‌وکار شما در این ماه چه کارهای دستی‌ای را می‌تواند به هوش مصنوعی بسپارد؟",
  button: "یافتن بهترین فرصت‌های هوش مصنوعی"
};

fs.writeFileSync('./messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('./messages/fa.json', JSON.stringify(fa, null, 2));
