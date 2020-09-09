$(function () {
    var layer = layui.layer;
    var form = layui.form;

    form.verify({
        nickname: function (val) {
            if (val.trim().length > 6) {
                return layer.msg('昵称长度必须在 1 ~ 6 个字符之间！')
            }
        }
    })

    initUserInfo();

    // 获取/初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            type: "get",
            url: "/my/userinfo",
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // 为表单快速赋值
                // 为谁赋值（formUserInfo），赋啥值（res.data）
                // 表单赋值 / 取值:调用form.val('filter', object);
                form.val('formUserInfo', res.data);
            }
        });
    }



    // 实现表单的重置效果
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })

    // 发起请求更新用户的信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                //console.log(res);  //{status: 0, message: "修改用户信息成功！"}
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }

                layer.msg('更新用户信息成功！');
                // 更新完清除/初始化
                // initUserInfo(function () {
                //     window.parent.getUserInfo();
                // });
                // 调用父页面中的方法，重新渲染用户的头像(renderAvatar()方法)和用户的信息（getUserInfo（）方法）
                // 1. 子页面调用父页面方法：
                // 格式： parent.父页面方法
                // getUserInfo(function (user) {
                //     // 调用父窗口的函数
                //     window.parent.renderAvatar(user)
                // })
                window.parent.getUserInfo();


            }
        });
    })

})