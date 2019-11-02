var Requester_Resx = /** @class */ (function () {
    function Requester_Resx() {
        this.YouPassedAnEmtpyArrayOfObjects = "Вы подали пустой объект в запрос";
        this.ErrorOccuredWeKnowAboutIt = "Произошла ошибка! Мы уже знаем о ней, и скоро с ней разберемся!";
        this.FilesNotSelected = "Файлы не выбраны";
    }
    return Requester_Resx;
}());
var Requester = /** @class */ (function () {
    function Requester() {
    }
    Requester.prototype.DeleteCompletedRequest = function (link) {
        Requester.GoingRequests = Requester.GoingRequests.filter(function (x) { return x !== link; });
    };
    Requester.prototype.ParseDate = function (date) {
        date = date.replace(new RegExp("/", 'g'), ".");
        var from = date.split(".");
        var d = new Date(+from[2], +from[1] - 1, +from[0]);
        return d.toISOString();
    };
    Requester.prototype.GetCombinedData = function (prefix, obj) {
        var resultObj = {};
        for (var prop in obj) {
            if (Array.isArray(obj[prop])) {
                resultObj[prefix + prop] = obj[prop];
            }
            else if (typeof obj[prop] == "object") {
                var objWithProps = this.GetCombinedData("" + prefix + prop + ".", obj[prop]);
                for (var innerProp in objWithProps) {
                    resultObj[innerProp] = objWithProps[innerProp];
                }
            }
            else {
                resultObj[prefix + prop] = obj[prop];
            }
        }
        return resultObj;
    };
    Requester.prototype.GetParams = function (obj) {
        obj = this.GetCombinedData("", obj);
        return $.param(obj, true);
    };
    Requester.prototype.SendPostRequestWithAnimation = function (link, data, onSuccessFunc, onErrorFunc) {
        //Показываю крутилку
        CrocoAppCore.ModalWorker.ShowLoadingModal();
        this.SendAjaxPost(link, data, onSuccessFunc, onErrorFunc, true);
    };
    Requester.prototype.UploadFilesToServer = function (inputId, onSuccessFunc, onErrorFunc) {
        var link = "/Api/FilesDirectory/UploadFiles";
        if (this.IsRequestGoing(link)) {
            return;
        }
        var file_data = $("#" + inputId).prop("files");
        var form_data = new FormData();
        if (file_data.length === 0) {
            CrocoAppCore.ToastrWorker.ShowError(Requester.Resources.FilesNotSelected);
            if (onErrorFunc) {
                onErrorFunc();
            }
            return;
        }
        for (var i = 0; i < file_data.length; i++) {
            form_data.append("Files", file_data[i]);
        }
        $.ajax({
            url: link,
            type: "POST",
            data: form_data,
            async: true,
            cache: false,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (response) {
                CrocoAppCore.Requester.DeleteCompletedRequest(link);
                if (onSuccessFunc) {
                    onSuccessFunc(response);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                //Логгирую ошибку
                CrocoAppCore.Logger.LogException(textStatus.toString(), "ErrorOnApiRequest", link);
                CrocoAppCore.Requester.DeleteCompletedRequest(link);
                CrocoAppCore.ModalWorker.HideModals();
                CrocoAppCore.ToastrWorker.ShowError(Requester.Resources.ErrorOccuredWeKnowAboutIt);
                //Вызываю внешнюю функцию-обработчик
                if (onErrorFunc) {
                    onErrorFunc(jqXHR, textStatus, errorThrown);
                }
            }
        });
    };
    Requester.prototype.IsRequestGoing = function (link) {
        var index = Requester.GoingRequests.indexOf(link);
        return index >= 0;
    };
    Requester.OnSuccessAnimationHandler = function (data) {
        CrocoAppCore.ModalWorker.HideModals();
        CrocoAppCore.ToastrWorker.HandleBaseApiResponse(data);
    };
    Requester.OnErrorAnimationHandler = function () {
        CrocoAppCore.ModalWorker.HideModals();
        CrocoAppCore.ToastrWorker.ShowError(Requester.Resources.ErrorOccuredWeKnowAboutIt);
    };
    Requester.prototype.SendAjaxGet = function (link, data, onSuccessFunc, onErrorFunc) {
        var _this = this;
        if (this.IsRequestGoing(link)) {
            return;
        }
        var params = {
            type: "GET",
            data: data,
            url: link,
            async: true,
            cache: false,
            success: (function (response) {
                _this.DeleteCompletedRequest(link);
                if (onSuccessFunc) {
                    onSuccessFunc(response);
                }
            }).bind(this),
            error: function (jqXHR, textStatus, errorThrown) {
                //Логгирую ошибку
                CrocoAppCore.Logger.LogException(textStatus.toString(), "Error on Api Request", link);
                CrocoAppCore.Requester.DeleteCompletedRequest(link);
                //Вызываю внешнюю функцию-обработчик
                if (onErrorFunc) {
                    onErrorFunc(jqXHR, textStatus, errorThrown);
                }
            }
        };
        $.ajax(params);
    };
    Requester.prototype.SendAjaxPost = function (link, data, onSuccessFunc, onErrorFunc, animations) {
        if (this.IsRequestGoing(link)) {
            return;
        }
        if (data == null) {
            alert(Requester.Resources.YouPassedAnEmtpyArrayOfObjects);
            return;
        }
        var params = {};
        params.type = "POST";
        params.data = data;
        params.url = link;
        params.async = true;
        params.cache = false;
        params.success = function (response) {
            CrocoAppCore.Requester.DeleteCompletedRequest(link);
            if (animations) {
                Requester.OnSuccessAnimationHandler(response);
            }
            if (onSuccessFunc) {
                onSuccessFunc(response);
            }
        };
        params.error = function (jqXHR, textStatus, errorThrown) {
            //Логгирую ошибку
            CrocoAppCore.Logger.LogException(textStatus.toString(), "Error on Api Request", link);
            CrocoAppCore.Requester.DeleteCompletedRequest(link);
            if (animations) {
                Requester.OnErrorAnimationHandler();
            }
            //Вызываю внешнюю функцию-обработчик
            if (onErrorFunc) {
                onErrorFunc(jqXHR, textStatus, errorThrown);
            }
        };
        var isArray = data.constructor === Array;
        if (isArray) {
            params.contentType = "application/json; charset=utf-8";
            params.dataType = "json";
            params.data = JSON.stringify(data);
        }
        Requester.GoingRequests.push(link);
        $.ajax(params);
    };
    Requester.Resources = new Requester_Resx();
    Requester.GoingRequests = new Array();
    return Requester;
}());
