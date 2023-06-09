$(function () {
    // 歌曲列表
    var playList = [" 红日 ", " 狼的诱惑 ", " 漂洋过海来看你 "];
    // 当前播放的歌曲序号
    var currentIndex = 0;
    // 播放器的原生对象
    var audio = $("#song")[0];
    // 播放时间数组
    var timeArr = [];
    // 歌词数组
    var lrcArr = [];
    // 调用播放前设置
    setup();
    // 播放歌曲
    playMusic();
    // 播放歌曲
    function playMusic() {
        // 播放歌曲
        audio.play();
        // 设置为暂停的图片
        $("#playOrPauseImg").attr("src", "img/audio/pause@2x.png");
    }

    // 歌曲播放前设置
    function setup() {
        // 设置播放哪一首歌曲
        // img/audio/ 红日 .mp3
        audio.src = "img/audio/" + playList[currentIndex] + ".mp3";
        // 设置歌曲的名字
        $("#titleSpan").text(playList[currentIndex]);
        // 设置歌词
        setLrc();
    }

    // 设置歌词
    function setLrc() {
        // 清空上一首的歌词
        $("#lrcDiv span").remove();
        // 清空数组
        timeArr = [];
        lrcArr = [];
        // 加载歌词文件
        $.get("img/audio/" + playList[currentIndex] + ".lrc", {}, function (data) {
            if (data) {
                // 按行切割字符串
                var arr = data.split("\n");
                // 分割歌词
                for (var i = 0; i < arr.length; i++) {
                    // 分割时间和歌词
                    var tempArr = arr[i].split("]");
                    if (tempArr.length > 1) {
                        // 添加时间和歌词到数组
                        timeArr.push(tempArr[0]);
                        lrcArr.push(tempArr[1]);
                    }
                }

                // 显示歌词
                for (var i = 0; i < lrcArr.length; i++) {
                    $("#lrcDiv").append("<span>" + lrcArr[i] + "</span>");
                }
            }
        });
    }

    // 播放暂停事件
    $("#playOrPauseImg").click(function () {
        // 如果播放器是暂停状态
        if (audio.paused) {
            // 继续播放
            playMusic();
        } else {
            // 暂停
            audio.pause();
            // 变成播放的图片
            $("#playOrPauseImg").attr("src", "img/audio/play@2x.png");
        }
    });

    // 上一首
    $("#prevImg").click(function () {
        // 如果是第一首，那么跳到最后一首
        if (currentIndex == 0) {
            currentIndex = playList.length - 1;
        } else {
            currentIndex--;
        }
        // 播放前设置
        setup();
        // 播放
        playMusic();
    });

    // 下一首
    $("#nextImg").click(function () {
        // 如果是最后一首，就跳到第一首
        if (currentIndex == playList.length - 1) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        // 播放前设置
        setup();
        // 播放
        playMusic();
    });

    // 监听播放器播放时间改变事件
    audio.addEventListener("timeupdate", function () {
        // 当前播放时间
        var currentTime = audio.currentTime;
        // 总时间
        var totalTime = audio.duration;
        // 当是数字的时候
        if (!isNaN(totalTime)) {
            // 得到播放时间与总时长的比值
            var rate = currentTime / totalTime;
            // 设置时间显示
            // 播放时间
            $("#playTimeSpan").text(getFormatterDate(currentTime));
            // 总时长
            $("#totalTimeSpan").text(getFormatterDate(totalTime));
            // 设置进度条
            $("#progressDiv").css("width", rate * 375 + "px");
            // 设置进度圆点
            $("#pointerImg").css("left", (375 - 15) * rate - 3 + "px");
            // 设置歌词的颜色和内容的滚动
            for (var i = 0; i < timeArr.length - 1; i++) {
                if (!isNaN(getTime(timeArr[i]))) {
                    // 当前播放时间大于等于 i 行的时间，并且小于下一行的时间
                    if (currentTime >= getTime(timeArr[i]) && currentTime < getTime(timeArr[i + 1])) {
                        // 当前行歌词变红色
                        $("#lrcDiv span:eq(" + i + ")").css("color", "#FF0000");
                        // 其他行歌词变白色
                        $("#lrcDiv span:not(:eq(" + i + "))").css("color", "#FFFFFF");
                        // 当前行歌词滚动
                        $("#lrcDiv").stop(false, true).animate({ "margin-top": 260 - 40 * i + "px" }, 1000);
                    }
                }
            }
        }
    });

    function getTime(timeStr) {
        // 去掉左边的 [
        var arr = timeStr.split("[");
        if (arr.length > 1) {
            // 得到右边的时间
            var str = arr[1];
            // 分割分、秒
            var tempArr = str.split(":");
            // 分
            var m = parseInt(tempArr[0]);
            // 秒
            var s = parseFloat(tempArr[1]);
            return m * 60 + s;
        }
        return;
    }

    // 格式化时间（ 00 ： 00 ）
    function getFormatterDate(time) {
        // 分
        var m = parseInt(time / 60);
        // 秒
        var s = parseInt(time % 60);
        // 补零
        m = m > 9 ? m : "0" + m;
        s = s > 9 ? s : "0" + s;
        return m + ":" + s;
    }
});