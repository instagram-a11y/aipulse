const fs = require('fs');

function updateJson(file, newLine3) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.hero.line3 = newLine3;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

updateJson('./messages/en.json', "Providing premium AI consulting for all types of businesses. We build custom AI agents, CRM systems, dynamic websites, and intelligent workflows that scale with your enterprise.");
updateJson('./messages/fa.json', "ارائه مشاوره تخصصی هوش مصنوعی برای انواع کسب‌وکارها. ما ایجنت‌های اختصاصی (AI Agents)، سیستم‌های CRM، وب‌سایت‌های داینامیک و ورک‌فلوهای هوشمندی می‌سازیم که کسب‌وکار شما را متحول می‌کنند.");
