$(function () {
    var layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    // 更换裁剪区域的图片
    // 为文件选择框绑定 change 事件
    $('#file').change(function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files;
        console.log(filelist); //FileList {0: File, length: 1}
        if (filelist.length == 0) {
            return layer.msg('请选择照片!')
        }

        // 1. 拿到用户选择的文件
        var file = e.target.files[0];
        console.log(file);
        // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file);
        // console.log(imgURL);
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destory') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 将裁剪后的头像上传到服务器
    $('#btnsure').click(function () {
        // 转化为 base64 格式的字符串
        var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        }).toDataURL('image/png')

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo();
            }
        })
    })




})
//转成64位编码减少服务器 的请求压力，它可以本地访问，不需要访问服务器