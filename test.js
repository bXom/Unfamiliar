const { chromium } = require('playwright');

(async () => {
  // 启动浏览器
  const browser = await chromium.launch({ 
    channel: 'msedge', // 明确指定使用 edge 渠道
    headless: false 
  });
  const context = await browser.newContext({
    // 模拟真实浏览器特征，绕过部分基础检测
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    // 跳转目标地址
    const url = 'https://www.xiaohongshu.com/explore?source=tourist_search';
    await page.goto(url);

    // 等待笔记卡片渲染
    const sectionSelector = 'section.note-item';
    await page.waitForSelector(sectionSelector, { timeout: 100000 });

    // 抓取基础数据：标题、作者
    const notes = await page.$$eval(sectionSelector, items => {
      console.log('items: ', items);
      return items.map(item => {
        const title = item.querySelector('.footer .title')?.innerText;
        const author = item.querySelector('.footer .author .name')?.innerText;
        return { title, author };
      });
    });

    console.log('抓取结果:', notes);

  } catch (error) {
    console.error('抓取失败:', error);
  } finally {
    // 调试建议：如果需要观察结果，可注释掉 browser.close()
    await browser.close();
  }
})();