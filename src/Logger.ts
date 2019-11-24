import { ICrocoLogger } from 'croco-appcore-js';

var $ = require('jquery');

export class Logger_Resx {
	LoggingAttempFailed: string =
		'Произошла ошибка в логгировании ошибки, срочно обратитесь к разработчикам приложения';

	ErrorOnApiRequest: string = 'Ошибка запроса к апи';

	ActionLogged: string = 'Action logged';

	ExceptionLogged: string = 'Исключение залоггировано';

	ErrorOccuredOnLoggingException: string =
		'Произошла ошибка в логгировании ошибки, срочно обратитесь к разработчикам приложения';
}

export class Logger implements ICrocoLogger {
	static Resources: Logger_Resx = new Logger_Resx();

	public LogException(
		exceptionText: string,
		exceptionDescription: string,
		link: string
	): void {
		$.ajax({
			type: 'POST',
			data: {
				ExceptionDate: new Date().toISOString(),
				Description: exceptionDescription,
				Message: exceptionText,
				Uri: link !== null ? link : location.href
			},
			url: '/Api/Log/Exception',
			async: true,
			cache: false,
			success: function(data) {
				console.log(Logger.Resources.ExceptionLogged, data);
			},

			error: function() {
				alert(Logger.Resources.ErrorOccuredOnLoggingException);
			}
		});
	}

	public LogAction(
		message: string,
		description: string,
		groupName: string
	): void {
		const data = {
			LogDate: new Date().toISOString(),
			GroupName: groupName,
			Uri: window.location.href,
			Description: description,
			Message: message
		};

		console.log('Logger.LogAction', data);

		$.ajax({
			type: 'POST',
			data: data,
			url: '/Api/Log/Action',
			async: true,
			cache: false,
			success: response => {
				console.log(Logger.Resources.ActionLogged, response);
			},

			error: () => {
				alert(Logger.Resources.LoggingAttempFailed);
			}
		});
	}
}
