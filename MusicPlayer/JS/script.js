//获取DOM元素
let nowPlaying = document.querySelector(".now-playing");
let trackArt = document.querySelector(".track-art");
let trackName = document.querySelector(".track-name");
let trackArtist = document.querySelector(".track-artist");
let player = document.querySelector(".player");
let myBody = document.body;
let wrapper = document.querySelector(".wrapper");
let lyricWrapper = document.querySelector(".lyric-wrapper");
let wrapperAll = document.querySelector(".wrapper-all");

let buttons = document.querySelector(".buttons");
let playPauseBtn = document.querySelector(".playpause-track");
let nextBtn = document.querySelector(".next-track");
let prevBtn = document.querySelector(".prev-track");
let randomBtn = document.querySelector(".random-track");
let downloadBtn = document.querySelector(".download-track");
let nightBtn = document.querySelector(".night-model");

let seekSlider = document.querySelector(".seek-slider");
let volumeSlider = document.querySelector(".volume-slider");
let currentTime = document.querySelector(".current-time");
let totalDuration = document.querySelector(".total-duration");
let currentTrack = document.createElement("audio");

//歌词相关
let lyricContainer = document.querySelector(".lyric-container");
let lyric;

let nowLyric = 0;
let trackIndex = 0;
let isPlaying = false;
let isRandom = false;
let isNight = false;
//当前歌词是否已经播放完毕
let isOver = true;
let updateTimer;

//歌曲列表
const musicList = [
  {
    img: "images/bitter-gourd.jpg",
    name: "Bitter Gourd",
    artist: "Eason Chan",
    music: "music/bitter-gourd.mp3",
    lyric: "lrc/bitter-gourd.lrc",
  },
  {
    img: "images/grape.jpg",
    name: "Ripe Grapes",
    artist: "Eason Chan",
    music: "music/grape.mp3",
    lyric: "lrc/grape.lrc",
  },
  {
    img: "images/over.jpg",
    name: "Over",
    artist: "Eason Chan",
    music: "music/over.mp3",
    lyric: "lrc/over.lrc",
  },
];

//播放功能
function reset() {
  currentTime.textContent = "00:00";
  seekSlider.value = 0;
}

function loadTrack(trackIndex) {
  //关掉定时器
  clearInterval(updateTimer);
  reset();
  currentTrack.src = musicList[trackIndex].music;
  getLyric(musicList[trackIndex].lyric);
  currentTrack.preload = "metadata";
  currentTrack.play();

  trackArt.style.backgroundImage = "url(" + musicList[trackIndex].img + ")";
  trackName.textContent = musicList[trackIndex].name;
  trackArtist.textContent = musicList[trackIndex].artist;
  nowPlaying.textContent =
    "Playing music     " + (trackIndex + 1) + "     of     " + musicList.length;

  updateTimer = setInterval(setUpdate, 100);
  //audio结束播放后自动播放下一首
  currentTrack.addEventListener("ended", nextTrack);
}

/*   针对audio标签不能进入页面自动播放：window.onload = window.onload = trackInit();
 *    报错信息：Uncaught (in promise) : DOMException: play() failed
 *            because the user didn't interact with the document first in console
 *		 通俗地讲：我们需要做些什么让audio标签播放
 */
function trackInit() {
  currentTrack.src = musicList[trackIndex].music;
  getLyric(musicList[trackIndex].lyric);
  trackArt.style.backgroundImage = "url(" + musicList[trackIndex].img + ")";
  trackName.textContent = musicList[trackIndex].name;
  trackArtist.textContent = musicList[trackIndex].artist;
  nowPlaying.textContent =
    "Playing music     " + (trackIndex + 1) + "     of     " + musicList.length;
  updateTimer = setInterval(setUpdate, 1000);
  currentTrack.addEventListener("ended", nextTrack);
}
window.addEventListener("load", trackInit);

//针对currentTrack.duration返回NAN的解决思路
function durationTime() {
  let durationMinutes = Math.floor(currentTrack.duration / 60);
  let durationSections = Math.floor(
    currentTrack.duration - durationMinutes * 60
  );
  if (durationSections < 10) {
    durationSections = "0" + durationSections;
  }
  if (durationMinutes < 10) {
    durationMinutes = "0" + durationMinutes;
  }
  totalDuration.textContent = durationMinutes + ":" + durationSections;
}

//进度条和歌曲已播放时间
function setUpdate() {
  let seekPosition = 0;
  seekPosition = (currentTrack.currentTime / currentTrack.duration) * 100;
  seekSlider.value = seekPosition;

  let currentMinutes = Math.floor(currentTrack.currentTime / 60);
  let currentSections = Math.floor(
    currentTrack.currentTime - currentMinutes * 60
  );

  if (currentSections < 10) {
    currentSections = "0" + currentSections;
  }
  if (currentMinutes < 10) {
    currentMinutes = "0" + currentMinutes;
  }
  currentTime.textContent = currentMinutes + ":" + currentSections;
}

//随机播放的功能开关
function randomTrack() {
  isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
  isRandom = true;
  randomBtn.classList.add("randomActive");
}

function pauseRandom() {
  isRandom = false;
  randomBtn.classList.remove("randomActive");
}
//夜间模式
function nightModel() {
  isNight ? whiteModel() : blackModel();
}
function blackModel() {
  isNight = true;
  nightBtn.innerHTML = '<i class="fas fa-sun"></i>';
  myBody.style.backgroundColor = "black";
  myBody.style.color = "white";
  // player.style.backgroundColor = 'rgb(85, 85, 88)';
  lyricWrapper.style.backgroundColor = "rgb(89, 89, 91)";
  wrapper.style.backgroundColor = "rgb(89, 89, 91)";
  lyricContainer.style.color = "rgba(244, 239, 239, 0.436)";
}
function whiteModel() {
  isNight = false;
  nightBtn.innerHTML = '<i class="fas fa-moon"></i>';
  myBody.style.backgroundColor = "white";
  myBody.style.color = "black";
  lyricWrapper.style.backgroundColor = "white";
  wrapper.style.backgroundColor = "white";
  lyricContainer.style.color = "rgba(97, 97, 97, 0.436)";
}

//下载歌曲
function downloadTrack() {
  let a = document.createElement("a");
  a.setAttribute("href", currentTrack.src);
  a.setAttribute("target", "_blank");
  a.click();
}

//暂停播放功能
function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}
function playTrack() {
  currentTrack.play();
  isPlaying = true;
  trackArt.classList.add("rotate");
  trackArt.classList.remove("paused-play");
  trackArt.classList.add("active-play");
  playPauseBtn.innerHTML = '<i class="fas fa-pause-circle fa-4x"></i>';
}

function pauseTrack() {
  currentTrack.pause();
  isPlaying = false;
  // trackArt.classList.remove("rotate");
  trackArt.classList.add("rotate");
  trackArt.classList.remove("active-play");
  trackArt.classList.add("paused-play");
  playPauseBtn.innerHTML = '<i class="fas fa-play-circle fa-4x"></i>';
}

//随机播放功能
function nextTrack() {
  if (trackIndex < musicList.length - 1 && isRandom === false) {
    trackIndex++;
  } else if (trackIndex < musicList.length - 1 && isRandom === true) {
    let randomIndex = Number.parseInt(Math.random() * musicList.length);
    if (randomIndex === trackIndex) {
      nextTrack();
    } else {
      trackIndex = randomIndex;
    }
  } else {
    trackIndex = 0;
  }
  loadTrack(trackIndex);
  playTrack();
}

//上一首
function prevTrack() {
  if (trackIndex > 0) {
    trackIndex -= 1;
  } else {
    trackIndex = musicList.length - 1;
  }
  loadTrack(trackIndex);
  playTrack();
}

//滑动歌曲进度
function seekTo() {
  let seekto = currentTrack.duration * (seekSlider.value / 100);
  currentTrack.currentTime = seekto;
  for (let i = 0; i < lyric.length; i++) {
    let line = document.getElementById("line-" + i);
    line.classList.remove("current-line");
    if (
      currentTrack.currentTime >= lyric[i][0] &&
      currentTrack.currentTime < lyric[i + 1][0]
    ) {
      let scrollunit = lyricContainer.scrollHeight / lyric.length,
					nowLine = document.getElementById("line-" + i);
			nowLyric = i;
			nowLine.classList.add("current-line");
      lyricContainer.scrollTop = scrollunit * nowLyric - 190;
      isOver = false;
    }
  }
}

//设置歌曲音量
function setVolume() {
  currentTrack.volume = volumeSlider.value / 100;
}

//获取歌词
function getLyric(url) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "text";
  xhr.onload = function () {
    //lyric是个全局变量
    lyric = parseLyric(xhr.response);
    appendLyric(lyric);
  };
  xhr.send();

  //加载过慢的交互效果
  lyricContainer.textContent = "loading lyric...";
}

//处理lrc文件，时间轴、歌词内容等
function parseLyric(text) {
  let lines = text.split("\n"),
    pattern = /\[\d{2}:\d{2}.\d{3}\]/g,
    noBlankArr = [],
    lyricResult = [];

  // console.log(lines);
  //去掉歌词为空的元素！
  lines.forEach(function (line) {
    if (line.replace(pattern, "")) {
      noBlankArr.push(line);
    }
  });
  //获得每个元素为 时长+歌词数组 的数组result
  noBlankArr.forEach(function (line, index) {
    let value = line.replace(pattern, "");
    let time = line.match(pattern);
    let lyircTime = time[0].slice(1, -1).split(":");

    lyricResult.push([
      parseInt(lyircTime[0], 10) * 60 + parseFloat(lyircTime[1]),
      value,
    ]);
  });
  // console.log(lyricResult);
  return lyricResult;
}

//将歌词放入HTML文件
function appendLyric(lyric) {
  let fragment = document.createDocumentFragment();
  lyricContainer.innerHTML = "";
  lyric.forEach(function (lyricArr, index) {
    var line = document.createElement("div");
    line.id = "line-" + index;
    line.textContent = lyricArr[1];
    fragment.appendChild(line);
  });
  lyricContainer.appendChild(fragment);
}

//实现滚动条与audio currentTime的同步以及添加当前歌词的样式
// function updateLyric() {
// 	let i = nowLyric;
//   if (isOver) {
//     for (i; i < lyric.length; i++) {
//       if (
//         this.currentTime >= lyric[i][0] &&
//         this.currentTime < lyric[i + 1][0]
//       ) {
//         let line = document.getElementById("line-" + i),
//           prevLine = document.getElementById("line-" + (i > 0 ? i - 1 : i)),
//           scrollunit = lyricContainer.scrollHeight / lyric.length;
//         lyricContainer.scrollTop = scrollunit * i - 170;
//         prevLine.classList.remove("current-line");
//         line.classList.add("current-line");
// 				isOver = false;
//       }
//     }
//   }
// 	if(this.currentTime >= lyric[nowLyric + 1][0]){
// 		isOver = true;
// 	}
// }

function updateLyric() {
  if (isOver) {
    let line = document.getElementById("line-" + nowLyric),
      prevLine = document.getElementById(
        "line-" + (nowLyric > 0 ? nowLyric - 1 : nowLyric)
      ),
      scrollunit = lyricContainer.scrollHeight / lyric.length;
    lyricContainer.scrollTop = scrollunit * nowLyric - 190;
    prevLine.classList.remove("current-line");
    line.classList.add("current-line");
    isOver = false;
  }
  if (this.currentTime >= lyric[nowLyric + 1][0]) {
    nowLyric++;
    isOver = true;
  }
  console.log(nowLyric);
}

//实现点击歌词audio跳转到相应位置
function updateAudio() {
  setTimeout(function () {
    for (let i = 0; i < lyric.length; i++) {
      let line = document.getElementById("line-" + i);
      line.addEventListener("click", function () {
        currentTrack.currentTime = Math.ceil(lyric[i][0] * 100) / 100;
        line.classList.add("current-line");
        for (let j = i + 1; j < lyric.length; j++) {
          let otherLine = document.getElementById("line-" + j);
          otherLine.classList.remove("current-line");
        }
        for (let k = 0; k < i; k++) {
          let otherLine = document.getElementById("line-" + k);
          otherLine.classList.remove("current-line");
        }
        nowLyric = i;
      });
    }
  }, 100);
}

//移动端适配
let mobileListener = function () {
  if (window.screen.width < 821) {
    wrapperAll.style.display = "block";
    wrapper.style.width = "82vw";
    lyricWrapper.style.display = "none";
    buttons.style.width = "82vw";
    buttons.style.justifyContent = "space-around";
  } else {
    wrapperAll.style.display = "flex";
    wrapper.style.width = "30vw";
    lyricWrapper.style.display = "flex";
    buttons.style.width = "30vw";
    buttons.style.justifyContent = "center";
  }
};
mobileListener();
window.addEventListener("resize", mobileListener);

//监听器
playPauseBtn.addEventListener("click", playpauseTrack);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);
randomBtn.addEventListener("click", randomTrack);
downloadBtn.addEventListener("click", downloadTrack);
nightBtn.addEventListener("click", nightModel);

seekSlider.addEventListener("input", seekTo);
volumeSlider.addEventListener("change", setVolume);

currentTrack.addEventListener("timeupdate", updateLyric);

currentTrack.addEventListener("loadeddata", durationTime);
currentTrack.addEventListener("loadeddata", updateAudio);

setTimeout(function () {
  for (let i = 0; i < lyric.length; i++) {
    let line = document.getElementById("line-" + i);
    line.addEventListener("click", function () {
      currentTrack.currentTime = Math.ceil(lyric[i][0] * 100) / 100;
      line.classList.add("current-line");
      for (let j = i + 1; j < lyric.length; j++) {
        let otherLine = document.getElementById("line-" + j);
        otherLine.classList.remove("current-line");
      }
      for (let k = 0; k < i; k++) {
        let otherLine = document.getElementById("line-" + k);
        otherLine.classList.remove("current-line");
      }
      nowLyric = i;
    });
  }
}, 100);
