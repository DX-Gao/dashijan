$(function () {

    var layer = layui.layer
    var form = layui.form

    initCate();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res); //{status: 0, message: "获取文章分类列表成功！", data: Array(4)}
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr);

                // 一定要记得调用 form.render() 方法 ,要不然不显示
                form.render();
            }
        });
    }

    // 调用 initEditor() 方法，初始化富文本编辑器：
    initEditor()    //引入脚本tinymce_setup.js就可调用这个方法










})