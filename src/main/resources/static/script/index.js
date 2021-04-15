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
    }
}

$(function() {
    var gridDiv = document.querySelector('#countryList');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid.simpleHttpRequest({url: 'http://localhost:8080/api/countries'}).then(function(data) {
        gridOptions.api.setRowData(data);


        //$('#loader').css('display','none');
    });

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

            $.ajax(settings).done(function (response) {

                $('#txtId').val(response.id);
                $('#txtCode').val(response.code);
                $('#txtName').val(response.name);

                console.log(response);
            });
        }
    });
});