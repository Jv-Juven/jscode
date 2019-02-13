
/**
 * 图片加载失败的元素替换为你默认图片
 */
const setDefaultImg = function (options) {
    let defaultOptions = {
        defaultImage: `path/to/images/default_diagram_110x90.png`, // 默认图
        className: '.setDefault-img', // 要处理的对象样式名
        defaultBgColor: '#dcdcdc' // 默认背景
    };
    Object.assign(defaultOptions, options);
    let targetEls = document.querySelectorAll(defaultOptions.className);
    if (!targetEls) {
        return;
    }
    // console.warn('targetEls', targetEls);
    // 加载图片
    let loadImg = function (url, el) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            el.style.backgroundImage = `url(${url})`;
        };
        img.onerror = function () {
            // console.warn('加载图片出错:', url);
            el.style.backgroundColor = defaultOptions.defaultBgColor;
            el.style.backgroundImage = `url(${defaultOptions.defaultImage})`;
        };
    };
    Array.prototype.forEach.call(targetEls, function (el) {
        let imgRegs = window.getComputedStyle(el).backgroundImage.match(/url\(?(.*)\)/);
        if (imgRegs === null) {
            // console.warn('控制台信息', imgRegs);
            return;
        }
        let imgUrl = imgRegs[1].replace(/\"/g, '');
        if (/((null)|(undefined))$/.test(imgUrl)) {
            el.style.backgroundColor = defaultOptions.defaultBgColor;
            el.style.backgroundImage = `url(${defaultOptions.defaultImage})`;
            return;
        }
        loadImg(imgUrl, el);
    });
};
window.setDefaultImg = setDefaultImg;
export default setDefaultImg;
