declare class AjaxLoader implements IAJaxLoader {
    InitAjaxLoads(): void;
    LoadInnerHtmlToElement(element: Element, onSuccessFunc: Function): void;
}
