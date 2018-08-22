async function kien () {
    var ret = 0;
    ret = await ret + 1;
    return ret;
}

var ok = kien().then(function(a){console.log(a);})
console.log(ok);