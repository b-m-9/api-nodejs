if (!docs) {
    console.error('docs is not defined');
}
var f;
function scanMethods(text, group, accessId) {
    var countFind = 0;
    var firstMethod;
    text = text.toLowerCase();
    for (let a = 0; a < docs.length; a++) {
        if (docs[a].description.toLowerCase().indexOf(text) !== -1 || docs[a].title.toLowerCase().indexOf(text) !== -1 || docs[a].method.toLowerCase().indexOf(text) !== -1) {
            if (docs[a].group === group || group === 'all') {
                if (docs[a].access === accessId - 1 || accessId === 1) {
                    UIkit.$('#method_API_' + docs[a].method).show({animate:true});
                    countFind++;
                    if(!firstMethod) firstMethod = '#method_API_' + docs[a].method;
                } else {
                    UIkit.$('#method_API_' + docs[a].method).hide({animate:true});
                }
            } else {
                UIkit.$('#method_API_' + docs[a].method).hide({animate:true});
            }
        }
        else {
            UIkit.$('#method_API_' + docs[a].method).hide({animate:true});
        }
    }
    if(countFind === 1) {
        console.log(countFind,firstMethod+' .uk-accordion-content');
        UIkit.$(firstMethod+' .uk-accordion-content').show({animate: true});
    }

}

var group = [];
var grouphtml = '<option value=\'all\'>All groups</option>';
for (var i in docs) {
    if (group.indexOf(docs[i].group) === -1) {
        group.push(docs[i].group);
        grouphtml += '<option>' + docs[i].group + '</option>';
    }
}
$('#group-scan').html(grouphtml);
var accessId = 1;
var textScan = '';
var groupType = $('#group-scan').val();

function setGroup(id) {
    for (var a = 1; a <= 3; a++)
        if (id === a) {
            if (id !== accessId) {
                accessId = id;
                $('#btn-scan-type-' + a).addClass('active');

            }
        } else
            $('#btn-scan-type-' + a).removeClass('active');
    scanMethods(textScan, groupType, accessId);
}

$('#group-scan').on('change', function () {
    groupType = $('#group-scan').val();
    scanMethods(textScan, groupType, accessId);
});
function scanS() {
    textScan = $('#input-scan').val();
    scanMethods(textScan, groupType, accessId);
}
$('#btn-scan').on('click', scanS);
