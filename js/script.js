/**
 * Plugin tạo combobox.
 * CreatedBy: dbhuan (26/04/2021)
 */
(function ($) {
    $.fn.initCbbox = function (options) {
        /**
         * Khởi tạo tham số cấu hình mặc định cho combobox.
         */
        let _defaultOptions = {
            index: -1,
            list: [],
            selectedItem: null
        };

        // merge tham số truyền vào và tham số mặc định.
        let _options = $.extend(_defaultOptions, options);

        let container = $(this);

        let dataListEle = $(`<ul class="datalist hide"></ul>`);


        let cbDiv = $(`
        <div class="field">
            <input type="text" class="cb">
            <span class="icon">
            </span>
        </div>
        `);

        let combobox = cbDiv.find('.cb');

        let cbBox = $(`<div class="cb-autocomplete"></div>`);

        cbDiv.appendTo(cbBox);
        dataListEle.appendTo(cbBox);

        container.replaceWith(cbBox);

        // sự kiện nhập vào input của combobox.
        combobox.on('input', function (e) {
            e.preventDefault();
            let val = $(this).val().trim();
            if (val === '') {
                cbBox.removeClass('error');
                cbBox.find('.cb').removeAttr('title');
            }
            let datalist = _options.list.filter((item) => item.text.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
            if (datalist.length == 0) {
                cbBox.addClass('error');
                cbBox.find('.cb').attr('title', "Dữ liệu không tồn tại trong hệ thống.");
            } else {
                cbBox.removeClass('error');
                cbBox.find('.cb').removeAttr('title');
            }
            bindDataListToHtml(datalist, true);
            _options.index = -1;
        });

        // sự kiện click vào một item trong danh sách của combobox.
        cbBox.on('mousedown', '.datalist li', function (e) {
            e.preventDefault();
            selectItemCombobox($(this));
        });

        // sự kiện click vào icon toggle của combobox.
        cbBox.find('.icon').on('mousedown', function (e) {
            e.preventDefault();
            if (dataListEle.hasClass('hide')) {
                combobox.focus();
                bindDataListToHtml(_options.list, false);
                _options.index = -1;
            } else {
                dataListEle.addClass('hide');
            }
        });

        // sự kiện lose focus trong input combobox.
        cbBox.on('focusout', function (e) {
            e.preventDefault();
            dataListEle.addClass('hide');
        })

        // sự kiện nhấn phím trong combobox.
        cbBox.on('keydown', function (e) {
            let keyCode = e.keyCode;
            let count = dataListEle.find('li').length;

            if (keyCode == 40) {
                // khi nhấn phím mũi tên xuống.
                e.preventDefault();

                if (_options.index < count - 1) {
                    dataListEle.find('li').eq(_options.index).removeClass('hover');
                    dataListEle.find('li').eq(_options.index + 1).addClass('hover');
                    _options.index++;
                }

            } else if (keyCode == 38) {
                // khi nhấn phím mũi tên lên.
                e.preventDefault();
                if (index > 0) {
                    dataListEle.find('li').eq(_options.index).removeClass('hover');
                    dataListEle.find('li').eq(_options.index - 1).addClass('hover');
                    _options.index--;
                }
            } else if (keyCode == 13) {
                // khi nhấn chọn enter.
                e.preventDefault();
                let _this = dataListEle.find('li.hover');
                selectItemCombobox(_this);
            }
        });

        /**
         * Hàm bind data vào html cho danh sách combobox.
         * @param {Array} datalist danh sách hiện tại của combobox.
         * @param {Boolean} isInput Xác định đang nhập dữ liệu hay đang click vào icon toggle.
         */
        function bindDataListToHtml(datalist, isInput) {
            if (isInput) {
                _options.selectedItem = null;
            }
            dataListEle.html('');
            datalist.forEach((item) => {
                var dataItem = $(`
                    <li>
                        <span class="item-icon"></span>
                        <span class="item-text">${item.text}</span>
                    </li>
                `);
                if (_options.selectedItem && _options.selectedItem.value == item.value) {
                    dataItem.addClass('selected');
                }
                dataItem.data(item);
                dataItem.appendTo(dataListEle);
            });
            dataListEle.removeClass('hide');
        }

        /**
         * Hàm chọn một item trong danh sách của combobox.
         * @param {Element} eleSelected Item được chọn trong danh sách của combobox.
         */
        function selectItemCombobox(eleSelected) {
            let data = eleSelected.data();
            _options.selectedItem = data;
            combobox.val(data.text);
            combobox.focus();
            dataListEle.addClass('hide');
        }

        cbBox.getValue = function () {
            return _options.selectedItem && _options.selectedItem.value ? _options.selectedItem.value : null;
        }

        cbBox.getText = function () {
            return _options.selectedItem && _options.selectedItem.text ? _options.selectedItem.text : null;
        }

        cbBox.getData = function () {
            return _options.list;
        }

        return cbBox;
    }
}(jQuery));

const list = [
    { value: 0, text: "Nữ" },
    { value: 1, text: "Nam" },
    { value: 2, text: "Khác" },
];

var cb = $('.cbbox').initCbbox({ list });