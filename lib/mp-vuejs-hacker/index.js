import { proxyMPdata } from './lib/proxy';
import { initData, initComputed, initWatch } from './lib/init';
export default function (page) {
    // 代理data
    proxyMPdata(page, page.data);
    initData(page);
    if (page.computed) initComputed(page, page.computed);
    if (page.watch) initWatch(page, page.watch);
    return page;
};
