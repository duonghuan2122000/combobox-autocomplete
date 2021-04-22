/**
 * Danh sách combobox.
 */
const list = [
    { value: 0, text: "Nữ" },
    { value: 1, text: "Nam" },
    { value: 2, text: "Khác" },
];

/**
 * Thẻ bao ngoài cùng combobox.
 */
const cbBox = $('.cb-autocomplete');

/**
 * Thẻ chứa danh sách của combobox.
 */
const dataListEle = cbBox.find('.datalist');

/**
 * Input của combobox.
 */
const combobox = cbBox.find('.cb');

/**
 * Phần tử hiện tại đang được hover trong combobox.
 */
let index = -1;

/**
 * Item đang được chọn.
 */
let selectedItem = null;

$(function () {

    // sự kiện nhập vào input của combobox.
    combobox.on('input', function (e) {
        e.preventDefault();
        let val = $(this).val();
        if (val === '') {
            cbBox.removeClass('error');
        }
        let datalist = list.filter((item) => item.text.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
        if (datalist.length == 0) {
            cbBox.addClass('error');
        }
        bindDataListToHtml(datalist);
        index = -1;
    });

    // sự kiện click vào một item trong danh sách của combobox.
    cbBox.on('mousedown', '.datalist li', function (e) {
        e.preventDefault();
        selectItemCombobox($(this));
    });

    // sự kiện click vào icon toggle của combobox.
    cbBox.find('.icon').on('click', function (e) {
        e.preventDefault();
        if (dataListEle.hasClass('hide')) {
            combobox.focus();
            bindDataListToHtml(list);
            index = -1;
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

            if (index < count - 1) {
                dataListEle.find('li').eq(index).removeClass('hover');
                dataListEle.find('li').eq(index + 1).addClass('hover');
                index++;
            }

        } else if (keyCode == 38) {
            // khi nhấn phím mũi tên lên.
            e.preventDefault();
            if (index > 0) {
                dataListEle.find('li').eq(index).removeClass('hover');
                dataListEle.find('li').eq(index - 1).addClass('hover');
                index--;
            }
        } else if (keyCode == 13) {
            // khi nhấn chọn enter.
            e.preventDefault();
            let _this = dataListEle.find('li.hover');
            selectItemCombobox(_this);
        }
    });

});

/**
 * Hàm bind data vào html cho danh sách combobox.
 * @param {Array} datalist danh sách hiện tại của combobox.
 */
function bindDataListToHtml(datalist) {
    dataListEle.html('');
    datalist.forEach((item) => {
        var dataItem = $(`
            <li>
                <span class="item-icon"></span>
                <span class="item-text">${item.text}</span>
            </li>
        `);
        if (selectedItem && selectedItem.value == item.value) {
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
    selectedItem = data;
    combobox.val(data.text);
    combobox.focus();
    dataListEle.addClass('hide');
}