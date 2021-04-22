const list = [
    { value: 0, text: "Nữ" },
    { value: 1, text: "Nam" },
    { value: 2, text: "Khác" },
];
const dataListEle = $('.cb-autocomplete .datalist');
const combobox = $('.cb-autocomplete .cb');

let index = -1;

$(function () {

    combobox.on({
        // sự kiện nhập vào input.
        input: function (e) {
            e.preventDefault();
            let val = $(this).val();
            let datalist = list.filter((item) => item.text.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
            bindDataListToHtml(datalist, val);
            index = -1;
        },
    });

    $('.cb-autocomplete').on('blur', function () {
        dataListEle.addClass('hide');
    });

    $('.cb-autocomplete').on('click', '.datalist li', function (e) {
        e.preventDefault();
        $(this).addClass('selected');
        $(this).siblings('.selected').removeClass('selected');
        let data = $(this).data();
        combobox.val(data.text);
        combobox.focus();
        dataListEle.addClass('hide');
    });

    $('.cb-autocomplete .icon').on('click', function () {
        if (dataListEle.hasClass('hide')) {
            combobox.focus();
            if (dataListEle.html() == '') {
                bindDataListToHtml(list);
            }
            dataListEle.removeClass('hide');
            index = -1;
        } else {
            dataListEle.addClass('hide');
        }
    });

    $(".cb-autocomplete").on('keydown', function (e) {
        let keyCode = e.keyCode;
        let count = dataListEle.find('li').length;
        if (keyCode == 40) {
            e.preventDefault();

            if (index < count - 1) {
                dataListEle.find('li').eq(index).removeClass('hover');
                dataListEle.find('li').eq(index + 1).addClass('hover');
                index++;
            }

        } else if (keyCode == 38) {
            e.preventDefault();
            if (index > 0) {
                dataListEle.find('li').eq(index).removeClass('hover');
                dataListEle.find('li').eq(index - 1).addClass('hover');
                index--;
            }
        } else if (keyCode == 13) {
            e.preventDefault();
            let _this = dataListEle.find('li.hover');
            _this.addClass('selected');
            _this.siblings('.selected').removeClass('selected');
            let data = _this.data();
            combobox.val(data.text);
            combobox.focus();
            dataListEle.addClass('hide');
        }
    });

});

function bindDataListToHtml(datalist, val) {
    dataListEle.html('');
    datalist.forEach((item) => {
        var dataItem = $(`
            <li>
                <span class="item-icon"></span>
                <span class="item-text">${item.text}</span>
            </li>
        `);
        if (item.text === val) {
            dataItem.addClass('selected');
        }
        dataItem.data(item);
        dataItem.appendTo(dataListEle);
    });
    dataListEle.removeClass('hide');
}

function clearDataList() {
    dataListEle.html('');
    dataListEle.addClass('hide');
}