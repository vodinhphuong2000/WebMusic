const music = document.querySelector('.js-music');
const menuMusic = document.querySelector('.js-footer');
const musicClose = document.querySelector('.js-music-close');

// Hàm ẩn menumusic
function hideMenuMusic() {
    menuMusic.classList.remove('open');
}

// Hàm hiển thị menumusic )
function showMenuMusic() {
    menuMusic.classList.add('open');
 
}

//Nghe hành vi click vào để open, close
music.addEventListener('click',showMenuMusic)
musicClose.addEventListener('click',hideMenuMusic)
