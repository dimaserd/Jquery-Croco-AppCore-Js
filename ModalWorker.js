var ModalWorker = /** @class */ (function () {
    function ModalWorker() {
    }
    /** Показать модальное окно по идентификатору. */
    ModalWorker.prototype.ShowModal = function (modalId) {
        if (modalId === "" || modalId == null || modalId == undefined) {
            modalId = ModalWorker.LoadingModal;
        }
        $("#" + modalId).modal('show');
    };
    ModalWorker.prototype.ShowLoadingModal = function () {
        this.ShowModal(ModalWorker.LoadingModal);
    };
    ModalWorker.prototype.HideModals = function () {
        $('.modal').modal('hide');
        $(".modal-backdrop.fade").remove();
        $('.modal').on('shown.bs.modal', function () {
        });
    };
    ModalWorker.prototype.HideModal = function (modalId) {
        $("#" + modalId).modal('hide');
    };
    /**
     * идентификатор модального окна с загрузочной анимацией
     */
    ModalWorker.LoadingModal = "loadingModal";
    return ModalWorker;
}());
