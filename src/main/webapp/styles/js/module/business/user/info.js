/**
 * Created by  moxz
 * User: 224911261@qq.com
 * 2016/3/17-15:58
 * habit-team-server.
 */
requirejs(['jquery', 'bootstrap', 'comm', 'message'],
    function () {
        $('#back').on('click', function () {
            window.history.go(-1);
        });
        setHeightSelf(800);
        $("#avatar").append('<img src="' + getSmallImgUrl(user.avatar) + '" class="img-circle">');
        $("#nickName").append(user.nickname);
        var userHtml = (user.sex == "MALE") ? "男" : "女" + "_" + (user.single == "true") ? "单身" : "脱光" + '<br>';
        userHtml += (user.motto == null) ? "" : user.motto + '<br>';
        userHtml += (user.phone == null) ? "" : user.phone + '<br>';
        $("#info").append(userHtml);

        var habits = "";
        $.each(habitList, function (i, e) {
            habits += '<tr><td>'+e.alarmClock+'</td>';
            habits += '<td>'+((e.duration == "true") ? "是" :"否")+'</td>';
            habits += '<td>'+e.executeDays+'</td>';
            habits += '<td>'+e.points+'</td>';
            habits += '<td>'+((e.motto == null) ? "-" :e.motto)+'</td>';
            habits += '<td><button type="button" class="btn btn-primary btn-sm" onclick="viewActivity(\''+e.id+'\')">查看</button></td></tr>';

        });
        $("#habits").append(habits);
        var groups = "";
        $.each(groupList, function (i, e) {
            groups += '<tr><td>'+e.name+'</td>';
            groups += '<td>'+e.master+'</td>';
            groups += '<td>'+e.member+'</td>';
            groups += '<td>'+e.habitString.substr(0,40)+'</td></tr>';
        });
        $("#groups").append(groups);

        if(groupList.length>1&&habitList.length>1) {
            setHeightSelf(groupList.length * 30 + habitList.length * 30);
        }


    });


function viewActivity(userHabitId) {
    window.location.href = WEB_GLOBAL_CTX+"/habit/activity/list?userHabitId="+userHabitId;
}