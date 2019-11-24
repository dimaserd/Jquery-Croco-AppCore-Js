import { CrocoAppCore, ICrocoRequester, IBaseApiResponse } from 'croco-appcore-js';

var $ = require('jquery');

export class Requester_Resx {
	YouPassedAnEmtpyArrayOfObjects: string = 'Вы подали пустой объект в запрос';
	ErrorOccuredWeKnowAboutIt: string =
		'Произошла ошибка! Мы уже знаем о ней, и скоро с ней разберемся!';
	FilesNotSelected: string = 'Файлы не выбраны';
}

export class Requester implements ICrocoRequester {
	static Resources: Requester_Resx = new Requester_Resx();

	static GoingRequests = new Array<string>();

	DeleteCompletedRequest(link: string): void {
		Requester.GoingRequests = Requester.GoingRequests.filter(
			x => x !== link
		);
	}

	ParseDate(date: string): string {
		date = date.replace(new RegExp('/', 'g'), '.');
		const from = date.split('.');

		const d = new Date(+from[2], +from[1] - 1, +from[0]);

		return d.toISOString();
	}

	GetCombinedData(prefix: string, obj: Object): Object {
		const resultObj = {};

		for (let prop in obj) {
			if (Array.isArray(obj[prop])) {
				resultObj[prefix + prop] = obj[prop];
			} else if (typeof obj[prop] == 'object') {
				const objWithProps = this.GetCombinedData(
					`${prefix}${prop}.`,
					obj[prop]
				);

				for (let innerProp in objWithProps) {
					resultObj[innerProp] = objWithProps[innerProp];
				}
			} else {
				resultObj[prefix + prop] = obj[prop];
			}
		}

		return resultObj;
	}

	GetParams(obj: Object): string {
		obj = this.GetCombinedData('', obj);

		return $.param(obj, true);
	}

	SendPostRequestWithAnimation(
		link: string,
		data: Object,
		onSuccessFunc: Function,
		onErrorFunc: Function
	): void {
		//Показываю крутилку
		CrocoAppCore.ModalWorker.ShowLoadingModal();

		this.SendAjaxPost(link, data, onSuccessFunc, onErrorFunc, true);
	}

	UploadFilesToServer(
		inputId: string,
		onSuccessFunc: Function,
		onErrorFunc: Function
	) {
		const link = '/Api/FilesDirectory/UploadFiles';

		if (this.IsRequestGoing(link)) {
			return;
		}

		const file_data = $(`#${inputId}`).prop('files');

		const form_data = new FormData();

		if (file_data.length === 0) {
			CrocoAppCore.ToastrWorker.ShowError(
				Requester.Resources.FilesNotSelected
			);
			if (onErrorFunc) {
				onErrorFunc();
			}
			return;
		}

		for (let i = 0; i < file_data.length; i++) {
			form_data.append('Files', file_data[i]);
		}

		$.ajax({
			url: link,
			type: 'POST',
			data: form_data,
			async: true,
			cache: false,
			dataType: 'json',
			contentType: false,
			processData: false,
			success: response => {
				CrocoAppCore.Requester.DeleteCompletedRequest(link);
				if (onSuccessFunc) {
					onSuccessFunc(response);
				}
			},
			error: (jqXHR, textStatus, errorThrown) => {
				//Логгирую ошибку
				CrocoAppCore.Logger.LogException(
					textStatus.toString(),
					'ErrorOnApiRequest',
					link
				);

				CrocoAppCore.Requester.DeleteCompletedRequest(link);
				CrocoAppCore.ModalWorker.HideModals();

				CrocoAppCore.ToastrWorker.ShowError(
					Requester.Resources.ErrorOccuredWeKnowAboutIt
				);

				//Вызываю внешнюю функцию-обработчик
				if (onErrorFunc) {
					onErrorFunc(jqXHR, textStatus, errorThrown);
				}
			}
		});
	}

	IsRequestGoing(link: string): boolean {
		const index = Requester.GoingRequests.indexOf(link);

		return index >= 0;
	}

	static OnSuccessAnimationHandler(data: IBaseApiResponse): void {
		CrocoAppCore.ModalWorker.HideModals();
		CrocoAppCore.ToastrWorker.HandleBaseApiResponse(data);
	}

	static OnErrorAnimationHandler(): void {
		CrocoAppCore.ModalWorker.HideModals();

		CrocoAppCore.ToastrWorker.ShowError(
			Requester.Resources.ErrorOccuredWeKnowAboutIt
		);
	}

	SendAjaxGet(
		link: string,
		data: Object,
		onSuccessFunc: Function,
		onErrorFunc: Function
	) {
		if (this.IsRequestGoing(link)) {
			return;
		}

		const params = {
			type: 'GET',
			data: data,
			url: link,
			async: true,
			cache: false,
			success: (response => {
				this.DeleteCompletedRequest(link);

				if (onSuccessFunc) {
					onSuccessFunc(response);
				}
			}).bind(this),

			error: (jqXHR, textStatus, errorThrown) => {
				//Логгирую ошибку
				CrocoAppCore.Logger.LogException(
					textStatus.toString(),
					'Error on Api Request',
					link
				);

				CrocoAppCore.Requester.DeleteCompletedRequest(link);

				//Вызываю внешнюю функцию-обработчик
				if (onErrorFunc) {
					onErrorFunc(jqXHR, textStatus, errorThrown);
				}
			}
		};

		$.ajax(params);
	}

	SendAjaxPost(
		link: string,
		data: Object,
		onSuccessFunc: Function,
		onErrorFunc: Function,
		animations: boolean
	) {
		if (this.IsRequestGoing(link)) {
			return;
		}

		if (data == null) {
			alert(Requester.Resources.YouPassedAnEmtpyArrayOfObjects);
			return;
		}

		let params: any = {};

		params.type = 'POST';
		params.data = data;
		params.url = link;
		params.async = true;
		params.cache = false;
		params.success = response => {
			CrocoAppCore.Requester.DeleteCompletedRequest(link);

			if (animations) {
				Requester.OnSuccessAnimationHandler(response);
			}

			if (onSuccessFunc) {
				onSuccessFunc(response);
			}
		};

		params.error = (jqXHR, textStatus, errorThrown) => {
			//Логгирую ошибку
			CrocoAppCore.Logger.LogException(
				textStatus.toString(),
				'Error on Api Request',
				link
			);

			CrocoAppCore.Requester.DeleteCompletedRequest(link);

			if (animations) {
				Requester.OnErrorAnimationHandler();
			}

			//Вызываю внешнюю функцию-обработчик
			if (onErrorFunc) {
				onErrorFunc(jqXHR, textStatus, errorThrown);
			}
		};

		const isArray = data.constructor === Array;

		if (isArray) {
			params.contentType = 'application/json; charset=utf-8';
			params.dataType = 'json';
			params.data = JSON.stringify(data);
		}

		Requester.GoingRequests.push(link);

		$.ajax(params);
	}
}
