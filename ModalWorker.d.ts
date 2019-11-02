declare class ModalWorker implements IModalWorker {
    /**
     * идентификатор модального окна с загрузочной анимацией
     */
    static LoadingModal: string;
    /** Показать модальное окно по идентификатору. */
    ShowModal(modalId: string): void;
    ShowLoadingModal(): void;
    HideModals(): void;
    HideModal(modalId: string): void;
}
