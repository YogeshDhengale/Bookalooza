import axios from "axios";
import Utils from "../../Utils";
import { createContext, useContext, useEffect, useState } from "react";
import Consts from "../../Consts";
import { getFullTheme } from '../Books/NewBook/ThemeActions';
import { placeBackground } from "./objectUtils";
import { store } from "../../../store";

const fabric = window.fabric;

function fetchData(url) {
    return axios({
        url
    }).then(res => res.data);
}

async function placePageTo(formData) {
    if (this.isDirty()) {
        let pageName = this.getName(),
            design = JSON.stringify(this.design),
            svg = this.getSvg(),
            imageBoxes = this.imageBoxes;
        if (imageBoxes) {
            for (let box of imageBoxes) {
                let oldUrl = box.getSrc();
                let url = await box.saveImage(blob => {
                    let photoName = "photo." + blob.type.split("/")[1];
                    formData.append("files", blob, photoName);
                    return `[~basePath~]/${photoName}?${Date.now()}`;
                });
                if (url !== oldUrl) {
                    design = design.replaceAll(oldUrl, url);
                    svg = svg.replaceAll(oldUrl, `[~origin~]${url}`);
                }
            }
        }

        formData.append("files", new Blob([design]), pageName + ".json");
        formData.append("files", new Blob([svg]), pageName + ".svg");
        if (this.isFrontPage() || this.isBackPage()) {
            let thumb = await this.getThumbnail();
            if (thumb) {
                let extension = thumb.match(/data:image\/(.*);/)[1],
                    name = `${pageName}.${extension}`;
                formData.append("files", Utils.dataURItoBlob(thumb), name);
                this.data.thumb = name;
            }
        }
    }
}

function getUid() {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 8) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

async function getBookDescriptor() {
    if (!this.descriptor) {
        this.descriptor = (await fetchData(this.path));
    }
    return this.descriptor;
}

async function getThumbCanvas(page) {
    const el = document.createElement('canvas'),
        vp = page.data.viewport,
        mulFactor = 2;
    el.setAttribute('width', vp.productWidth * mulFactor);
    el.setAttribute('height', vp.productHeight * mulFactor);
    const canvas = new fabric.LayeredCanvas(el);
    canvas.setViewportTransform([mulFactor, 0, 0, mulFactor, 0, 0]);

    await new Promise(async function (accept) {
        canvas.loadFromJSON(
            await page.getDesign(),
            accept
        );
    });

    return canvas;
}

async function generateResources(page) {
    const canvas = await getThumbCanvas(page),
        vp = page.data.viewport;
    page.thumbURL = canvas.toDataURL({
        format: 'jpg'
    });
    page.svg = canvas.toSVG({
        width: vp.productWidth + 'mm',
        height: vp.productHeight + 'mm'
    });
}

function getTemplateLoader(src, cb = JSON.parse) {
    let template = null;
    return async function () {
        if (!template) {
            template = JSON.stringify(await fetchData(src));
        }
        if (cb) {
            return await cb(template);
        }
        return template;
    }
}

function BookContext(book) {
    this.path = book?.designPath || `${Consts.BASE_URL}/template/defaultBook.json?${Consts.APP_VERSION}`;
    this.book = book || {};
    Object.assign(this, fabric.Observable);
}

async function fixInnerFrontTemplateJSON(template) {
    const content = `Content Copyright © ${Utils.getUserFullName()}`;
    template = JSON.parse(template.replaceAll('[~AuthorName~]', content));
    await putBackgroundOnPage(template, "/template/images/innerFront.png");
    return template;
}
async function fixInnerBackTemplateJSON(template) {
    template = JSON.parse(template.replaceAll('[~AuthorName~]', Utils.getUserFullName()));
    await putBackgroundOnPage(template, "/template/images/innerBack.png");
    return template;
}

async function fixBackPageJSON(template) {
    let json = JSON.parse(template.replaceAll('[~AuthorName~]', Utils.getUserFullName()));
    await putBackgroundOnPage(json, "/template/images/full2.png");
    let src = Utils.getCurrentUser()?.photoURL;
    if (src) {
        window.Ext.canvasController.objectIterator(json, function (o) {
            if (o.id === 'authorPhoto') {
                let imgBox = o.objects[0];
                imgBox.src = src;
                return true;
            }
        });
    }
    return json;
}

export const getAuthorImageTemplate = getTemplateLoader(`${Consts.BASE_URL}/template/defaultBackWithAuthorImage.json?${Consts.App_VERSION}`)
const getPageTemplate = getTemplateLoader(`${Consts.BASE_URL}/template/defaultPage.json?${Consts.APP_VERSION}`);
const getFrontpageTemplate = getTemplateLoader(`${Consts.BASE_URL}/template/defaultFront.json?${Consts.APP_VERSION}`);
const getBackpageTemplate = getTemplateLoader(`${Consts.BASE_URL}/template/defaultBack.json?${Consts.APP_VERSION}`, fixBackPageJSON);
const getFrontpageInnerTemplate = getTemplateLoader(`${Consts.BASE_URL}/template/defaultInnerFront.json?${Consts.APP_VERSION}`, fixInnerFrontTemplateJSON);
const getBackpageInnerTemplate = getTemplateLoader(`${Consts.BASE_URL}/template/defaultInnerBack.json?${Consts.APP_VERSION}`, fixInnerBackTemplateJSON);

const getBlankSvg = getTemplateLoader(`${Consts.BASE_URL}/template/defaultBlank.svg?${Consts.APP_VERSION}`);

async function getSpecialPage(pageKey, { getTemplate, subpages }) {
    if (!this[pageKey]) {
        let descriptor = await getBookDescriptor.call(this);
        if (descriptor[pageKey]) {
            this[pageKey] = new PageContext(descriptor[pageKey], this);
        } else {
            let template = await getTemplate();
            this[pageKey] = new PageContext({
                name: this.getUniqueName(),
                viewport: template.viewport,
                subpages
            }, this);
            delete template.viewport;

            this[pageKey].design = template;
            this[pageKey].dirty = true;
            await generateResources(this[pageKey]);
        }
        this[pageKey].type = pageKey;
    }
    return this[pageKey];
}

function Deferred() {
    this.promise = new Promise((a, r) => {
        this.accept = a;
        this.reject = r;
    })
}

BookContext.prototype = {
    themeImages: [],
    frontThemeImages: [],
    initialize: async function () {
        await this.getPages();
        this.fire('book:loaded');
        return this;
    },

    getTheme: function () {
        return this.book.theme;
    },

    setThemeCategory: async function (category) {
        if (!category) {
            return
        }
        this.setTheme(category.name);
        let themeImagesDef = new Deferred(),
            frontThemeImagesDef = new Deferred();

        this.themeImages = themeImagesDef.promise;
        this.frontThemeImages = frontThemeImagesDef.promise;

        let items = (await getFullTheme(category))?.items || [];
        themeImagesDef.accept(items.filter(i => !i.isFrontCover).map(i => i.thumbPath));
        frontThemeImagesDef.accept(items.filter(i => i.isFrontCover).map(i => i.thumbPath));
    },

    setTheme: function (theme) {
        this.book.theme = theme;
    },

    getId: function () {
        return this.book.id;
    },

    getUpdateDate: function () {
        return this.book.updateDate;
    },

    _updateMetadata: function (data) {
        this.book = data;
    },

    getPages: async function () {
        if (!this.pages) {
            let descriptor = await getBookDescriptor.call(this);
            this.pages = descriptor?.pages?.map(p => new PageContext(p, this)) || [];
            delete descriptor.pages;
        }
        return this.pages;
    },

    getAllPages: function () {
        return this.getPages();
    },

    setPages: function (pages) {
        return this.pages = pages;
    },

    removePage: async function (page) {
        let pages = await this.getPages(),
            idx = pages.findIndex(p => p.getName() === page.getName?.());
        if (idx > -1) {
            pages.splice(idx, 1);
        }
        this.fire('page:removed', { target: page });
    },

    addPage: async function (num) {
        let themeImages = await this.themeImages;

        let template = await getPageTemplate();
        if (themeImages.length) {
            let thumbPath = themeImages[Math.floor(Math.random() * themeImages.length)];
            await putBackgroundOnPage(template, thumbPath);
        }

        let page = new PageContext({
            name: this.getUniqueName(),
            viewport: template.viewport
        }, this);
        delete template.viewport;
        page.design = template;
        page.dirty = true;

        let pages = await this.getPages();
        num = num || (pages.length + 1);
        pages.push(page);

        await page.setPageNumbers(num * 2);

        this.fire('page:added', { target: page });
        return page;
    },

    getBookFormData: async function () {
        let pages = await this.getPages(),
            descriptor = await getBookDescriptor.call(this);
        const formData = new FormData();
        formData.append("bookData", JSON.stringify(this.book));

        async function putPage(page, cb) {
            const p = await page;
            await placePageTo.call(p, formData);
            return cb(p);
        }

        const pData = await Promise.all([
            putPage(this.getFrontPage(), p => descriptor.frontPage = p.getPageData()),
            putPage(this.getFrontInnerPage(), p => descriptor.frontInnerPage = p.getPageData()),
            ...pages.map(page => putPage(page, p => p.getPageData())),
            putPage(this.getBackInnerPage(), p => descriptor.backInnerPage = p.getPageData()),
            putPage(this.getBackPage(), p => descriptor.backPage = p.getPageData())
        ]);

        descriptor.pages = pData.slice(2, -2);

        formData.append("files", new Blob([JSON.stringify(descriptor)]), "design.json");
        formData.append("files", new Blob([await getBlankSvg()]), "blank.svg");

        return formData;
    },

    getUniqueName: function () {
        if (!this.pageNameSet) {
            this.pageNameSet = new Set(this.pages.map(p => p.name));
        }
        let name = getUid();
        let set = this.pageNameSet;
        while (set.has(name)) {
            name = getUid();
        }
        this.pageNameSet.add(name);
        return name;
    },

    getFrontPage: function () {
        return getSpecialPage.call(this, 'frontPage', {
            getTemplate: async () => {
                let themeImages = await this.frontThemeImages;
                let template = await getFrontpageTemplate(),
                    authorName = Utils.getUserFullName() || "";

                if (themeImages.length) {
                    let thumbPath = themeImages[Math.floor(Math.random() * themeImages.length)];
                    await putBackgroundOnPage(template, thumbPath);
                }
                template = JSON.stringify(template);
                this.descriptor.author = authorName;
                return JSON.parse(template.replaceAll('[~AuthorName~]', authorName))
            },
            subpages: ["single"]
        });
    },

    getBackPage: function () {
        return getSpecialPage.call(this, 'backPage', {
            getTemplate: async () => {
                const state = store.getState();
                const userData = state.user.user || {};
                let template = await getBackpageTemplate(),
                    schoolName = userData.instituteName || "";

                template = JSON.stringify(template);
                this.descriptor.schoolName = schoolName;
                return JSON.parse(template.replaceAll("[~SchoolName~]", schoolName))
            },
            subpages: ["single"]
        });
    },

    getFrontInnerPage: function () {
        return getSpecialPage.call(this, 'frontInnerPage', {
            getTemplate: getFrontpageInnerTemplate,
            subpages: ["single"]
        });
    },

    getBackInnerPage: function () {
        return getSpecialPage.call(this, 'backInnerPage', {
            getTemplate: getBackpageInnerTemplate,
            subpages: ["single"]
        });
    },
    dirty: false,
    isDirty: function () {
        return this.dirty;
    },
    setDirty: function (dirty) {
        if (!dirty) {
            [
                this.frontPage,
                this.frontInnerPage,
                ...this.pages,
                this.backInnerPage,
                this.backPage
            ].filter(p => p).forEach(p => {
                p.dirty = false;
            });
        }
        this.dirty = dirty;
    },

    getDesignPath: function () {
        return this.path;
    },
    muteUndoRedo: function () {
        this.muteURStack = true;
    },
    unmuteUndoRedo: function () {
        this.muteURStack = false;
    },
    canUndoRedo: function () {
        return !this.muteURStack;
    },
    setTitle: async function (text) {
        setBookFields.call(this, "title", text, async e => [
            await this.getFrontPage(),
            await this.getFrontInnerPage()
        ]);
    },
    getTitle: function () {
        return this.descriptor.title;
    },
    getAuthor: function () {
        return this.descriptor.author;
    },
    setAuthor: function (text) {
        return setBookFields.call(this, "author", text, async e => [
            await this.getFrontPage(),
            await this.getBackPage(),
            await this.getFrontInnerPage()
        ], (text, page) => {
            if (page.isPreface()) {
                return `Content Copyright © ${text}`
            }
            return text;
        });
    },
    getAboutAuthor: function () {
        return this.descriptor.aboutAuthor;
    },
    setAboutAuthor: function (text) {
        return setBookFields.call(this, "aboutAuthor", text);
    }
}

async function setBookFields(key, text, cb, getValue) {
    this.descriptor[key] = text;
    this.book[key] = text;
    let titledPages = await cb?.() || [];
    let objectIterator = window.Ext.canvasController.objectIterator;
    await Promise.all(titledPages.map(async page => {
        let design = await page.getDesign(),
            value = getValue?.(text, page) || text;
        objectIterator(design, function (o) {
            if (o.id === key) {
                o.text = value;
                return true;
            }
        });
        let canvas = page.canvas;
        if (page.isMounted && canvas) {
            objectIterator(canvas, function (o) {
                if (o.id === key) {
                    o.text = value;
                    return true;
                }
            }, "_objects");
            canvas.renderAll();
        }
        page.design = design;
        await generateResources(page);
    }));
}

function normalizeURL(url) {
    let parts = url.split('/'),
        target = [];
    parts.forEach(e => {
        if (e == '..') {
            target.pop();
        } else if (e == '.') {
            //do nothing
        } else {
            target.push(e);
        }
    });
    return target.join('/');
}

async function putBackgroundOnPage(template, thumbPath) {
    let viewport = template.viewport,
        canvas = await getThumbCanvas({
            data: { viewport },
            getDesign: e => template
        });
    await placeBackground(canvas, { thumbPath }, () => {
        return {
            left: viewport.leftMargin,
            top: viewport.topMargin,
            width: viewport.productWidth,
            height: viewport.productHeight,
        }
    });
    Object.assign(template, canvas.toObject());
}

function PageContext(page, book) {
    this.data = page || {};
    this.parent = book;
    const { subpages, type } = this.data;
    if (subpages) {
        this.subpages = subpages;
    }
    if (type) {
        this.type = type;
    }
}

PageContext.prototype = {
    type: "regularPage",
    subpages: ["left", "right"],
    _getPath: function (relativePath) {
        return normalizeURL(this.parent.path + "/../" + relativePath);
    },
    getDesign: async function () {
        if (!this.design) {
            this.design = (await fetchData(this._getPath(this.data?.design)));
        }
        return this.design;
    },
    getName: function () {
        if (!this.data.name) {
            this.data.name = this.parent.getUniqueName();
        }
        return this.data.name;
    },
    getPageData: function () {
        let data = this.data,
            name = this.getName();
        return {
            thumb: name + '.png',
            design: name + ".json",
            ...data
        };
    },
    getSvg: function () {
        return this.svg;
    },
    getThumbnail: async function () {
        return (await getThumbCanvas(this)).toDataURL({
            format: 'jpg'
        });
    },
    getThumbUrl: function () {
        return this.thumbURL;
    },
    getSvgName: function () {
        return `${this.getName()}.svg`;
    },
    updateThumb: function (canvas) {
        let canvasController = window.Ext.canvasController;
        if (canvasController.productSizeData) {
            this.thumbURL = canvasController.getThumbnail();
        }
    },
    updatePage: function (canvas) {
        this.design = canvas.toObject();
        canvas.closeSVGEditing();
        this.svg = window.Ext.canvasController.getSVG({});
        this.updateThumb();
    },
    dirty: false,
    isDirty: function () {
        return this.dirty;
    },
    setDirty: function (dirty) {
        this.dirty = dirty;
    },
    setPageNumbers: async function (num) {
        this.dirty = true;
        let design = await this.getDesign();
        let objectIterator = window.Ext.canvasController.objectIterator;
        objectIterator(design, function (o) {
            switch (o.id) {
                case 'page1':
                    o.text = num + '';
                    break;
                case 'page2':
                    o.text = (num + 1) + '';
            }
        });
        this.design = design;
        await generateResources(this);
        return num + 2;
    },
    getSize: function () {
        return this.data.viewport;
    },
    getBook: function () {
        return this.parent;
    },
    isMovable: function () {
        return this.isRegularPage();
    },
    getSubpageNames: function () {
        return this.subpages;
    },
    isRegularPage: function () {
        return this.type === 'regularPage';
    },
    isFrontPage: function () {
        return this.type === 'frontPage';
    },
    isBackPage: function () {
        return this.type === 'backPage';
    },
    isPreface: function () {
        return this.type === 'frontInnerPage'
    },
    isLastPage: function () {
        return this.type === 'backInnerPage'
    },
    getType: function () {
        return this.type;
    }
}

const bookContext = createContext();
export const BookProvider = bookContext.Provider;

export function useBookContext() {
    return useContext(bookContext);
}

export function useBookContextHandler(dataOrCallback, dependencies = []) {
    const bookCtx = useBookContext();
    const [handler] = useState({});

    useEffect(() => {
        const data = typeof dataOrCallback === 'function' ? dataOrCallback(bookCtx) : dataOrCallback;
        if (bookCtx && data) {
            bookCtx.off(handler);
            Object.keys(handler).forEach(k => delete handler[k]);
            Object.assign(handler, data);
            bookCtx.on(handler);
        }
        return () => {
            if (bookCtx && handler) {
                bookCtx.off(handler);
            }
        };
    }, [bookCtx, handler, ...dependencies]);

    return [bookCtx, handler];
}

export default function createBookContext(book) {
    return new BookContext(book);
}

const pageContext = createContext();
export const PageProvider = pageContext.Provider;

export function usePageContext() {
    return useContext(pageContext);
}
