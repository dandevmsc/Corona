
$(document).ready(function () {
    var t = $('#coronadata').DataTable({
        "paging": true,
        "filter": false,
        "dom": '<"top">lrt<"bottom">p<"clear">',
        "scrollX": true,
        "order": [[1, "desc"]],
        "language": {
            "decimal": ".",
            "thousands": ","
        },
        "columnDefs": [
            {
                targets: 0,
                className: 'dt-body-center'
            },
            {
                targets: 1,
                className: 'dt-body-center'
            },
            {
                targets: 2,
                className: 'dt-body-center'
            },
            {
                targets: 3,
                className: 'dt-body-center'
            },
            {
                targets: 4,
                className: 'dt-body-center'
            },
            {
                targets: 5,
                className: 'dt-body-center'
            },
            {
                targets: 6,
                className: 'dt-body-center'
            },
            {
                targets: 7,
                className: 'dt-body-center'
            },
            {
                targets: 8,
                className: 'dt-body-center'
            }
        ]



    });
    for (var i = 0; i < fdata.length; i++) {
    let name = fdata[i]["Country-Region"]
        let con = Object.values(fdata[i]['values'][0]).slice(-1).toLocaleString()
        let dea = Object.values(deathdata[i]['values'][0]).slice(-1).toLocaleString()
        let rec = Object.values(recdata[i]['values'][0]).slice(-1).toLocaleString()

        let condiff = Object.values(fdata[i]['diff'][0]).slice(-1).toLocaleString()
        let deadiff = Object.values(deathdata[i]['diff'][0]).slice(-1).toLocaleString()
        let recdiff = Object.values(recdata[i]['diff'][0]).slice(-1).toLocaleString()

        let act = (parseInt(Object.values(fdata[i]['values'][0]).slice(-1)) - parseInt(Object.values(deathdata[i]['values'][0]).slice(-1)) - parseInt(Object.values(recdata[i]['values'][0]).slice(-1))).toLocaleString()
        let actdiff = (parseInt(Object.values(fdata[i]['diff'][0]).slice(-1)) - parseInt(Object.values(deathdata[i]['diff'][0]).slice(-1)) - parseInt(Object.values(recdata[i]['diff'][0]).slice(-1))).toLocaleString()

    
        t.row.add([
            name,
            con,
            condiff,
            dea,
            deadiff,
            rec,
            recdiff,
            act,
            actdiff

        ]).draw(false);

;
    };
});

