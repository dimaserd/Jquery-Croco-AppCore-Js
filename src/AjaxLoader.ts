import { IAJaxLoader } from 'croco-appcore-js';

var $ = require('jquery');

export class AjaxLoader implements IAJaxLoader {
	InitAjaxLoads() {
		const elems = document.getElementsByClassName('ajax-load-html');
		for (let i = 0; i < elems.length; i++) {
			this.LoadInnerHtmlToElement(elems[i], null);
		}
	}

	LoadInnerHtmlToElement(element: Element, onSuccessFunc: Function): void {
		var link = $(element).data('ajax-link');
		var method = $(element).data('ajax-method');
		const data = $(element).data('request-data');
		var onSuccessScript = $(element).data('on-finish-script');

		if (method == null) {
			method = 'GET';
		}

		$.ajax({
			type: method,
			url: link,
			cache: false,
			data: data,
			success: function(response) {
				$(element).html(response);
				$(element).removeClass('ajax-load-html');
				if (onSuccessScript) {
					eval(onSuccessScript);
				}
				if (onSuccessFunc) {
					onSuccessFunc();
				}
			},
			error: function(xhr, ajaxOptions, thrownError) {
				alert(`There is an execption while executing request ${link}`);
				console.log(xhr);
			}
		});
	}
}
