console.log('this is popup.js');
//这个JS是运行在谷歌扩展popup.html的,这个JS的数据是不会存储的，只能传给其他JS页面
$(function () {

    var publicexceldata;
    var tableName;
    var tableCommission;
    var tableNameData = new Array();

    $('#excel-file').change(function (e) {
        var files = e.target.files;

        var fileReader = new FileReader();
        fileReader.onload = function (ev) {
            try {
                var data = ev.target.result,
                    workbook = XLSX.read(data, {
                        type: 'binary'
                    }), // 以二进制流方式读取得到整份excel表格对象
                    exceldata = []; // 存储获取到的数据
            } catch (e) {
                console.log('文件类型不正确');
                return;
            }

            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    console.log(fromTo);
                    exceldata = exceldata.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    break; // 如果只取第一张表，就取消注释这行
                }
            }

            console.log(exceldata);
            //console.log(persons[0]);
            //console.log(persons[0].姓名);
            publicexceldata = exceldata;//把表格获取到的值传递给外面的变量


        };

        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
    });

    //检查商品上架情况==============================================================================
    $("#btnStart").click(function () {
        chrome.tabs.update(null, {url: "http://em.ematong.com/egoods/goods/list"}, function (tab) {
        });
        tableName = document.getElementById('tableName').value;
        console.log('tableName:' + tableName);
        console.log('typeof tableName:' + (typeof tableName));
        console.log('tableName.length:' + tableName.length);

        if (tableName.length === 0) {
            alert('请输入编码表头');
            console.log('tableName.length === 0');
            return;
        }
        if (publicexceldata == undefined) {
            alert('请先导入表格');
            console.log('publicexceldata == undefined');
            return;
        }


        //if(tableName === null){ console.log('error'); return; }
        //console.log('publicexceldata:'+JSON.stringify(publicexceldata));
        // console.log('publicexceldata[0]:'+JSON.stringify(publicexceldata[0].key));
        // return;

        for (var i = 0; i < publicexceldata.length; i++) {
            //console.log('第'+i+'次循环给tableNameData数组push');
            //把表头为tableName的数据放到tableNameData数组里，replace把两端的空格去掉
            try {
                tableNameData.push(publicexceldata[i][tableName].replace(/(^\s*)|(\s*$)/g, ""));
            } catch (e) {
                console.log('输入编码表头名称与表格的不符');
                alert('输入编码表头名称与表格的不符');
                return;
            }
            //console.log('tableNameData的值：'+tableNameData[i]);
        }
        console.log('tableNameData的值by btnStart：' + tableNameData);
        // var win = chrome.extension.getBackgroundPage();
        // win.data = tableNameData;

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            // 发送一个copy消息出去
            chrome.tabs.sendMessage(tabs[0].id, {action: 'start', datae: tableNameData}, function (response) {
            });
        });
    });

    //设置佣金===================================================
    $("#btnSetCommission").click(function () {
        // chrome.tabs.update(null, {url: "http://em.ematong.com/egoods/goods/list"}, function(tab){});
        //alert('提示！请先选好要设置的店，否则设置过后无法恢复，如果没选好，请先关闭本标签页，重新打开本页选好设置的店之后再运行此程序，如果已经设置好，请点击确定');
        var con = confirm('提示！请先选好要设置的【店】【百分比】或【金额】，否则设置过后无法恢复，如果没选好，请点击取消，设置好后再运行此程序，如果已经设置好，请点击确定');
        if(con==true){ console.log('选择确定，开始运行') }else{ console.log('选择取消，结束运行');return; }
        tableName = document.getElementById('tableName').value;
        tableCommission = document.getElementById('tableCommission').value;
        // console.log('tableName:'+tableName);
        // console.log('typeof tableName:'+(typeof tableName));
        // console.log('tableName.length:'+tableName.length);
        var checkStatus = document.getElementById('checkboxSynchro').checked;//获取是否同步下级的复选框
        var radionum = document.getElementsByName('radio1')[0].checked;

        if (tableName.length === 0) {
            alert('请输入编码表头');
            console.log('tableName.length === 0');
            return;
        }
        if (tableCommission.length === 0) {
            alert('请输入佣金表头');
            console.log('tableCommission.length === 0');
            return;
        }
        if (publicexceldata == undefined) {
            alert('请先导入表格');
            console.log('publicexceldata == undefined');
            return;
        }

        for (var i = 0; i < publicexceldata.length; i++) {
            //把表头为tableName的数据放到tableNameData数组里，replace把两端的空格去掉
            try {

                tableNameData.push([publicexceldata[i][tableName],publicexceldata[i][tableCommission]]);
                // console.log([publicexceldata[i][tableName],publicexceldata[i][tableCommission]]);
                console.log('tableNameData[' + i + ']:' + tableNameData[i]);
                // console.log('typeof publicexceldata[i][tableName]:'+ typeof publicexceldata[i][tableName]);
                // console.log('typeof publicexceldata[i][tableCommission]:'+ typeof publicexceldata[i][tableCommission]);
            } catch (e) {
                console.log('error:' + e);
                alert('输入编码表头名称与表格的不符' + e);
                return;
            }
        }

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            // 发送一个copy消息出去
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'SetCommission',
                datae: tableNameData,
                checkStatus: document.getElementById('checkboxSynchro').checked,
                radionum: document.getElementsByName('radio1')[0].checked
                }, function (response) {
            });
        });

    });

    //下载操作结果==============================================================================
    $("#btnDownload").click(function () {

        //给当前页面注入JS代码，但是产生的变量不能在console控制台调用
        //chrome.tabs.executeScript(null,{code:"console.log('给当前页面注入JS代码');"});
        console.log('start------------------');

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            // 发送一个copy消息出去
            chrome.tabs.sendMessage(tabs[0].id, {action: 'Download'}, function (response) {
                // 这里的回调函数接收到了要抓取的值，获取值得操作在下方content-script.js
                // 将值存在background.js的data属性里面。
                // var win = chrome.extension.getBackgroundPage();
                // win.data = response;
                // console.log('response:'+response);
            });
        });

        //chrome.tabs.executeScript(null,{file: "js/injection.js"});

        // chrome.tabs.executeScript(null,{code:"var filename = \"write111111.xlsx\";"+
        // "var data = [[1,2,3,4],[true, false, null, \"sheetjs\"],[\"foo\",\"bar\",new Date(\"2014-02-19T14:30Z\"), \"0.3\"], [\"baz\", null, \"qux\"]];"+
        // "var ws_name = \"SheetJS\";\n"+
        // "if(typeof console !== 'undefined') console.log(new Date());"+
        // "var wb = XLSX.utils.book_new();"+
        // "var ws = XLSX.utils.aoa_to_sheet(data);"+
        // "console.log('wb:'+wb);"+
        // "console.log('ws:'+ws);"+
        // "XLSX.utils.book_append_sheet(wb, ws, ws_name);"+
        // "if(typeof console !== 'undefined') console.log(new Date());"+
        // "XLSX.writeFile(wb, filename);"+
        // "if(typeof console !== 'undefined') console.log(new Date());"
        // });

        console.log('end------------------');

    });

    var testnum = 300;

    //通过往原生页面写script标签，往里填充代码的方式实现获取扩展这边的数据，因为扩展和页面是分开的两个环境（曲线救国）
    //等于扩展这边向原生页面传递数据=============================================================
    $("#btnSetVal").click(function () {
        console.log('btnSetVal start------------------');

        chrome.tabs.executeScript(null, {
            code: "var script=document.createElement(\"script\");" +
            "script.type=\"text/javascript\";" +
            "document.body.appendChild(script);" +
            "script.innerHTML=\"var ttt = " + testnum + "\";"

        });
    });

    //获取$("#btnSetVal").click()给页面设置的变量==================================
    $("#btnGetVal").click(function () {

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            // 发送一个copy消息出去
            chrome.tabs.sendMessage(tabs[0].id, {action: 'getVal'}, function (response) {
                // 这里的回调函数接收到了要抓取的值，获取值得操作在下方content-script.js
                // 将值存在background.js的data属性里面。
                // var win = chrome.extension.getBackgroundPage();
                // win.data = response;
                // console.log('response:'+response);
            });
        });


        // var script = document.createElement("script");
        // script.innerHTML = "var ccc = 222;";
        // console.log('script:'+script);
        //  chrome.tabs.executeScript(null,{code:"document.body.appendChild("+script+");"});
        // chrome.tabs.executeScript(null,{code:"console.log('循环开始');setInterval(\"console.log('循环开始----')\", 2000);"});
    });

    //页面转跳测试========================================================
    $("#btnGoBaidu").click(function () {
        // chrome.tabs.create({url: "https://www.baidu.com"}, function(tab){});
        chrome.tabs.update(null, {url: "https://www.baidu.com"}, function (tab) {
        });
    });


});