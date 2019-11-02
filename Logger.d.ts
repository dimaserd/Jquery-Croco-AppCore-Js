declare class Logger_Resx {
    LoggingAttempFailed: string;
    ErrorOnApiRequest: string;
    ActionLogged: string;
    ExceptionLogged: string;
    ErrorOccuredOnLoggingException: string;
}
declare class Logger implements ICrocoLogger {
    static Resources: Logger_Resx;
    LogException(exceptionText: string, exceptionDescription: string, link: string): void;
    LogAction(message: string, description: string, groupName: string): void;
}
