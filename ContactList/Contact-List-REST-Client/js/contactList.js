$(document).ready(function () {

    loadContacts();
    addContact();
    updateContact();
});

function loadContacts() {
    clearContactTable();
    var contentRows = $('#contentRows');

    $.ajax({
        type: 'GET',
        url: 'https://localhost:44390/contacts/',
        success: function (contactArray) {
            $.each(contactArray, function (index, contact) {
                var name = contact.firstName + ' ' + contact.lastName;
                var company = contact.company;
                var contactId = contact.contactId;

                var row = '<tr>';
                row += '<td>' + name + '</td>';
                row += '<td>' + company + '</td>';
                row += '<td><button type="button" class="btn btn-success" onclick="showEditForm(' + contactId + ')">Edit</button></td>';
                row += '<td><button type="button" class="btn btn-danger" onclick="deleteContact(' + contactId + ')">Delete</button></td>';
                row += '</tr>';

                contentRows.append(row);
            })

        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.')
            );
        }
    });
}

function addContact() {
    $('#addButton').click(function (event) {
        var haveValidationErrors = checkAndDisplayValidationErrors($('#addForm').find('input'));

        if (haveValidationErrors) {
            return false;
        }

        $.ajax({
            type: 'POST',
            url: 'https://localhost:44390/contact',
            data: JSON.stringify({
                firstName: $('#addFirstName').val(),
                lastName: $('#addLastName').val(),
                company: $('#addCompany').val(),
                phone: $('#addPhone').val(),
                email: $('#addEmail').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json',
            success: function () {
                $('#errorMessages').empty();
                $('#addFirstName').val('');
                $('#addLastName').val('');
                $('#addCompany').val('');
                $('#addPhone').val('');
                $('#addEmail').val('');
                loadContacts();
            },
            error: function () {
                $('#errorMessages')
                    .append($('<li>')
                        .attr({ class: 'list-group-item list-group-item-danger' })
                        .text('Error calling web service. Please try again later.'));
            }
        });

        $('#addFormDiv').hide();
        $('#contactTableDiv').show();
        $('#showAddButton').show();
    });
}

function clearContactTable() {
    $('#contentRows').empty();
}

function showEditForm() {
    $('#errorMessages').empty();

    $('#contactTableDiv').hide();
    $('#editFormDiv').show();
}

function hideEditForm() {
    $('#errorMessages').empty();

    $('#editFirstName').val('');
    $('#editLastName').val('');
    $('#editCompany').val('');
    $('#editPhone').val('');
    $('#editEmail').val('');

    $('#contactTableDiv').show();
    $('#editFormDiv').hide();
    $('#showAddButton').show();
}

function showEditForm(contactId) {
    $('errorMessages').empty();

    $.ajax({
        type: 'GET',
        url: 'https://localhost:44390/contact/' + contactId,
        success: function (data, status) {
            $('#editFirstName').val(data.firstName);
            $('#editLastName').val(data.lastName);
            $('#editCompany').val(data.company);
            $('#editPhone').val(data.phone);
            $('#editEmail').val(data.email);
            $('#editContactId').val(data.contactId);
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                .attr({ class: 'list-group-item list-group-item-danger' })
                .text('Error calling web service. Please try again later.'));
        }
    })

    $('#contactTableDiv').hide();
    $('#editFormDiv').show();
    $('#showAddButton').hide();
}

function updateContact(contactId) {
    $('#updateButton').click(function (event) {
        var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'));

        if (haveValidationErrors) {
            return false;
        }

        $.ajax({
            type: 'PUT',
            url: 'https://localhost:44390/contact/' + $('#editContactId').val(),
            data: JSON.stringify({
                contactId: $('#editContactId').val(),
                firstName: $('#editFirstName').val(),
                lastName: $('#editLastName').val(),
                company: $('#editCompany').val(),
                phone: $('#editPhone').val(),
                email: $('#editEmail').val(),
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'dataType': 'json',
            'success': function () {
                $('#errorMessages').empty();
                hideEditForm();
                loadContacts();
            },
            'error': function () {
                $('#errorMessages')
                    .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
            }
        })
    })
}

function deleteContact(contactId) {
    $.ajax({
        type: 'DELETE',
        url: 'https://localhost:44390/contact/' + contactId,
        success: function () {
            loadContacts();
        }
    });
}

function checkAndDisplayValidationErrors(input) {
    $('#errorMessages').empty();

    var errorMessages = [];

    input.each(function () {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
            $('#errorMessages').append($('<li>').attr({ class: 'list-group-item list-group-item-danger' }).text(message));
        });

        return true;
    } else {
        return false;
    }
}

function showAddForm() {
    $('#errorMessages').empty();

    $('#contactTableDiv').hide();
    $('#showAddButton').hide();
    $('#addFormDiv').show();
}

function hideAddForm() {
    $('#errorMessages').empty();

    $('#contactTableDiv').show();
    $('#showAddButton').show();
    $('#addFormDiv').hide();
}