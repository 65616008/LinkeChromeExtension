console.log('this is injection.js');
//console.log('win.data:'+win.data);
var win = chrome.extension.getBackgroundPage();
console.log('win:'+win);
// var filename = "write.xlsx";
// var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]];
// var ws_name = "SheetJS";
//
// if(typeof console !== 'undefined') console.log(new Date());
// var wb = XLSX.utils.book_new();
// var ws = XLSX.utils.aoa_to_sheet(data);
// console.log('wb:'+wb);
// console.log('ws'+ws);
// XLSX.utils.book_append_sheet(wb, ws, ws_name);
//
// /* write workbook */
// if(typeof console !== 'undefined') console.log(new Date());
// XLSX.writeFile(wb, filename);
// if(typeof console !== 'undefined') console.log(new Date());