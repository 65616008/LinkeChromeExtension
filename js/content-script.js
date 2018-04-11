console.log('this is content-script.js');
//这个JS是运行在当前浏览器标签页内的，相当于植入,所引用的jQuery文件来自popup.html
//通过content_script, 插入js代码到目标网页, 这样就可以使用executeScript调用本地函数了
//这个JS文件没法使用chrome.tabs.executeScript()函数
//监听事件
var data = 0;
var tdTtt = [[1, 2, 3, 4]];
var resultData = new Array();
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {//监听请求request，请求对象sender，发送相应的函数sendResponse
        // console.log('request:'+JSON.stringify(request));


        // console.log('typeof request：' + typeof request);
        // console.log('request[\'data\'][0]:' + request['data'][0]);
        // console.log('request[\'data\'].length:' + request['data'].length);

        // console.log('request[\'excelFileName\']:'+request['excelFileName']);
        // console.log('request[\'excelFileName\'][0]:'+request['excelFileName'][0]);
        // console.log('request[\'excelFileName\'][\'data\'].length:'+request['excelFileName'].length);

        // console.log('JS原生方式获取：'+document.getElementById('btnStart').innerHTML);
        //console.log('jQuery方式获取:'+$("#btnStart")[0].innerHTML);
// $('#btnStart').value


        //var one = setInterval(show, 3000);

        //如果监听捕获到的请求action为start，则执行以下操作==================================
        if (request.action === "start") {

            console.log('this page was change');
            //设置搜索输入框按照货号搜索
            document.getElementById('goodsAttrSelectText').setAttribute('name', 'shelfNo');
            document.getElementById('goodsAttrSelectText').setAttribute('placeholder', '输入货号搜索');

            try {
                var goodsText = document.getElementById('goodsAttrSelectText');//商品查询的框
                var btnGoodsSearch = document.getElementsByClassName('e-search-goods-list')[0];//商品搜索按钮
                var tr = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                var tdText;
                var tdStatus;//商品状态
                // for(var i=0; i<request['data'].length; i++){
                //     // console.log('resultData[i]:'+resultData[i]);
                //     // console.log('i:'+i);
                //     // console.log('request[\'data\'][i]:' + request['data'][i]);
                //
                //     if(tdText == '暂无商品'){ console.log('没有数据');tdStatus='没有上架'; }else{ console.log('有数据');tdStatus='已上架'; }
                //     resultData.push([request['data'][i],tdStatus]);
                //
                // }

                var i = 0;
                var fun = setInterval(function () {
                    if (i < request['datae'].length) {
                        console.log('setInterval run:' + i);
                        console.log('setInterval run at:' + new Date());
                        goodsText.value = request['datae'][i];
                        btnGoodsSearch.click();
                        setTimeout(function () {
                            console.log('setTimeout run at:' + new Date());
                            tdText = tr[0].innerText;
                            //console.log('tdText is:'+tdText);
                            if (tdText === '暂无商品') {
                                console.log('没有数据');
                                tdStatus = '没有上架';
                            } else {
                                console.log('有数据');
                                tdStatus = '已上架';
                            }

                            console.log('request[\'datae\'][i]:' + request['datae'][i]);
                            //console.log('tdStatus:'+tdStatus);
                            resultData.push([request['datae'][i], tdStatus]);
                            console.log('resultData[i]:' + resultData[[i]]);
                            i++;
                        }, 3000);

                    } else {
                        clearInterval(fun);
                    }
                }, 6000);

            } catch (e) {
                console.log('获取不到页面元素，请检查当前页面是否正确');
                //alert('获取不到页面元素，请检查当前页面是否正确');
                return;
            }
            console.log('no end');
        }

        //如果监听捕获到的请求action为SetCommission，则执行以下操作==================================
        if (request.action === "SetCommission") {
            funSetCommission(request);
        }

        //如果监听捕获到的请求action为Download，则执行以下操作=====================================
        if (request.action === "Download") {
            //var win = chrome.extension.getBackgroundPage();
            // if(request){console.log('request有数据')}else{console.log('request没有数据')}
            //console.log('---------tdText:'+tdTtt);

            var filename = "write尔尔.xlsx";
            //var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]];
            var ws_name = "SheetJS";

            if (typeof console !== 'undefined') console.log(new Date());
            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.aoa_to_sheet(resultData);
            XLSX.utils.book_append_sheet(wb, ws, ws_name);

            /* write workbook */
            if (typeof console !== 'undefined') console.log(new Date());
            XLSX.writeFile(wb, filename);
            if (typeof console !== 'undefined') console.log(new Date() + '-------------');


        }


        // if (request.action === "copy") {//如果监听捕获到的请求action为copy，则执行以下操作
        //
        //
        //     console.log('this page was change');
        //
        //     var ctrl = $("#sb_form_q"); //获取微软bing搜索框
        //     if (ctrl.length > 0) {
        //         if (sendResponse) sendResponse(ctrl.val());//如果sendResponse存在，则发送内容给请求的popup.js的response
        //     } else {
        //         console.log("No data");
        //     }
        // } else if (request.action === "paste") {
        //     var ctrl = $("#input"); //获取360搜索的搜索框
        //     if (ctrl.length > 0) {
        //         ctrl.val(request.data);
        //         sendResponse("OK");
        //     } else {
        //         console.log("No data");
        //     }
        // }


        //通过往原生页面写script标签，给body增加data属性，data的值为要获取的数据的值，
        // 扩展这边通过获取该属性值的方式获取数据，因为扩展和页面是分开的两个环境（曲线救国）
        //等于原生页面向扩展这边传递数据
        //如果监听捕获到的请求action为getVal，则执行以下操作=============================
        if (request.action === "getVal") {
            sayHello();
            //原生页面想扩展这边传递数据
            // setTimeout(function() {
            //     var script = document.createElement('script');
            //     script.type = 'text/javascript';
            //     script.innerHTML = "document.body.setAttribute('data-xxx', qqq);";//qqq为原生页面的变量
            //     document.head.appendChild(script);
            //     document.head.removeChild(script);
            //
            //     console.log(document.body.getAttribute('data-xxx'));
            // }, 3000);

            //调用原生页面的函数
            // setTimeout(function() {
            //     var script = document.createElement('script');
            //     script.type = 'text/javascript';
            //     script.innerHTML = "showsome();";//showsome()为原生页面的函数
            //     document.head.appendChild(script);
            //     document.head.removeChild(script);
            //
            // }, 3000);

        }
    });

function funSetCommission(data) {
    console.log('typeof request：' + typeof data);

    console.log('checkStatus:'+data['checkStatus']);
    console.log('radionum:'+data['radionum']);

    try {
        var runMax = data['datae'].length;
        var setCommissionGoodsText = document.getElementById('queryGoodsName');//商品查询的框
        var btnSearch = document.getElementsByClassName('g-searchBtn')[0];//商品搜索按钮
        var tbodySetCommission = document.getElementById("goodsSettingTable");
        var trSetCommission = tbodySetCommission.getElementsByTagName("tr");
        var btnSetCommission = document.getElementById('isComm');//设置店员佣金按钮
        //if (trSetCommission.length <= 0) console.log("无tr元素");

        var i = 0;
        var run = setInterval(function () {
            if (i < runMax) {
                console.log('setInterval run:' + i);
                console.log('setInterval run at:' + new Date());
                setCommissionGoodsText.value = data['datae'][i][0];
                btnSearch.click();//点击商品搜索按钮
                setTimeout(function () {
                    if (trSetCommission.length > 0) {
                        trSetCommission[0].getElementsByClassName('listCheckboxIcon')[0].click();//点击商品前的复选框
                        btnSetCommission.click(
                            function(){
                            }
                        );//点击批量设置店员佣金按钮
                        console.log('是否要求验证：'+document.getElementsByClassName('g-dialog').length);
                        console.log("有tr元素"+ new Date());
                        setTimeout(function(){
                                if(document.getElementsByClassName('g-dialog').length > 0){ alert('请先进行身份验证！'); }//如果出现需要微信验证的情况，就阻塞进程，等验证通过后再继续运行
                            console.log('request[\'data\']['+i+'][0]:' + data['datae'][i][0]);
                            console.log('request[\'data\']['+i+'][1]:' + data['datae'][i][1]);
                            if(data['radionum']){
                                document.getElementById('percentVal').value = data['datae'][i][1];//填入佣金百分比
                                document.getElementsByName('plsz')[0].click();//点击按百分比的单选按钮
                            }else{
                                document.getElementById('fixPrice').value = data['datae'][i][1];//填入佣金金额
                                document.getElementsByName('plsz')[1].click();//点击按金额的单选按钮
                            }
                            if(data['checkStatus']){
                                document.getElementsByClassName('checkboxIcon')[0].click();//点击同步修改下级所有门店的复选框
                            }
                            document.getElementsByClassName('g-btn')[0].click();//点击确定按钮
                            i++;
                        },2000);
                    }else{
                        console.log("无tr元素"+ new Date());
                    }
                },2000);
            } else {
                clearInterval(run);
                console.log('程序运行结束！');
            }
        }, 10000);

    } catch (e) {
        console.log('获取不到页面元素，请检查当前页面是否正确');
        //alert('获取不到页面元素，请检查当前页面是否正确');
        return;
    }
}

function sayHello() {
    console.log('Hello');
    setTimeout(function(){
        console.log('one');
        alert('请先进行身份验证！');
        setTimeout(function(){console.log('two')},2000);
    },2000);


}