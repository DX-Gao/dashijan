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
    initEditor(); //引入脚本tinymce_setup.js就可调用这个方法

    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();

        $('#coverFile').on('change', function (e) {
            e.preventDefault();
            // 获取到文件的列表数组
            var files = e.target.files;
            if (files.length == 0) {
                return layer.msg('请选择上传的图片！')
            } else {
                // 根据文件，创建对应的 URL 地址
                var newImgURL = URL.createObjectURL(files[0]);
                // 为裁剪区域重新设置图片
                $image.cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', newImgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })

    })

    // 定义文章的发布状态
    var art_state = '已发布';
    // 存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })

    // 基于Form表单创建FormData对象
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0]);
        // console.log(fd);
        // / 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state);

        // 裁剪后的封面追加到FormData对象中
        $image.cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })


        // 发起Ajax请求实现发布文章的功能
        function publishArticle(fd) {
            $.ajax({
                type: "post",
                url: "/my/article/add",
                data: fd,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg('发布文章失败！');
                    } else {
                        layer.msg('发布文章成功！');
                        location.href = '/article/art_list.html'
                    }
                }
            });
        }

    })


















})