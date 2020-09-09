$(function () {
    getUserInfo()

    // 实现退出功能
    var layer = layui.layer;
    $("#btnLogout").on('click', function () {
        layer.confirm('确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token');
            // 2. 重新跳转到登录页面
            location.href = '/login.html';

            layer.close(index);
        });
    })


})


//获取用户信息
function getUserInfo() {
    $.ajax({
        type: "get",
        url: "/my/userinfo",
        // headers 就是请求头配置对象
        //统一放在APi里了
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            //console.log(res);  //{status: 0, message: "获取用户基本信息成功！", data: {…}}

            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data)
        }
    });
}



// 渲染用户头像和名称
function renderAvatar(user) {
    // 1. 获取用户的名称
    var name = user.nickname || user.username;
    // 2. 设置欢迎的文本
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name);
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // attr() 方法设置或返回被选元素的属性值。 $("img").attr("width","180");
        $('.layui-nav-img').attr("src", user.user_pic).show(); //头像显示
        $('.text-avatar').hide(); //字幕显隐
    } else {
        $('.layui-nav-img').hide(); //头像显示
        var first = name[0].toUpperCase(); //转大写
        $('.text-avatar').html(first).show();
    }
}