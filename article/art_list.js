$(function () {
    var laypage = layui.laypage;
    var layer = layui.layer;
    var form = layui.form;
    // 文章列表功能

    // 定义查询参数对象q
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }



    initTable();
    // 请求文章列表数据并使用模板引擎渲染列表结构
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: "get",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                // console.log(res);
                // q=={status: 0, message: "获取文章列表成功！", data: Array(2), total: 3}
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败！')
                }
                layer.msg('获取文章列表success！');
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                renderPage(res.total); //调用自定义渲染分页的方法
            }
        });
    }

    // 定义美化时间格式的过滤器=====拼接+补零
    template.defaults.imports.dataFormat = function (date) {
        // const定义的变量不可以修改，而且必须初始化。
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dt.getDate();
        d = d < 10 ? '0' + d : d;

        var hh = dt.getHours();
        hh = hh < 10 ? '0' + hh : hh;
        var mm = dt.getMinutes();
        mm = mm < 10 ? '0' + mm : mm;
        var ss = dt.getSeconds();
        ss = ss < 10 ? '0' + ss : ss;

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    initCate()
    // 发起请求获取并渲染文章分类的下拉选择框
    function initCate() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr);

                // 通过 layui 重新渲染表单区域的UI结构
                ////参考form--更新渲染的使用
                form.render(); //渲染所有form的表单
            }
        });
    }

    // 实现筛选的功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取到表单中选中的值
        var cate_id = $('#form-search [name="cate_id"]').val();
        var state = $('#form-search [name="state"]').val();
        // 查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();

    })



    // 自定义渲染分页的方法
    function renderPage(total) {
        // console.log("页面的数据条目: " + total); //3个

        ////////////////参考layui的分页///////////////////
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            // 每页显示的条数。laypage将会借助 count 和 limit 计算出分页数
            curr: q.pagenum, // 设置默认被选中的分页
            // 自定义排版。可选值有：count（总条目输区域）、prev（上一页区域）、page（分页区域）、next（下一页区域）、limit（条目选项区域）、refresh（页面刷新区域。注意：layui 2.3.0 新增） 、skip（快捷跳页区域）
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //每页条数的选择项。如果 layout 参数开启了 limit，则会出现每页条数的select选择框[10, 20, 30, 40, 50]
            limits: [1, 2, 3, 5, 10],
            jump: function (obj, first) {

                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit

                //obj包含了当前分页的所有参数，比如：
                // console.log('当前页码: ' + obj.curr); //得到当前页码，以便向服务端请求对应页的数据。
                // console.log('是否首次: ' + first); //是否首次，一般用于初始加载的判断 是首次true 否undefined



                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });

    }

    ////////////////////////////////////////////////////////////////////////////

    // 实现删除文章的功能
    $('tbody').on('click', '.btn-delete', function () {
        // 获取到文章的 id
        var id = $(this).attr('data-id');
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        console.log(len);
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                type: "get",
                url: "/my/article/delete/" + id,
                data: $(this).serialize(),
                success: function (res) {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message, {
                            icon: 2
                        });
                    }
                    layer.msg(res.message, {
                        icon: 6
                    });

                    // 解决删除文章时的小 Bug(删除后，页码值虽然正常，但是当前页码的数据没有渲染出来)
                    // q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }


                    initTable();
                }
            });


            layer.close(index);
        });
    })





























})