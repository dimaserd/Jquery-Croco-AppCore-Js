import { IToastrWorker, IBaseApiResponse } from 'croco-appcore-js';

declare var toastr: any;

export class ToastrWorker implements IToastrWorker {
	public ShowError(text: string): void {
		const data = {
			IsSucceeded: false,
			Message: text
		};

		this.HandleBaseApiResponse(data);
	}

	public ShowSuccess(text: string): void {
		const data = {
			IsSucceeded: true,
			Message: text
		};

		this.HandleBaseApiResponse(data);
	}

	public HandleBaseApiResponse(data: IBaseApiResponse): void {
		if (data.IsSucceeded === undefined) {
			alert('Произошла ошибка. Объект не является типом BaseApiResponse');
			return;
		}

		if (data.Message === undefined) {
			alert('Произошла ошибка. Объект не является типом BaseApiResponse');
			return;
		}

		toastr.options = {
			closeButton: false,
			debug: false,
			newestOnTop: false,
			progressBar: false,
			positionClass: 'toast-top-right',
			preventDuplicates: false,
			onclick: null,
			showDuration: '300',
			hideDuration: '1000',
			timeOut: '5000',
			extendedTimeOut: '1000',
			showEasing: 'swing',
			hideEasing: 'linear',
			showMethod: 'fadeIn',
			hideMethod: 'fadeOut'
		};

		if (data.IsSucceeded) {
			toastr.success(data.Message);
		} else {
			toastr.error(data.Message);
		}
	}
}
