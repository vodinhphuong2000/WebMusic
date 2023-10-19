const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".container-setting__playmusic-button");
const nameMusic = $(".container-setting__namemusic-name");
const nameSinger = $(".container-setting__namemusic-singer");
const cdThumb = $(".container-music");
const audio = $("#audio");
const playBtn = $(".container-setting__playmusic-button");
const progress = $(".container-setting__timemusi-rang");
const backBtn = $(".icon-back");
const nextBtn = $(".icon-next");
const randomBtn = $(".icon-random");
const repeatBtn = $(".icon-repeat");
const playlist = $(".footer-list");
const currentTime = $(".time-current");
const endTime = $(".time-end");
const rangeVolume = $(".container-setting__volume-rang");
const app = {
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  currentIndex: 0,
  songs: [
    {
      name: "Unity",
      singer: "Alan Walker",
      path: "./assets/song/unity.mp3",
      image: "./assets/img/unity.jpg",
    },
    {
      name: "Faded",
      singer: "Alan Walker",
      path: "./assets/song/faded.mp3",
      image: "./assets/img/faded.jpg",
    },
    {
      name: "Nevada",
      singer: "Alan Walker",
      path: "./assets/song/nevada.mp3",
      image: "./assets/img/nevada.jpg",
    },
    {
      name: "Bài Ca Đất Phương Nam",
      singer: "NSƯT Trọng Phúc",
      path: "./assets/song/datphuongnam.mp3",
      image: "./assets/img/datphuongnam.jpg",
    },
    {
      name: "Nấu Cho Em Ăn",
      singer: "Đen",
      path: "./assets/song/nauchoeman.mp3",
      image: "./assets/img/nauchoeman.png",
    },
    {
      name: "SummerTime",
      singer: "K 391",
      path: "./assets/song/summertime.mp3",
      image: "./assets/img/summertime.jpg",
    },
    {
      name: "Gấp Đôi Yêu Thương",
      singer: "Tuấn Hưng",
      path: "./assets/song/gapdoiyeuthuong.mp3",
      image: "./assets/img/gapdoiyeuthuong.jpg",
    },
    {
      name: "Rượu Mừng Hóa Người Dưng",
      singer: "TLong",
      path: "./assets/song/ruoumunghoanguoidung.mp3",
      image: "./assets/img/ruoumunghoanguoidung.jpg",
    },
    {
        name: "Cảm Ơn Em Đã Đến Bên Anh",
        singer: "Thái Học",
        path: "./assets/song/camonemdadenbenanh.mp3",
        image: "./assets/img/camonemdadenbenanh.jpg",
      },
  ],
  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  render() {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="footer-list-heading ${
          index === this.currentIndex ? "footer-list-heading-active" : ""
        } " data-index="${index}">
            <div class="footer-list__img">
            <div class="footer-list__img-singer" style="background-image: url('${
              song.image
            }');"></div>
            </div>
            <div class="footer-list__music">
                <p class="footer-list__name">${song.name}</p>
                <p class="footer-list__singer">${song.singer}</p>
            </div>
            <div class="footer-list__more">
                <i class="icon-more fa-solid fa-ellipsis"></i>
            </div>
        </div>
        `;
    });
    $(".footer-list").innerHTML = htmls;
  },
  handleEvent() {
    const _this = this;
    // const cd =$('.cd)')
    // const cdWidth = cd.offsetWidth
    // document.onscroll = function(){
    //     const scrollTop = window.scrollY || document.documentElement.scrollTop
    //     const newCdWidth =cdWidth - scrollTop
    //     cd.style.width = newCdWidth > 0 ? newCdWidth : 0
    //     cd.style.opacity = newCdWidth/cdWidth
    // }
    //Xử lý để CD quay
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    //Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //Khi play bài hát
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    //Khi pause bài hát
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
        //Thời gian bài hát
        const currentTimeSecond = timeFormat(audio.currentTime);
        currentTime.textContent = currentTimeSecond;
        const endTimeSecond = timeFormat(audio.duration);

        function timeFormat(seconds) {
          let minute = Math.floor(seconds / 60);
          let second = Math.floor(seconds % 60);
          minute = minute < 10 ? "0" + minute : minute;
          second = second < 10 ? "0" + second : second;
          return minute + ":" + second;
        }
        if (endTimeSecond != "NaN:NaN") {
          endTime.textContent = endTimeSecond;
        }
      }
    };
    //Xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //Khi back song
    backBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //Xử lý bật/tắt random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    //Xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // Xử lý phát ại 1 song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    //Lắng nghe hành vi click vào playlists
    playlist.onclick = function (e) {
      const songNode = e.target.closest(
        ".footer-list-heading:not(.footer-list-heading-active)"
      );
      if (songNode || e.target.closest(".icon-more")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
    //Xử lý âm lượng cho song
    rangeVolume.oninput = (e) => {
      const currentVolume = e.target.value / 100;

      audio.volume = currentVolume;
    };
  },
  scrollToActiveSong() {
    setTimeout(() => {
      $(".footer-list-heading.footer-list-heading-active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },
  loadCurrentSong() {
    // console.log(nameMusic, nameSinger, cdThumb, audio)

    nameMusic.innerText = this.currentSong.name;
    nameSinger.innerText = this.currentSong.singer;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong() {
    this.currentIndex--;
    console.log(this.currentIndex, this.songs.length - 1);
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start() {
    //Định nghĩa các thuộc tính cho object
    this.defineProperties();
    //Lắng nghe/ xử lý các sự kiện (DOM event)
    this.handleEvent();
    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    this.scrollToActiveSong();
    //Render lại các bài hát
    this.render();
  },
};
app.start();
