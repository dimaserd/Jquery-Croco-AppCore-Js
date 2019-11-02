declare class Requester_Resx {
    YouPassedAnEmtpyArrayOfObjects: string;
    ErrorOccuredWeKnowAboutIt: string;
    FilesNotSelected: string;
}
declare class Requester implements ICrocoRequester {
    static Resources: Requester_Resx;
    static GoingRequests: string[];
    DeleteCompletedRequest(link: string): void;
    ParseDate(date: string): string;
    GetCombinedData(prefix: string, obj: Object): Object;
    GetParams(obj: Object): string;
    SendPostRequestWithAnimation(link: string, data: Object, onSuccessFunc: Function, onErrorFunc: Function): void;
    UploadFilesToServer(inputId: string, onSuccessFunc: Function, onErrorFunc: Function): void;
    IsRequestGoing(link: string): boolean;
    static OnSuccessAnimationHandler(data: IBaseApiResponse): void;
    static OnErrorAnimationHandler(): void;
    SendAjaxGet(link: string, data: Object, onSuccessFunc: Function, onErrorFunc: Function): void;
    SendAjaxPost(link: string, data: Object, onSuccessFunc: Function, onErrorFunc: Function, animations: boolean): void;
}
