var columnDefs = [
    {headerName: "Id", field: "id", filter: true, sortable: true},
    {headerName: "Code", field: "code", filter: true, sortable: true},
    {headerName: "Name", field: "name", filter: true, sortable: true}
];

// let the grid know which columns and what data to use
var gridOptions = {
    columnDefs: columnDefs,
    rowSelection: 'single',
    onSelectionChanged: onSelectionChanged
};

function onSelectionChanged() {
    var selectedRows = gridOptions.api.getSelectedRows();

    if(selectedRows.length === 1) {
       $('#selectedCountry').text(selectedRows[0].name);
       $('#btnEdit').prop("disabled", false);
       $('#btnDelete').prop("disabled", false);
    }
}

function showHideLoader(visible) {
    if(visible) {
        $('#loader').css('display', 'block');
    } else {
        $('#loader').css('display', 'none');
    }
}

function loadGridData() {

    showHideLoader(true);

    agGrid.simpleHttpRequest({url: 'http://localhost:8080/api/countries'}).then(function(data) {
        gridOptions.api.setRowData(data);
        showHideLoader(false);
        resetGridSelection();
    });
}

function resetGridSelection() {
    $('#selectedCountry').text('');
    $('#btnEdit').prop("disabled", true);
    $('#btnDelete').prop("disabled", true);
}

function addUpdateCountry() {
   let id = $('#txtId').val();
   let method = 'POST';
   let url = 'http://localhost:8080/api/countries';
   if(id !== '0') {
       method = 'PUT';
       url += '/' + id;
   }

    let data = {
        id : id,
        code : $('#txtCode').val(),
        name : $('#txtName').val()
    }

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": method,
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(data)
    }

    showHideLoader(true);

    $.ajax(settings).done(function (response) {
        console.log(response);
        showHideLoader(false);

        let editModal = bootstrap.Modal.getInstance(document.getElementById('countryEditModal'));
        editModal.hide();

        loadGridData();

    });
}

$(function() {
    var gridDiv = document.querySelector('#countryList');
    new agGrid.Grid(gridDiv, gridOptions);

    loadGridData();

    $('#btnEdit').bind('click', function () {
        let selectedRows = gridOptions.api.getSelectedRows();
        if(selectedRows.length === 1) {
            console.log(selectedRows[0].id);

            let editModal = new bootstrap.Modal(document.getElementById('countryEditModal'));
            editModal.show();

            let settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://localhost:8080/api/countries/"+selectedRows[0].id,
                "method": "GET",
                "headers": {
                    "cache-control": "no-cache"
                }
            }

            showHideLoader(true);

            $.ajax(settings).done(function (response) {

                $('#txtId').val(response.id);
                $('#txtCode').val(response.code);
                $('#txtName').val(response.name);

                showHideLoader(false);

                console.log(response);
            });
        }
    });

    $('#btnDelete').bind('click', function () {
        let confirmModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        confirmModal.show();
    });

    $('#btnAdd').bind('click', function () {
        let editModal = new bootstrap.Modal(document.getElementById('countryEditModal'));
        editModal.show();

        $('#txtId').val(0);
        $('#txtCode').val('');
        $('#txtName').val('');
    });

    $('#btnAddUpdateCountry').bind('click', addUpdateCountry);

    $('#btnDeleteCountry').bind('click', function () {

        let selectedRows = gridOptions.api.getSelectedRows();
        if(selectedRows.length !== 1) {
            return;
        }

        let id = selectedRows[0].id;

        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:8080/api/countries/" + id,
            "method": "DELETE",
            "headers": {
                "cache-control": "no-cache"
            },
            "timeout" : 3000
        }

        showHideLoader(true);

        $.ajax(settings).done(function (response) {
            showHideLoader(false);

            let confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
            confirmationModal.hide();

            loadGridData();
        });
    });
});