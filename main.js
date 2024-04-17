var audio = new Audio();
audio.preload = true;
var charvol = {
    cbt: [
        "igiari",
        "objection",
        "yiyi",
        "fandui",
        "matta",
        "kurae",
        "dengdeng",
        "kanzhege",
        "kanzhao",
        "holdit",
        "takethat",
    ],
    yuj: [
        "igiari",
        "objection",
        "yiyi",
        "fandui",
        "matta",
        "kurae",
        "holdit",
        "takethat",
    ],
    qian: [
        "igiari",
        "objection",
        "yiyi",
        "matta",
        "kurae",
        "holdit",
        "takethat",
    ],
    wang: [
        "igiari",
        "objection",
        "fandui",
        "matta",
        "kurae",
        "dengdeng",
        "kanzhege",
        "holdit",
        "takethat",
    ],
    xin: [
        "igiari",
        "objection",
        "fandui",
        "matta",
        "kurae",
        "dengdeng",
        "kanzhege",
        "holdit",
        "takethat",
    ],
    ming: ["igiari", "objection", "yiyi"],
    hao: ["igiari", "objection", "yiyi"],
    godo: ["igiari", "objection", "yiyi"],
    xiang: ["igiari", "objection", "fandui"],
    yanei: ["igiari", "objection", "yiyi", "fandui"],
    xun: ["igiari", "objection", "fandui"],
    nayuta: ["igiari", "objection", "fandui"],
};
let amx = 0;
let amy = 0;
let amz = 0;

var lmd = localStorage.getItem("igiari_lmd") || 5;
document.getElementById("lmd").value = lmd;
let msg = lmd >= 20 ? "握紧设备！" : "平放于桌面";
document.getElementById("lmdv").innerHTML = `[${Number(lmd).toFixed(
    1
)}]&nbsp;&nbsp;${msg}`;
// document.getElementById("lmdv").innerHTML = lmd;
var inob = false;
var selchar = localStorage.getItem("igiari_char") || "cbt";
if (selchar === "igiari") {
    selchar = "cbt";
    localStorage.setItem("igiari_char", "cbt");
}
var selvol = localStorage.getItem("igiari_vol") || "igiari";
document.getElementById("img1").src = "img/" + selvol + ".png";

document.getElementById("character").value = selchar;
document.getElementById("voicetype").value = selvol;
var automusic = false;
var touchtime = new Date().getTime();
var mousemode = false;
if (localStorage.getItem("igiari_hide") === "1" && !device.ios()) {
    document.getElementById("title-div").classList.add("hide2");
    document.getElementById("panel1").classList.add("hide2");
    document.getElementById("9487616885").classList.add("hide2");
} else {
    document.getElementById("title-div").classList.remove("hide2");
    document.getElementById("panel1").classList.remove("hide2");
    document.getElementById("9487616885").classList.remove("hide2");
}

try {
    for (ele of document.getElementById("voicetype").options) {
        if (charvol[selchar].includes(ele.value)) {
            ele.disabled = false;
        } else {
            ele.disabled = true;
            if (document.getElementById("voicetype").value === ele.value) {
                selvol = charvol[selchar][0];
            }
        }
    }
    localStorage.setItem("igiari_vol", selvol);
    document.getElementById("voicetype").value = selvol;
    document.getElementById("img1").src = "img/" + selvol + ".png";
    document.getElementById("cacheok").innerHTML = "💬";
    let _filename ="sound/" + selchar + "/" + selvol + ".mp3";
    let _mp3Key = `cachedMP3_${_filename}`;
    let _cachedMP3 = localStorage.getItem(_mp3Key);
    if (_cachedMP3) {
        document.getElementById("cacheok").innerHTML = "✅";
    }else{
        downloadAndCacheMP3(filename);
    }
} catch (error) {console.warn(error);}
onload = function () {
    if (!device.mobile()) {
        document.getElementById(
            "title1"
        ).innerHTML += `<p>桌面端点此 <button id="btn3">开始</button> 或按Ctrl+Shift+Z<p>`;
        document.getElementById("btn3").addEventListener("click", function () {
            if (!mousemode) {
                document.getElementById("btn3").innerHTML = "停止";
                window.mousemode = true;
                document.body.addEventListener("mousemove", objection);
            } else {
                document.getElementById("btn3").innerHTML = "开始";
                window.mousemode = false;
                document.body.classList.remove("hidecur");
                document.body.removeEventListener("mousemove", objection);
            }
        });
    }
};

function downloadAndCacheMP3(filename,pl=false) {
    // window.inob = true;
    document.getElementById("btn1").disabled = true;
    document.getElementById("cacheok").innerHTML = "🔄";
    fetch(filename)
        .then(response => {
            const contentType = response.headers.get('Content-Type');
            if (contentType && (contentType.startsWith('audio/mpeg') || contentType.startsWith('audio/mp3'))) {
                return response.blob();
            } else {
                document.getElementById("cacheok").innerHTML = "❌";
                document.getElementById("btn1").disabled = false;
                // window.inob = false;
                setTimeout(function(){
                    alert("音频加载失败，请刷新页面重试");
                },300);
            }
        })
        .then((blob) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                const mp3Key = `cachedMP3_${filename}`;
                localStorage.setItem(mp3Key, base64data);
                console.log(`${filename} cached successfully.`);
                document.getElementById("cacheok").innerHTML = "✅";
                if(pl){
                    audio.src = base64data;
                    audio.play();
                    document.getElementById("cacheok").innerHTML = "✅";
                }
                document.getElementById("btn1").disabled = false;
                // window.inob = false;
            };
        })
        .catch((error) => {
            console.error(`Error caching ${filename}:`, error);
            document.getElementById("btn1").disabled = false;
            // window.inob = false;
            setTimeout(function(){
                alert("音频加载失败，请刷新页面重试");
            },300);
        });
}

function playMP3(filename) {
    // document.getElementById("cacheok").innerHTML = "💬";
    let mp3Key = `cachedMP3_${filename}`;
    let cachedMP3 = localStorage.getItem(mp3Key);
    if (cachedMP3) {
        audio.src = cachedMP3;
        audio.play();
        document.getElementById("cacheok").innerHTML = "✅";
    } else {
        downloadAndCacheMP3(filename,true);
    }
}

function clearAudioCache() {
    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('cachedMP3_')) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });

    console.log('音频缓存已清空');
}

if (device.ios()) {
    function requestOrientationPermission() {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {
                if (response == "granted") {
                    window.addEventListener("devicemotion", dm);
                }
            })
            .catch(console.error);
    }
    document
        .getElementById("btn1")
        .addEventListener("click", requestOrientationPermission);
} else {
    window.addEventListener("devicemotion", dm);
}

function dm(event) {
    document.getElementById("sensok").innerHTML = "✅";
    let acc = event.acceleration;
    accx = acc.x || 0;
    accy = acc.y || 0;
    accz = acc.z || 0;
    Math.abs(accx) > Math.abs(amx) ? (amx = accx) : 0;
    Math.abs(accy) > Math.abs(amy) ? (amy = accy) : 0;
    Math.abs(accz) > Math.abs(amz) ? (amz = accz) : 0;
    document.getElementById("sens").innerHTML = `${accx.toFixed(
        2
    )}, ${accy.toFixed(2)}, ${accz.toFixed(2)}<br>Max: ${amx.toFixed(
        2
    )}, ${amy.toFixed(2)}, ${amz.toFixed(2)}`;
    if (
        Math.abs(accx) >= lmd ||
        Math.abs(accy) >= lmd ||
        Math.abs(accz) >= lmd
    ) {
        objection();
    }
}

document.getElementById("btn1").addEventListener("click", function () {
    objection();
});

document.getElementById("btn2").addEventListener("click", function () {
    amx = amy = amz = 0;
});

document.getElementById("btn3").addEventListener("click", function () {
    if(confirm("确定要清空音频缓存吗？清空后需要重新加载音频")){
        clearAudioCache();
        alert("清空完成！");
        document.getElementById("cacheok").innerHTML = "💬";
    }
});

document.getElementById("lmd").addEventListener("input", function () {
    window.lmd = document.getElementById("lmd").value;
    localStorage.setItem("igiari_lmd", lmd);
    let msg = lmd >= 20 ? "握紧设备！" : "平放于桌面";
    document.getElementById("lmdv").innerHTML = `[${Number(lmd).toFixed(
        1
    )}]&nbsp;&nbsp;${msg}`;
});

document.getElementById("obje-div").addEventListener("click", function () {
    if (new Date().getTime() - touchtime < 300) {
        document.getElementById("title-div").classList.toggle("hide2");
        document.getElementById("panel1").classList.toggle("hide2");
        document.getElementById("9487616885").classList.toggle("hide2");
        if (
            [...document.getElementById("panel1").classList].includes("hide2")
        ) {
            localStorage.setItem("igiari_hide", 1);
        } else {
            localStorage.setItem("igiari_hide", 0);
        }
        // console.log("dblclick");
    } else {
        touchtime = new Date().getTime();
        // console.log("click")
    }
});

document.getElementById("character").addEventListener("change", (e) => {
    window.selchar = document.getElementById("character").value;
    localStorage.setItem("igiari_char", selchar);
    for (ele of document.getElementById("voicetype").options) {
        if (charvol[selchar].includes(ele.value)) {
            ele.disabled = false;
        } else {
            ele.disabled = true;
            if (document.getElementById("voicetype").value === ele.value) {
                selvol = charvol[selchar][0];
                localStorage.setItem("igiari_vol", selvol);
                document.getElementById("voicetype").value = selvol;
                document.getElementById("img1").src = "img/" + selvol + ".png";
                document.getElementById("cacheok").innerHTML = "💬";
                downloadAndCacheMP3("sound/" + selchar + "/" + selvol + ".mp3");
            }
        }
    }
    let filename="sound/" + selchar + "/" + selvol + ".mp3";
    let mp3Key = `cachedMP3_${filename}`;
    let cachedMP3 = localStorage.getItem(mp3Key);
    if (cachedMP3) {
        document.getElementById("cacheok").innerHTML = "✅";
    }else{
        downloadAndCacheMP3(filename);
    }
});

document.getElementById("voicetype").addEventListener("change", (e) => {
    window.selvol = document.getElementById("voicetype").value;
    localStorage.setItem("igiari_vol", selvol);
    document.getElementById("img1").src = "img/" + selvol + ".png";
    document.getElementById("cacheok").innerHTML = "💬";
    let filename="sound/" + selchar + "/" + selvol + ".mp3";
    let mp3Key = `cachedMP3_${filename}`;
    let cachedMP3 = localStorage.getItem(mp3Key);
    if (cachedMP3) {
        document.getElementById("cacheok").innerHTML = "✅";
    }else{
        downloadAndCacheMP3(filename);
    }
});

document.getElementById("automusic").addEventListener("change", (e) => {
    window.automusic = document.getElementById("automusic").checked;
    localStorage.setItem("igiari_autom", automusic);
});

function objection() {
    if (!inob) {
        try {
            clearTimeout(timer1);
        } catch (e) {}
        window.inob = true;
        setTimeout(() => {
            document.getElementById("img1").classList.remove("hide");
            if (!device.ios()) {
                window.navigator.vibrate(400);
            }
            shake("img1");
        }, 200);
        if (automusic) {
            setTimeout(() => {
                try {
                    document.querySelector(".aplayer-play").click();
                } catch (e) {}
            }, 600);
        }
        document.getElementById("btn1").disabled = true;
        // document.getElementById("lmd").disabled = true;
        document.getElementById("character").disabled = true;
        document.getElementById("voicetype").disabled = true;
        playMP3("sound/" + selchar + "/" + selvol + ".mp3");
        window.timer1 = setTimeout(() => {
            if (inob) {
                document.getElementById("img1").classList.add("hide");
                // for (let ele of document.getElementsByName("vol")) {
                //     if (ele.value <= 4) {
                //         ele.disabled = false;
                //     }
                // }
                document.getElementById("btn1").disabled = false;
                // document.getElementById("lmd").disabled = false;
                document.getElementById("character").disabled = false;
                document.getElementById("voicetype").disabled = false;
                window.inob = false;
            }
            try {
                clearTimeout(timer1);
            } catch (e) {}
        }, 1300);
    }
}

function shake(elemId) {
    let elem = document.getElementById(elemId);
    if (!device.ios()) {
        if (elem) {
            elem.classList.add("shake");
            setTimeout(() => {
                elem.classList.remove("shake");
            }, 800);
        }
    } else {
        const startTime = Date.now();
        const startX = parseFloat(window.getComputedStyle(elem).left);
        const startY = parseFloat(window.getComputedStyle(elem).top);

        function animate() {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / 200, 1);
            const t = progress * Math.PI * 2;

            const offsetX = Math.sin(t * 10) * 6;
            const offsetY = Math.cos(t * 10) * 6;
            elem.style.left = startX + offsetX + "px";
            elem.style.top = startY + offsetY + "px";

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                elem.style.left = startX + "px";
                elem.style.top = startY + "px";
            }
        }

        animate();
    }
}

document.body.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.shiftKey && event.keyCode == 90) {
        event.preventDefault();
        if (!mousemode) {
            document.getElementById("btn3").innerHTML = "停止";
            window.mousemode = true;
            document.body.classList.add("hidecur");
            document.body.addEventListener("mousemove", objection);
        } else {
            document.getElementById("btn3").innerHTML = "开始";
            window.mousemode = false;
            document.body.classList.remove("hidecur");
            document.body.removeEventListener("mousemove", objection);
        }
    }
});
