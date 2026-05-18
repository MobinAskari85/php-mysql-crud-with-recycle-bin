$(document).ready(function () {
    let mainData = []
    let myDelId = -1
    let maxTurn = -Infinity
    let maxTurnId = -1
    const N = 20
    let sortType = 1
    let turnList = []
    let fn = '', ft = ''
    let delData = []

    const enableBtn = () => {
        $('#submit').prop('disabled', (!$('#fname').val().length) || (mainData.length == N))
        $('#delLast').prop('disabled', (mainData.length == 0))
    }

    function createTable(value, index) {
        // info += `<tr data-id="${value.id}">
        //             <td>${index+1}</td>
        //             <td>${value.f_name}</td>
        //             <td>${value.turn}</td>
        //             <td><button class="btn btn-success btn-sm e">Edit</button></td>
        //             <td><button class="btn btn-danger btn-sm d">Delete</button></td>
        //         </tr>`
        if (maxTurn < +value.turn) {
            maxTurn = +value.turn
            maxTurnId = +value.id
        }
        const tr = $('<tr>').attr('data-id', value.id)
        tr.append($('<td>').html(index + 1))
        tr.append($('<td>').addClass('editable').html(value.f_name))
        tr.append($('<td>').html(value.turn))
        tr.append($('<td>').append($('<button>').addClass('btn btn-success btn-sm e').html('Edit')))
        tr.append($('<td>').append($('<button>').addClass('btn btn-danger btn-sm d').html('Delete')))
        $('#main tbody').append(tr)
    }
    function createTableDel(value, index) {
        const tr = $('<tr>').attr('data-id', value.id)
        tr.append($('<td>').html(index + 1))
        tr.append($('<td>').addClass('editable').html(value.f_name))
        tr.append($('<td>').html(value.turn))
        tr.append($('<td>').append($('<button>').addClass('btn btn-success btn-sm r').html('Restore')))
        tr.append($('<td>').append($('<button>').addClass('btn btn-danger btn-sm p').html('Delete')))
        $('#recycle tbody').append(tr)
    }

    function myFilter(value) {
        return (value.f_name.indexOf(fn) != -1) && (value.turn.toString().indexOf(ft) != -1)
    }

    let createTurnList = () => {
        turnList = []
        for (let i = 1; i <= N; i++)
            turnList.push(i)
        for (value of mainData) {
            let index1 = turnList.indexOf(+value.turn)
            turnList.splice(index1, 1)
        }
        console.log(turnList);

    }

    function showData() {
        $('#main tbody').empty()
        maxTurn = -Infinity
        maxTurnId = -1
        createTurnList()
        tempData = mainData.filter(myFilter)
        tempData.forEach(createTable)

        if (tempData.length != 0) {
            $('#main tfoot').html(`<tr>
                                <th colspan="2">Number Of Person</th>
                                <th colspan="3" id="nop"></th>
                            </tr>
                            <tr>
                                <th colspan="2">Max Turn</th>
                                <th colspan="3"></th>
                            </tr>`)

            $('#main tfoot').find('th').eq(1).html(mainData.length).addClass((mainData.length == N) ? 'text-danger' : 'text-primary')
            $('#main tfoot').find('th').eq(3).html(maxTurn)
        } else {
            $('#main tfoot').html('<tr class="table-danger"><th colspan="5">No Data</th></tr>')
        }

        $('.d').on('click', delClick).attr('data-bs-toggle', "modal").attr('data-bs-target', "#delModal")
        $('.e').on('click', myUpdate)
        enableBtn()
    }

    function showDelData() {
        $('#recycle tbody').empty()
        delData.forEach(createTableDel)
        $('.p').on('click', pDelClick)
        $('.r').on('click', myRestore)
    }

    function myRead() {
            $.ajax({
                method: "post",
                url: "./php/read.php",
                data: { isActive: 1 },
                success: function (response) {
                    mainData = JSON.parse(response)
                    showData()
                },

            })
            $.ajax({
                method: "post",
                url: "./php/read.php",
                data: { isActive: 0 },
                success: function (response) {
                    delData = JSON.parse(response)
                    
                    showDelData()
                },
                // error : function(){
                //     console.log('error');
                //     console.log(response);
                // }
            })
        
    }
    function modalText(myId) {
        const data = mainData.filter((value) => { return value.id == myId })
        console.log(data);

        $('#delModal .modal-body').html(`do you want to delete <span class="text-danger">${data[0].f_name}</span>
            with turn <span class="text-danger">${data[0].turn}</span> ?`)
    }

    function delClick() {
        myDelId = $(this).parents('tr').attr('data-id')
        modalText(myDelId)
    }

    function myDeleteLast() {
        myDelId = maxTurnId
        modalText(myDelId)
    }

    function myDelete() {
        $.ajax({
            method: "POST",
            url: "./php/del_restore.php",
            data: { id: myDelId, isActive: 0 },
            success: function () {
                myRead()
            }
        })
    }

    function pDelClick() {
        myDelId = $(this).parents('tr').attr('data-id')
        $.ajax({
            method: "POST",
            url: "./php/delete.php",
            data: { id: myDelId },
            success: function () {
                myRead()
            }
        })
    }

    function myRestore() {
        RestoreId = $(this).parents('tr').attr('data-id')

        $.ajax({
            method: "POST",
            url: "./php/del_restore.php",
            data: { id: RestoreId, isActive: 1 },
            success: function () {
                myRead()
            }
        })
    }

    function myEdite() {
        let myId = $(this).parents('tr').attr('data-id')
        let myFname = $(this).parent().siblings('.editable').eq(0).children().val()
        $.ajax({
            method: "POST",
            url: "./php/update.php",
            data: { id: myId, fname: myFname },
            success: function () {
                myRead()
            }
        })
    }

    function myUpdate() {
        let saveBtn = $('<button>').addClass('btn btn-warning btn-sm save').html('Save')
        let cancelBtn = $('<button>').addClass('btn btn-danger btn-sm cancel').html('Cancel')
        $(this).hide().after(cancelBtn).after(saveBtn)
        $(this).parent().siblings('.editable').each(function () {
            let input = $('<input type="text" class="form-control">').val($(this).text())
            $(this).html(input)
        })
        $('.e').prop('disabled', true)
        cancelBtn.on('click', myRead)
        saveBtn.on('click', myEdite)
    }

    let randomTurn = () => {
        let randomIndex = Math.floor(Math.random() * turnList.length)
        return turnList[randomIndex]
    }

    function myCreate(e) {
        e.preventDefault()
        let myFname = $('#fname').val()
        let myTurn = randomTurn()
        $.ajax({
            method: "POST",
            url: "./php/create.php",
            data: { fname: myFname, turn: myTurn },
            success: function () {
                myRead()
            }
        })
    }

    const sortTurn = () => {
        mainData.sort(function (a, b) { return (a.turn - b.turn) * sortType })
        sortType *= -1
        showData()
        $('thead img').toggleClass('img-reverse')
    }

    const sortName = () => {
        mainData.sort(function (a, b) {
            let x = a.f_name.toLowerCase()
            let y = b.f_name.toLowerCase()
            if (x < y) { return -1 * sortType }
            if (x > y) { return 1 * sortType }
            return (a.turn - b.turn) * sortType
        })
        sortType *= -1
        showData()
        $('thead img').toggleClass('img-reverse')
    }

    function filterName() {
        fn = $(this).val()
        showData()
    }

    function filterTurn() {
        ft = $(this).val()
        showData()
    }

    $('#fname').keyup(enableBtn)
    $('#submit').click(myCreate)
    $('#yes').click(myDelete)
    $('#delLast').click(myDeleteLast)
    $('#sortTurn').click(sortTurn)
    $('#sortName').click(sortName)
    $('#filterName').keyup(filterName)
    $('#filterTurn').keyup(filterTurn)
    $('#filter').click(function () {
        $('thead input').slideToggle().toggleClass('form-control')
    })
    myRead()
})
