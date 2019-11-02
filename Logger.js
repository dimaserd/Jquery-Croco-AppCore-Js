var Logger_Resx = /** @class */ (function () {
    function Logger_Resx() {
        this.LoggingAttempFailed = "Произошла ошибка в логгировании ошибки, срочно обратитесь к разработчикам приложения";
        this.ErrorOnApiRequest = "Ошибка запроса к апи";
        this.ActionLogged = "Action logged";
        this.ExceptionLogged = "Исключение залоггировано";
        this.ErrorOccuredOnLoggingException = "Произошла ошибка в логгировании ошибки, срочно обратитесь к разработчикам приложения";
    }
    return Logger_Resx;
}());
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.LogException = function (exceptionText, exceptionDescription, link) {
        $.ajax({
            type: "POST",
            data: {
                ExceptionDate: new Date().toISOString(),
                Description: exceptionDescription,
                Message: exceptionText,
                Uri: link !== null ? link : location.href
            },
            url: "/Api/Log/Exception",
            async: true,
            cache: false,
            success: function (data) {
                console.log(Logger.Resources.ExceptionLogged, data);
            },
            error: function () {
                alert(Logger.Resources.ErrorOccuredOnLoggingException);
            }
        });
    };
    Logger.prototype.LogAction = function (message, description, groupName) {
        var data = {
            LogDate: new Date().toISOString(),
            GroupName: groupName,
            Uri: window.location.href,
            Description: description,
            Message: message
        };
        console.log("Logger.LogAction", data);
        $.ajax({
            type: "POST",
            data: data,
            url: "/Api/Log/Action",
            async: true,
            cache: false,
            success: function (response) {
                console.log(Logger.Resources.ActionLogged, response);
            },
            error: function () {
                alert(Logger.Resources.LoggingAttempFailed);
            }
        });
    };
    Logger.Resources = new Logger_Resx();
    return Logger;
}());
