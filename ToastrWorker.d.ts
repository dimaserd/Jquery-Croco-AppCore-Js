declare var toastr: any;
declare class ToastrWorker implements IToastrWorker {
    ShowError(text: string): void;
    ShowSuccess(text: string): void;
    HandleBaseApiResponse(data: IBaseApiResponse): void;
}
