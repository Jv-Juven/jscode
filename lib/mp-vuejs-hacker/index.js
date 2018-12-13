import { proxyMPdata } from './lib/proxy';
export default function (page) {
    proxyMPdata(page, page.data);
};
