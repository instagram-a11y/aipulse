const fs = require('fs');

function updateJson(file, translations) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.services = { ...data.services, ...translations };
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const enTranslations = {
  label: "AI Solutions & Consulting",
  heading: "Transforming Businesses with Artificial Intelligence",
  items: {
    agents: {
      title: "Custom AI Agents",
      body: "We build bespoke AI agents tailored to your business logic. These intelligent assistants can handle customer inquiries, process documents, and make decisions autonomously, saving you thousands of hours of manual work."
    },
    automation: {
      title: "Process Automation",
      body: "Identify and eliminate bottlenecks. We integrate intelligent automation across your existing tools to streamline operations, reduce human error, and accelerate your time-to-market."
    },
    webapps: {
      title: "AI-Powered Platforms",
      body: "Development of dynamic, highly scalable web applications and platforms with built-in machine learning capabilities, enabling personalized user experiences and predictive insights."
    },
    cloud: {
      title: "Data & Cloud Infrastructure",
      body: "Secure, scalable, and optimized cloud architectures. We help you organize your unstructured data into centralized data lakes, making it ready for advanced AI training and analytics."
    },
    strategy: {
      title: "AI Strategy Consulting",
      body: "Not sure where to start? We assess your business model, identify high-ROI opportunities for AI integration, and create a comprehensive roadmap for digital transformation."
    },
    custom: {
      title: "CRM & ERP Integration",
      body: "Seamlessly connect intelligent systems into your existing CRM (Salesforce, HubSpot, etc.) or ERP. Automate lead scoring, customer follow-ups, and inventory forecasting."
    }
  },
  process_heading: "Our Consulting Methodology",
  process: {
    discovery: {
      title: "1. Needs Assessment",
      body: "We analyze your workflows, bottlenecks, and data infrastructure to identify where AI can deliver the highest ROI."
    },
    design: {
      title: "2. Strategic Design",
      body: "We architect a bespoke solution, selecting the right LLMs, automation tools, and tech stack tailored to your enterprise."
    },
    build: {
      title: "3. Development",
      body: "Our engineers build, train, and integrate the AI systems securely within your existing ecosystem."
    },
    deploy: {
      title: "4. Deployment & Training",
      body: "We deploy the systems, monitor performance, and train your team to leverage the new AI capabilities effectively."
    }
  },
  pricing_note: "Every business is unique. We offer bespoke solutions designed to deliver measurable ROI, not generic templates."
};

const faTranslations = {
  label: "مشاوره و راهکارهای هوش مصنوعی",
  heading: "تحول کسب‌وکار شما به کمک هوش مصنوعی",
  items: {
    agents: {
      title: "طراحی ایجنت‌های اختصاصی",
      body: "ما دستیاران هوشمند (AI Agents) اختصاصی بر اساس منطق کسب‌وکار شما می‌سازیم. این سیستم‌ها می‌توانند به صورت خودکار به مشتریان پاسخ دهند، اسناد را پردازش کنند و تصمیم‌گیری نمایند تا هزاران ساعت در زمان شما صرفه‌جویی شود."
    },
    automation: {
      title: "اتوماسیون هوشمند فرآیندها",
      body: "گلوگاه‌های کاری خود را حذف کنید. ما با یکپارچه‌سازی اتوماسیون‌های هوشمند در ابزارهای فعلی شما، خطای انسانی را کاهش داده و سرعت عملیات را به شدت بالا می‌بریم."
    },
    webapps: {
      title: "پلتفرم‌های مبتنی بر AI",
      body: "توسعه وب‌سایت‌ها و پلتفرم‌های مقیاس‌پذیر با قابلیت‌های یادگیری ماشین درون‌ساخت (Built-in ML)، که تجربه‌ای شخصی‌سازی‌شده و تحلیل‌های پیش‌بینانه را برای کاربران شما فراهم می‌کنند."
    },
    cloud: {
      title: "زیرساخت داده و ابری",
      body: "معماری ابری امن و بهینه‌سازی شده. ما به شما کمک می‌کنیم داده‌های پراکنده خود را سازماندهی کنید تا برای آموزش مدل‌های هوش مصنوعی و تحلیل‌های پیشرفته آماده شوند."
    },
    strategy: {
      title: "مشاوره استراتژی AI",
      body: "نمی‌دانید از کجا شروع کنید؟ ما مدل کسب‌وکار شما را بررسی کرده و بهترین فرصت‌ها برای پیاده‌سازی هوش مصنوعی با بالاترین بازگشت سرمایه (ROI) را شناسایی می‌کنیم."
    },
    custom: {
      title: "یکپارچه‌سازی با CRM و ERP",
      body: "سیستم‌های هوشمند را به صورت یکپارچه به نرم‌افزارهای CRM یا ERP فعلی خود متصل کنید. از پیگیری خودکار لیدها تا پیش‌بینی موجودی انبار."
    }
  },
  process_heading: "متدولوژی مشاوره ما",
  process: {
    discovery: {
      title: "۱. کشف و ارزیابی نیازها",
      body: "ما فرآیندها، داده‌ها و چالش‌های شما را آنالیز می‌کنیم تا مشخص شود هوش مصنوعی در کدام بخش بیشترین سودآوری را دارد."
    },
    design: {
      title: "۲. طراحی استراتژیک",
      body: "ما یک راهکار اختصاصی طراحی می‌کنیم و بهترین مدل‌های زبانی (LLMs) و ابزارهای اتوماسیون را برای سازمان شما انتخاب می‌کنیم."
    },
    build: {
      title: "۳. توسعه و پیاده‌سازی",
      body: "مهندسان ما سیستم‌های هوش مصنوعی را توسعه داده و با بالاترین استانداردهای امنیتی به سیستم‌های فعلی شما متصل می‌کنند."
    },
    deploy: {
      title: "۴. استقرار و آموزش تیم",
      body: "سیستم‌ها مستقر و پایش می‌شوند. در نهایت به تیم شما آموزش می‌دهیم تا چگونه از این ابزارهای جدید به بهترین شکل استفاده کنند."
    }
  },
  pricing_note: "هر کسب‌وکار منحصربه‌فرد است. ما راهکارهای اختصاصی و تضمین‌شده‌ای ارائه می‌دهیم تا سرمایه شما به سرعت بازگردد."
};

updateJson('./messages/en.json', enTranslations);
updateJson('./messages/fa.json', faTranslations);
