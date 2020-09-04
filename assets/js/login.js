$(function () {

    $('.login-box').on('click', "#link_reg", function () {
        $('.login-box').hide().siblings(".reg-box").show();
    });
    $('.reg-box').on('click', "#link_login", function () {
        $('.reg-box').hide().siblings(".login-box").show();
    })

    // 从 layui 中获取 form 对象
    var form = layui.form;
    // layer 是弹层组件
    var layer = layui.layer;

    // 通过 form.verify() 函数自定义校验规则
    // lay-verify：注册form模块需要验证的类型
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                }
                if (/^\d+\d+\d$/.test(value)) {
                    return '用户名不能全为数字';
                }
            }
            //我们既支持上述函数式的方式，也支持下述数组的形式
            //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
            ,
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repassword: function (val) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== val) {
                return '两次密码不一致！'
            }
        }

    });

    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function (e) {
        // 表单提交要禁用自带提交，改为Ajax
        e.preventDefault();
        var data = {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        }
        $.post("/api/reguser",
            data,
            function (res) {
                // console.log(res);  //{status: 0, message: "注册成功！"}
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('有表情地提示', {
                    icon: 6
                });
                $("#form_reg #link_login").click();
            }
        );
    })

    // 监听登录表单的提交事件
    $("#form-login").submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('登录失败！');
                }
                //登录成功的提示框
                layer.msg('有表情地提示', {
                    icon: 6
                });
                localStorage.setItem('token', res.token);
                // $("#form-login").val('');
                location.href = '/index.html'


            }
        });
    })



})